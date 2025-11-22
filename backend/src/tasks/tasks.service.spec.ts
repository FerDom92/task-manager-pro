import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../config/prisma.service';

describe('TasksService', () => {
  let service: TasksService;

  const mockUser = {
    id: 'user-id-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    avatar: null,
  };

  const mockTask = {
    id: 'task-id-123',
    title: 'Test Task',
    description: 'Test description',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    categoryId: null,
    projectId: null,
    assigneeId: null,
    createdById: mockUser.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: null,
    project: null,
    assignee: null,
    createdBy: mockUser,
  };

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createTaskDto = {
      title: 'New Task',
      description: 'Task description',
      priority: 'HIGH',
    };

    it('should create a task successfully', async () => {
      const createdTask = { ...mockTask, ...createTaskDto };
      mockPrismaService.task.create.mockResolvedValue(createdTask);

      const result = await service.create(createTaskDto, mockUser.id);

      expect(result).toEqual(createdTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: createTaskDto.title,
            createdById: mockUser.id,
          }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const tasks = [mockTask];
      mockPrismaService.task.findMany.mockResolvedValue(tasks);
      mockPrismaService.task.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 }, mockUser.id);

      expect(result.data).toEqual(tasks);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter tasks by status', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([mockTask]);
      mockPrismaService.task.count.mockResolvedValue(1);

      await service.findAll({ status: 'TODO', page: 1, limit: 10 }, mockUser.id);

      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'TODO',
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(mockTask);

      const result = await service.findOne(mockTask.id, mockUser.id);

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne('non-existent-id', mockUser.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto = { title: 'Updated Title' };

    it('should update a task successfully', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(mockTask);
      mockPrismaService.task.update.mockResolvedValue({
        ...mockTask,
        ...updateDto,
      });

      const result = await service.update(mockTask.id, updateDto, mockUser.id);

      expect(result.title).toBe(updateDto.title);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateDto, mockUser.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a task successfully', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(mockTask);
      mockPrismaService.task.delete.mockResolvedValue(mockTask);

      const result = await service.delete(mockTask.id, mockUser.id);

      expect(result).toEqual({ message: 'Task deleted successfully' });
    });

    it('should throw NotFoundException if task not found or not authorized', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(
        service.delete('non-existent-id', mockUser.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return task statistics', async () => {
      mockPrismaService.task.count.mockResolvedValue(10);
      mockPrismaService.task.groupBy
        .mockResolvedValueOnce([
          { status: 'TODO', _count: 5 },
          { status: 'DONE', _count: 5 },
        ])
        .mockResolvedValueOnce([
          { priority: 'HIGH', _count: 3 },
          { priority: 'MEDIUM', _count: 7 },
        ]);

      const result = await service.getStats(mockUser.id);

      expect(result).toHaveProperty('total', 10);
      expect(result).toHaveProperty('byStatus');
      expect(result).toHaveProperty('byPriority');
      expect(result).toHaveProperty('overdue');
    });
  });
});
