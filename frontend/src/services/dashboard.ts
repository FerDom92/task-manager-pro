import { api } from './api';
import type { Task } from '@/types';

export interface DashboardStats {
  overview: {
    totalTasks: number;
    totalProjects: number;
    overdueTasks: number;
    completedThisWeek: number;
    inProgress: number;
  };
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  recentTasks: Task[];
  upcomingTasks: Task[];
}

export interface ActivityItem {
  id: string;
  title: string;
  status: string;
  project: { name: string; color: string } | null;
  timestamp: string;
  isNew: boolean;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/api/dashboard/stats');
    return response.data;
  },

  async getActivity(): Promise<ActivityItem[]> {
    const response = await api.get<ActivityItem[]>('/api/dashboard/activity');
    return response.data;
  },
};
