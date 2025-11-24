import { api } from './api';
import type { Category } from '@/types';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  async create(data: { name: string; color: string }): Promise<Category> {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
