'use client';

import { useState, useEffect, useCallback } from 'react';
import { permissionsService } from '@/services/permissions';
import type { TaskPermissions, ProjectPermissions, ProjectMember, ProjectRole } from '@/types';
import { useAuthStore } from '@/store/auth';

export function useTaskPermissions(taskId: string | undefined) {
  const [permissions, setPermissions] = useState<TaskPermissions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    if (!taskId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await permissionsService.getTaskPermissions(taskId);
      setPermissions(data);
    } catch (err) {
      setError('Failed to load permissions');
      console.error('Failed to load task permissions:', err);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return { permissions, loading, error, refetch: fetchPermissions };
}

export function useProjectPermissions(projectId: string | undefined) {
  const [permissions, setPermissions] = useState<ProjectPermissions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await permissionsService.getProjectPermissions(projectId);
      setPermissions(data);
    } catch (err) {
      setError('Failed to load permissions');
      console.error('Failed to load project permissions:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return { permissions, loading, error, refetch: fetchPermissions };
}

export function useProjectRole(members: ProjectMember[] | undefined): ProjectRole | null {
  const { user } = useAuthStore();

  if (!user || !members) return null;

  const member = members.find((m) => m.userId === user.id);
  return member?.role ?? null;
}

export function canManageProject(role: ProjectRole | null): boolean {
  return role === 'OWNER' || role === 'ADMIN';
}

export function canEditProject(role: ProjectRole | null): boolean {
  return role === 'OWNER' || role === 'ADMIN';
}

export function canCreateTasks(role: ProjectRole | null): boolean {
  return role === 'OWNER' || role === 'ADMIN' || role === 'MEMBER';
}

export function canDeleteProject(role: ProjectRole | null): boolean {
  return role === 'OWNER';
}
