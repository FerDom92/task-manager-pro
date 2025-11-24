import { api } from './api';
import type { Project, Task } from '@/types';

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export const projectsService = {
  async getAll(): Promise<Project[]> {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  async getOne(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async create(data: CreateProjectData): Promise<Project> {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateProjectData>): Promise<Project> {
    const response = await api.patch<Project>(`/projects/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  async getTasks(id: string): Promise<Task[]> {
    const response = await api.get<Task[]>(`/projects/${id}/tasks`);
    return response.data;
  },

  async addMember(
    projectId: string,
    userId: string,
    role: string
  ): Promise<void> {
    await api.post(`/projects/${projectId}/members`, { userId, role });
  },

  async removeMember(projectId: string, memberId: string): Promise<void> {
    await api.delete(`/projects/${projectId}/members/${memberId}`);
  },
};
