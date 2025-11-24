# Task Manager Pro - Backend

REST API for Task Manager Pro built with NestJS, Prisma, and PostgreSQL.

## Tech Stack

- **Framework:** NestJS 11
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (Access + Refresh tokens)
- **Validation:** class-validator
- **Testing:** Jest

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or yarn

## Installation

### 1. Clone and navigate

```bash
git clone <repo-url>
cd task-manager-pro/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager_pro"

# JWT Secrets (use strong random strings in production)
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Server
PORT=5000
NODE_ENV=development
```

### 4. Setup database

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 5. Start the server

```bash
# Development (with hot reload)
npm run start:dev

# Production
npm run build
npm run start:prod
```

Server runs at `http://localhost:5000`

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.controller.ts   # Auth endpoints
│   ├── auth.service.ts      # Auth business logic
│   ├── jwt.strategy.ts      # JWT validation
│   ├── user-seed.service.ts # Sample data on registration
│   └── dto/                 # Data transfer objects
├── users/                   # Users module
├── tasks/                   # Tasks module
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── dto/
├── projects/                # Projects module
├── categories/              # Categories module
├── common/                  # Shared utilities
│   ├── prisma/              # Prisma service
│   └── decorators/          # Custom decorators
├── app.module.ts            # Root module
└── main.ts                  # Entry point
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and get tokens | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| PATCH | `/api/auth/me` | Update profile | Yes |
| DELETE | `/api/auth/me` | Delete account | Yes |

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | List tasks with filters | Yes |
| POST | `/api/tasks` | Create task | Yes |
| GET | `/api/tasks/stats` | Get task statistics | Yes |
| GET | `/api/tasks/:id` | Get task by ID | Yes |
| PATCH | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

**Query Parameters for GET /api/tasks:**
- `status` - Filter by status (TODO, IN_PROGRESS, DONE)
- `priority` - Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- `categoryId` - Filter by category
- `projectId` - Filter by project
- `search` - Search in title/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field
- `sortOrder` - asc or desc

### Projects

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects` | List projects | Yes |
| POST | `/api/projects` | Create project | Yes |
| GET | `/api/projects/:id` | Get project | Yes |
| PATCH | `/api/projects/:id` | Update project | Yes |
| DELETE | `/api/projects/:id` | Delete project | Yes |
| GET | `/api/projects/:id/tasks` | Get project tasks | Yes |
| POST | `/api/projects/:id/members` | Add member | Yes |
| DELETE | `/api/projects/:id/members/:memberId` | Remove member | Yes |

### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | List categories | Yes |
| POST | `/api/categories` | Create category | Yes |
| DELETE | `/api/categories/:id` | Delete category | Yes |

## Database Schema

### Models

- **User** - User accounts
- **Task** - Tasks with status, priority, due dates
- **Project** - Projects with team members
- **Category** - Task categories
- **ProjectMember** - Project membership with roles

### Prisma Commands

```bash
# Create migration
npx prisma migrate dev --name <migration_name>

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Generate client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start` | Start server |
| `npm run start:dev` | Start with hot reload |
| `npm run start:debug` | Start with debug |
| `npm run start:prod` | Start production build |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |
| `npm run test:e2e` | Run e2e tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Testing

```bash
# Unit tests (21 tests)
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

## Authentication Flow

1. **Register/Login** - Get `accessToken` and `refreshToken`
2. **API Requests** - Include `Authorization: Bearer <accessToken>`
3. **Token Refresh** - When access token expires, use `/api/auth/refresh` with refresh token
4. **Logout** - Clear tokens on client side

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for access tokens | Yes |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Yes |
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment | No (default: development) |

## License

MIT
