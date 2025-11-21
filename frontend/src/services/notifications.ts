import { api } from './api';
import type { Notification } from '@/types';

export const notificationsService = {
  async getAll(unreadOnly = false): Promise<Notification[]> {
    const response = await api.get<Notification[]>(
      `/api/notifications${unreadOnly ? '?unreadOnly=true' : ''}`
    );
    return response.data;
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get<{ count: number }>('/api/notifications/count');
    return response.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/api/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/api/notifications/read-all');
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/notifications/${id}`);
  },

  async deleteAll(): Promise<void> {
    await api.delete('/api/notifications');
  },
};
