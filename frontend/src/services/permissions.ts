import { api } from './api';

export interface TaskPermissions {
  canView: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canAssign: boolean;
}

export interface ProjectPermissions {
  canView: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManageMembers: boolean;
  canCreateTasks: boolean;
}

export const permissionsService = {
  async getTaskPermissions(taskId: string): Promise<TaskPermissions> {
    const response = await api.get<TaskPermissions>(`/api/tasks/${taskId}/permissions`);
    return response.data;
  },

  async getProjectPermissions(projectId: string): Promise<ProjectPermissions> {
    const response = await api.get<ProjectPermissions>(`/api/projects/${projectId}/permissions`);
    return response.data;
  },
};
