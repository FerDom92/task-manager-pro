import { tasksService } from '@/services/tasks';
import { api } from '@/services/api';

jest.mock('@/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('tasksService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('fetches tasks without filters', async () => {
      const mockResponse = {
        data: {
          data: [{ id: '1', title: 'Task 1' }],
          meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
        },
      };
      mockApi.get.mockResolvedValue(mockResponse);

      const result = await tasksService.getAll();

      expect(mockApi.get).toHaveBeenCalledWith('/tasks?');
      expect(result).toEqual(mockResponse.data);
    });

    it('fetches tasks with filters', async () => {
      const mockResponse = {
        data: {
          data: [{ id: '1', title: 'Task 1', status: 'TODO' }],
          meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
        },
      };
      mockApi.get.mockResolvedValue(mockResponse);

      const result = await tasksService.getAll({
        status: 'TODO',
        priority: 'HIGH',
        page: 1,
      });

      expect(mockApi.get).toHaveBeenCalledWith(
        '/tasks?status=TODO&priority=HIGH&page=1'
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('ignores empty filter values', async () => {
      const mockResponse = {
        data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
      };
      mockApi.get.mockResolvedValue(mockResponse);

      await tasksService.getAll({ status: '', search: undefined });

      expect(mockApi.get).toHaveBeenCalledWith('/tasks?');
    });
  });

  describe('getOne', () => {
    it('fetches a single task by id', async () => {
      const mockResponse = { data: { id: '123', title: 'Test Task' } };
      mockApi.get.mockResolvedValue(mockResponse);

      const result = await tasksService.getOne('123');

      expect(mockApi.get).toHaveBeenCalledWith('/tasks/123');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('create', () => {
    it('creates a new task', async () => {
      const taskData = { title: 'New Task', description: 'Description' };
      const mockResponse = { data: { id: '1', ...taskData } };
      mockApi.post.mockResolvedValue(mockResponse);

      const result = await tasksService.create(taskData);

      expect(mockApi.post).toHaveBeenCalledWith('/tasks', taskData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('update', () => {
    it('updates an existing task', async () => {
      const updateData = { title: 'Updated Task' };
      const mockResponse = { data: { id: '123', ...updateData } };
      mockApi.patch.mockResolvedValue(mockResponse);

      const result = await tasksService.update('123', updateData);

      expect(mockApi.patch).toHaveBeenCalledWith('/tasks/123', updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('delete', () => {
    it('deletes a task', async () => {
      mockApi.delete.mockResolvedValue({});

      await tasksService.delete('123');

      expect(mockApi.delete).toHaveBeenCalledWith('/tasks/123');
    });
  });

  describe('getStats', () => {
    it('fetches task statistics', async () => {
      const mockResponse = {
        data: {
          total: 10,
          byStatus: { TODO: 5, IN_PROGRESS: 3, DONE: 2 },
          byPriority: { HIGH: 2, MEDIUM: 5, LOW: 3 },
          overdue: 1,
        },
      };
      mockApi.get.mockResolvedValue(mockResponse);

      const result = await tasksService.getStats();

      expect(mockApi.get).toHaveBeenCalledWith('/tasks/stats');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
