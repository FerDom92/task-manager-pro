import { api } from './api';
import type { Category } from '@/types';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>('/api/categories');
    return response.data;
  },

  async create(data: { name: string; color: string }): Promise<Category> {
    const response = await api.post<Category>('/api/categories', data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/categories/${id}`);
  },
};
