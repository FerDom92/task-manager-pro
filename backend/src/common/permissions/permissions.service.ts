import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

export enum TaskAction {
  VIEW = 'view',
  UPDATE = 'update',
  DELETE = 'delete',
  ASSIGN = 'assign',
}

export enum ProjectAction {
  VIEW = 'view',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE_MEMBERS = 'manage_members',
  CREATE_TASKS = 'create_tasks',
}

export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async canAccessTask(
    userId: string,
    taskId: string,
    action: TaskAction,
  ): Promise<PermissionCheck> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            members: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!task) {
      return { allowed: false, reason: 'Task not found' };
    }

    const isCreator = task.createdById === userId;
    const isAssignee = task.assigneeId === userId;
    const projectMember = task.project?.members[0];
    const projectRole = projectMember?.role;

    switch (action) {
      case TaskAction.VIEW:
        // Creator, assignee, or project member can view
        if (isCreator || isAssignee || projectRole) {
          return { allowed: true };
        }
        return { allowed: false, reason: 'No permission to view this task' };

      case TaskAction.UPDATE:
        // Creator, assignee, or project admin/owner/member can update
        if (isCreator || isAssignee) {
          return { allowed: true };
        }
        if (projectRole && ['OWNER', 'ADMIN', 'MEMBER'].includes(projectRole)) {
          return { allowed: true };
        }
        return { allowed: false, reason: 'No permission to update this task' };

      case TaskAction.DELETE:
        // Only creator or project owner/admin can delete
        if (isCreator) {
          return { allowed: true };
        }
        if (projectRole && ['OWNER', 'ADMIN'].includes(projectRole)) {
          return { allowed: true };
        }
        return { allowed: false, reason: 'Only task creator or project admin can delete' };

      case TaskAction.ASSIGN:
        // Creator or project admin/owner can assign
        if (isCreator) {
          return { allowed: true };
        }
        if (projectRole && ['OWNER', 'ADMIN'].includes(projectRole)) {
          return { allowed: true };
        }
        return { allowed: false, reason: 'No permission to assign this task' };

      default:
        return { allowed: false, reason: 'Unknown action' };
    }
  }

  async canAccessProject(
    userId: string,
    projectId: string,
    action: ProjectAction,
  ): Promise<PermissionCheck> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: { userId },
        },
      },
    });

    if (!project) {
      return { allowed: false, reason: 'Project not found' };
    }

    const member = project.members[0];
    const role = member?.role;
    const isOwner = project.ownerId === userId;

    switch (action) {
      case ProjectAction.VIEW:
        if (role) {
          return { allowed: true };
        }
        return { allowed: false, reason: 'Not a member of this project' };

      case ProjectAction.UPDATE:
        if (isOwner || role === 'ADMIN') {
          return { allowed: true };
        }
        return { allowed: false, reason: 'Only owner or admin can update project' };

      case ProjectAction.DELETE:
        if (isOwner) {
          return { allowed: true };
        }
        return { allowed: false, reason: 'Only project owner can delete' };

      case ProjectAction.MANAGE_MEMBERS:
        if (isOwner || role === 'ADMIN') {
          return { allowed: true };
        }
        return { allowed: false, reason: 'Only owner or admin can manage members' };

      case ProjectAction.CREATE_TASKS:
        if (role && ['OWNER', 'ADMIN', 'MEMBER'].includes(role)) {
          return { allowed: true };
        }
        return { allowed: false, reason: 'Viewers cannot create tasks' };

      default:
        return { allowed: false, reason: 'Unknown action' };
    }
  }

  async getProjectRole(userId: string, projectId: string): Promise<string | null> {
    const member = await this.prisma.projectMember.findFirst({
      where: { userId, projectId },
    });
    return member?.role || null;
  }

  async getTaskPermissions(userId: string, taskId: string) {
    const [canView, canUpdate, canDelete, canAssign] = await Promise.all([
      this.canAccessTask(userId, taskId, TaskAction.VIEW),
      this.canAccessTask(userId, taskId, TaskAction.UPDATE),
      this.canAccessTask(userId, taskId, TaskAction.DELETE),
      this.canAccessTask(userId, taskId, TaskAction.ASSIGN),
    ]);

    return {
      canView: canView.allowed,
      canUpdate: canUpdate.allowed,
      canDelete: canDelete.allowed,
      canAssign: canAssign.allowed,
    };
  }

  async getProjectPermissions(userId: string, projectId: string) {
    const [canView, canUpdate, canDelete, canManageMembers, canCreateTasks] =
      await Promise.all([
        this.canAccessProject(userId, projectId, ProjectAction.VIEW),
        this.canAccessProject(userId, projectId, ProjectAction.UPDATE),
        this.canAccessProject(userId, projectId, ProjectAction.DELETE),
        this.canAccessProject(userId, projectId, ProjectAction.MANAGE_MEMBERS),
        this.canAccessProject(userId, projectId, ProjectAction.CREATE_TASKS),
      ]);

    return {
      canView: canView.allowed,
      canUpdate: canUpdate.allowed,
      canDelete: canDelete.allowed,
      canManageMembers: canManageMembers.allowed,
      canCreateTasks: canCreateTasks.allowed,
    };
  }
}
