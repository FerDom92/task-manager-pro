import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService, TaskAction } from '../permissions/permissions.service';

export const TASK_ACTION_KEY = 'task_action';

export function RequireTaskPermission(action: TaskAction) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    Reflect.defineMetadata(TASK_ACTION_KEY, action, descriptor.value);
    return descriptor;
  };
}

@Injectable()
export class TaskPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAction = this.reflector.get<TaskAction>(
      TASK_ACTION_KEY,
      context.getHandler(),
    );

    if (!requiredAction) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const taskId = request.params?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!taskId) {
      return true;
    }

    const permission = await this.permissionsService.canAccessTask(
      userId,
      taskId,
      requiredAction,
    );

    if (!permission.allowed) {
      if (permission.reason === 'Task not found') {
        throw new NotFoundException(permission.reason);
      }
      throw new ForbiddenException(permission.reason);
    }

    return true;
  }
}
