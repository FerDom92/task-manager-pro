import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class UserSeedService {
  constructor(private prisma: PrismaService) {}

  async createSampleData(userId: string) {
    // Create sample categories (global, check if they exist first)
    let existingCategories = await this.prisma.category.findMany();

    if (existingCategories.length === 0) {
      // Create default categories only if none exist
      existingCategories = await Promise.all([
        this.prisma.category.create({
          data: {
            name: 'Work',
            color: '#3b82f6',
          },
        }),
        this.prisma.category.create({
          data: {
            name: 'Personal',
            color: '#22c55e',
          },
        }),
        this.prisma.category.create({
          data: {
            name: 'Learning',
            color: '#8b5cf6',
          },
        }),
        this.prisma.category.create({
          data: {
            name: 'Health',
            color: '#ef4444',
          },
        }),
      ]);
    }

    // Get categories by name for reliable assignment
    const workCategory = existingCategories.find((c) => c.name === 'Work');
    const personalCategory = existingCategories.find(
      (c) => c.name === 'Personal',
    );
    const learningCategory = existingCategories.find(
      (c) => c.name === 'Learning',
    );

    // Create a sample project
    const project = await this.prisma.project.create({
      data: {
        name: 'My First Project',
        description: 'This is a sample project to help you get started. Feel free to edit or delete it!',
        color: '#6366f1',
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
    });

    // Get tomorrow and next week dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const inTwoDays = new Date();
    inTwoDays.setDate(inTwoDays.getDate() + 2);

    // Create sample tasks
    await Promise.all([
      // Task in project with category
      this.prisma.task.create({
        data: {
          title: 'Welcome to Task Manager Pro!',
          description: 'This is your first task. You can edit it, mark it as done, or delete it. Explore the app and create your own tasks!',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: tomorrow,
          projectId: project.id,
          categoryId: workCategory?.id,
          createdById: userId,
        },
      }),
      // Personal task
      this.prisma.task.create({
        data: {
          title: 'Explore the dashboard',
          description: 'Check out the dashboard to see an overview of your tasks and projects.',
          status: 'TODO',
          priority: 'LOW',
          categoryId: personalCategory?.id,
          createdById: userId,
        },
      }),
      // Learning task with due date
      this.prisma.task.create({
        data: {
          title: 'Learn keyboard shortcuts',
          description: 'Press "?" anywhere in the app to see available keyboard shortcuts.',
          status: 'TODO',
          priority: 'LOW',
          dueDate: nextWeek,
          categoryId: learningCategory?.id,
          createdById: userId,
        },
      }),
      // Task in progress
      this.prisma.task.create({
        data: {
          title: 'Try the Kanban view',
          description: 'Switch to Kanban view in the Tasks page to drag and drop tasks between columns.',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          projectId: project.id,
          createdById: userId,
        },
      }),
      // High priority task
      this.prisma.task.create({
        data: {
          title: 'Create your first category',
          description: 'Go to Categories and create a new category to organize your tasks.',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: inTwoDays,
          createdById: userId,
        },
      }),
    ]);

    // Create a welcome notification
    await this.prisma.notification.create({
      data: {
        userId,
        title: 'Welcome to Task Manager Pro!',
        message: 'We\'ve created some sample data to help you get started. Feel free to explore and delete anything you don\'t need.',
        type: 'SYSTEM',
        read: false,
      },
    });
  }
}
