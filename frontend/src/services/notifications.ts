import { api } from './api';
import type { Notification } from '@/types';

export const notificationsService = {
  async getAll(unreadOnly = false): Promise<Notification[]> {
    const response = await api.get<Notification[]>(
      `/notifications${unreadOnly ? '?unreadOnly=true' : ''}`
    );
    return response.data;
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get<{ count: number }>('/notifications/count');
    return response.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },

  async deleteAll(): Promise<void> {
    await api.delete('/notifications');
  },
};
