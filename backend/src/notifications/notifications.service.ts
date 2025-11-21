import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

export enum NotificationType {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_DUE_SOON = 'TASK_DUE_SOON',
  PROJECT_INVITE = 'PROJECT_INVITE',
  MENTION = 'MENTION',
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }

  async findAll(userId: string, unreadOnly = false) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { read: false }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });
    return { count };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return { message: 'All notifications marked as read' };
  }

  async delete(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({ where: { id } });
    return { message: 'Notification deleted' };
  }

  async deleteAll(userId: string) {
    await this.prisma.notification.deleteMany({ where: { userId } });
    return { message: 'All notifications deleted' };
  }

  // Helper methods to create specific notification types
  async notifyTaskAssigned(userId: string, taskTitle: string, assignerName: string) {
    return this.create(
      userId,
      'Task Assigned',
      `${assignerName} assigned you to "${taskTitle}"`,
      NotificationType.TASK_ASSIGNED,
    );
  }

  async notifyTaskCompleted(userId: string, taskTitle: string, completerName: string) {
    return this.create(
      userId,
      'Task Completed',
      `${completerName} completed "${taskTitle}"`,
      NotificationType.TASK_COMPLETED,
    );
  }

  async notifyProjectInvite(userId: string, projectName: string, inviterName: string) {
    return this.create(
      userId,
      'Project Invitation',
      `${inviterName} invited you to "${projectName}"`,
      NotificationType.PROJECT_INVITE,
    );
  }
}
