import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService, ProjectAction } from '../permissions/permissions.service';

export const PROJECT_ACTION_KEY = 'project_action';

export function RequireProjectPermission(action: ProjectAction) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    Reflect.defineMetadata(PROJECT_ACTION_KEY, action, descriptor.value);
    return descriptor;
  };
}

@Injectable()
export class ProjectPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAction = this.reflector.get<ProjectAction>(
      PROJECT_ACTION_KEY,
      context.getHandler(),
    );

    if (!requiredAction) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const projectId = request.params?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!projectId) {
      return true;
    }

    const permission = await this.permissionsService.canAccessProject(
      userId,
      projectId,
      requiredAction,
    );

    if (!permission.allowed) {
      if (permission.reason === 'Project not found') {
        throw new NotFoundException(permission.reason);
      }
      throw new ForbiddenException(permission.reason);
    }

    return true;
  }
}
