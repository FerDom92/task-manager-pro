import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateTaskDto, UpdateTaskDto, FilterTasksDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto, userId: string) {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED',
        priority: dto.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        categoryId: dto.categoryId,
        projectId: dto.projectId,
        assigneeId: dto.assigneeId,
        createdById: userId,
      },
      include: {
        category: true,
        project: true,
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return task;
  }

  async findAll(filters: FilterTasksDto, userId: string) {
    const {
      status,
      priority,
      categoryId,
      projectId,
      assigneeId,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where: Record<string, unknown> = {
      OR: [{ createdById: userId }, { assigneeId: userId }],
    };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (categoryId) where.categoryId = categoryId;
    if (projectId) where.projectId = projectId;
    if (assigneeId) where.assigneeId = assigneeId;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          category: true,
          project: true,
          assignee: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        OR: [{ createdById: userId }, { assigneeId: userId }],
      },
      include: {
        category: true,
        project: true,
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    const existingTask = await this.prisma.task.findFirst({
      where: {
        id,
        OR: [{ createdById: userId }, { assigneeId: userId }],
      },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && {
          status: dto.status as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED',
        }),
        ...(dto.priority && {
          priority: dto.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.projectId !== undefined && { projectId: dto.projectId }),
        ...(dto.assigneeId !== undefined && { assigneeId: dto.assigneeId }),
      },
      include: {
        category: true,
        project: true,
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return task;
  }

  async delete(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, createdById: userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found or not authorized');
    }

    await this.prisma.task.delete({ where: { id } });

    return { message: 'Task deleted successfully' };
  }

  async getStats(userId: string) {
    const [total, byStatus, byPriority, overdue] = await Promise.all([
      this.prisma.task.count({
        where: { OR: [{ createdById: userId }, { assigneeId: userId }] },
      }),
      this.prisma.task.groupBy({
        by: ['status'],
        where: { OR: [{ createdById: userId }, { assigneeId: userId }] },
        _count: true,
      }),
      this.prisma.task.groupBy({
        by: ['priority'],
        where: { OR: [{ createdById: userId }, { assigneeId: userId }] },
        _count: true,
      }),
      this.prisma.task.count({
        where: {
          OR: [{ createdById: userId }, { assigneeId: userId }],
          dueDate: { lt: new Date() },
          status: { notIn: ['DONE', 'CANCELLED'] },
        },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce(
        (acc, item) => ({ ...acc, [item.status]: item._count }),
        {},
      ),
      byPriority: byPriority.reduce(
        (acc, item) => ({ ...acc, [item.priority]: item._count }),
        {},
      ),
      overdue,
    };
  }
}
