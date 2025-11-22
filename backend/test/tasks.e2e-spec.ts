import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/config/prisma.service';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;
  let taskId: string;

  const testUser = {
    email: `tasks-test-${Date.now()}@example.com`,
    password: 'TestPassword123',
    firstName: 'Task',
    lastName: 'Tester',
  };

  const testTask = {
    title: 'E2E Test Task',
    description: 'This is a test task',
    priority: 'HIGH',
    status: 'TODO',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get(PrismaService);

    // Register and login test user
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser);

    accessToken = registerResponse.body.accessToken;
    userId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    // Clean up
    await prisma.task.deleteMany({ where: { createdById: userId } });
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await app.close();
  });

  describe('/api/tasks (POST)', () => {
    it('should create a task', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testTask)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(testTask.title);
      expect(response.body.priority).toBe(testTask.priority);
      expect(response.body.createdById).toBe(userId);

      taskId = response.body.id;
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/tasks')
        .send(testTask)
        .expect(401);
    });

    it('should fail with missing title', async () => {
      await request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ description: 'No title' })
        .expect(400);
    });
  });

  describe('/api/tasks (GET)', () => {
    it('should return paginated tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('page');
    });

    it('should filter by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/tasks?status=TODO')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      response.body.data.forEach((task: { status: string }) => {
        expect(task.status).toBe('TODO');
      });
    });

    it('should filter by priority', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/tasks?priority=HIGH')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      response.body.data.forEach((task: { priority: string }) => {
        expect(task.priority).toBe('HIGH');
      });
    });
  });

  describe('/api/tasks/:id (GET)', () => {
    it('should return a specific task', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe(testTask.title);
    });

    it('should return 404 for non-existent task', async () => {
      await request(app.getHttpServer())
        .get('/api/tasks/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/api/tasks/:id (PATCH)', () => {
    it('should update a task', async () => {
      const updateData = { title: 'Updated Task Title', status: 'IN_PROGRESS' };

      const response = await request(app.getHttpServer())
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.status).toBe(updateData.status);
    });
  });

  describe('/api/tasks/stats (GET)', () => {
    it('should return task statistics', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('byStatus');
      expect(response.body).toHaveProperty('byPriority');
      expect(response.body).toHaveProperty('overdue');
    });
  });

  describe('/api/tasks/:id (DELETE)', () => {
    it('should delete a task', async () => {
      await request(app.getHttpServer())
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
