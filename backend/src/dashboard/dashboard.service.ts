import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const [
      totalTasks,
      tasksByStatus,
      tasksByPriority,
      overdueTasks,
      totalProjects,
      recentTasks,
      upcomingTasks,
      completedThisWeek,
    ] = await Promise.all([
      // Total tasks
      this.prisma.task.count({
        where: { OR: [{ createdById: userId }, { assigneeId: userId }] },
      }),

      // Tasks by status
      this.prisma.task.groupBy({
        by: ['status'],
        where: { OR: [{ createdById: userId }, { assigneeId: userId }] },
        _count: true,
      }),

      // Tasks by priority
      this.prisma.task.groupBy({
        by: ['priority'],
        where: { OR: [{ createdById: userId }, { assigneeId: userId }] },
        _count: true,
      }),

      // Overdue tasks
      this.prisma.task.count({
        where: {
          OR: [{ createdById: userId }, { assigneeId: userId }],
          dueDate: { lt: new Date() },
          status: { notIn: ['DONE', 'CANCELLED'] },
        },
      }),

      // Total projects
      this.prisma.project.count({
        where: { members: { some: { userId } } },
      }),

      // Recent tasks (last 5)
      this.prisma.task.findMany({
        where: { OR: [{ createdById: userId }, { assigneeId: userId }] },
        include: {
          project: { select: { id: true, name: true, color: true } },
          assignee: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),

      // Upcoming tasks (next 7 days)
      this.prisma.task.findMany({
        where: {
          OR: [{ createdById: userId }, { assigneeId: userId }],
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          status: { notIn: ['DONE', 'CANCELLED'] },
        },
        include: {
          project: { select: { id: true, name: true, color: true } },
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
      }),

      // Completed this week
      this.prisma.task.count({
        where: {
          OR: [{ createdById: userId }, { assigneeId: userId }],
          status: 'DONE',
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      overview: {
        totalTasks,
        totalProjects,
        overdueTasks,
        completedThisWeek,
        inProgress:
          tasksByStatus.find((s) => s.status === 'IN_PROGRESS')?._count || 0,
      },
      tasksByStatus: tasksByStatus.reduce(
        (acc, item) => ({ ...acc, [item.status]: item._count }),
        {} as Record<string, number>,
      ),
      tasksByPriority: tasksByPriority.reduce(
        (acc, item) => ({ ...acc, [item.priority]: item._count }),
        {} as Record<string, number>,
      ),
      recentTasks,
      upcomingTasks,
    };
  }

  async getActivity(userId: string) {
    // Get recent task updates
    const recentUpdates = await this.prisma.task.findMany({
      where: { OR: [{ createdById: userId }, { assigneeId: userId }] },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        createdAt: true,
        project: { select: { name: true, color: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });

    return recentUpdates.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      project: task.project,
      timestamp: task.updatedAt,
      isNew:
        task.createdAt.getTime() === task.updatedAt.getTime() ||
        Date.now() - task.createdAt.getTime() < 60000,
    }));
  }
}
