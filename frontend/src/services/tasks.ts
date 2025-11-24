import { api } from './api';
import type { Task } from '@/types';

export interface TaskFilters {
  status?: string;
  priority?: string;
  categoryId?: string;
  projectId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TasksResponse {
  data: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  categoryId?: string;
  projectId?: string;
  assigneeId?: string;
}

export interface TaskStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  overdue: number;
}

export const tasksService = {
  async getAll(filters: TaskFilters = {}): Promise<TasksResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const response = await api.get<TasksResponse>(`/tasks?${params}`);
    return response.data;
  },

  async getOne(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async create(data: CreateTaskData): Promise<Task> {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateTaskData>): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async getStats(): Promise<TaskStats> {
    const response = await api.get<TaskStats>('/tasks/stats');
    return response.data;
  },
};
