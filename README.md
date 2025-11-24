# Task Manager Pro

Full-stack task and project management application with Kanban board, drag-and-drop, and real-time collaboration features.

## Tech Stack

- **Backend:** NestJS, Prisma, PostgreSQL, JWT Auth
- **Frontend:** Next.js 16, React 19, Tailwind CSS, shadcn/ui, Zustand
- **Features:** Kanban board, drag-and-drop, PWA, keyboard shortcuts

## Prerequisites

- Node.js 20+
- PostgreSQL 14+ (or Docker)
- npm or yarn

## Quick Start

### Option 1: Manual Setup

#### 1. Clone the repository

```bash
git clone <repo-url>
cd task-manager-pro
```

#### 2. Setup PostgreSQL Database

**Using Docker (recommended):**
```bash
docker run --name task-manager-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=task_manager_pro \
  -p 5432:5432 \
  -d postgres:16
```

**Or use an existing PostgreSQL instance** and create a database named `task_manager_pro`.

#### 3. Setup Backend

```bash
cd backend

# Copy environment file and configure
cp .env.example .env

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run start:dev
```

The backend will be running at `http://localhost:5000`

#### 4. Setup Frontend (new terminal)

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be running at `http://localhost:3000`

### Option 2: Docker Compose

```bash
# Start all services (database, backend, frontend)
docker-compose up -d

# Or for development (database only)
docker-compose -f docker-compose.dev.yml up -d
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/task_manager_pro` |
| `JWT_SECRET` | Secret for access tokens | - |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | - |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Project Structure

```
task-manager-pro/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # Users module
│   │   ├── tasks/          # Tasks module
│   │   ├── projects/       # Projects module
│   │   ├── categories/     # Categories module
│   │   └── common/         # Shared utilities
│   └── prisma/             # Database schema & migrations
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand stores
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
└── docker-compose.yml     # Docker configuration
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh tokens |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/me` | Update profile |
| DELETE | `/api/auth/me` | Delete account |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (with filters) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/stats` | Get task statistics |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |
| DELETE | `/api/categories/:id` | Delete category |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `?` | Show keyboard shortcuts |
| `g` then `d` | Go to Dashboard |
| `g` then `t` | Go to Tasks |
| `g` then `p` | Go to Projects |
| `g` then `c` | Go to Categories |
| `g` then `s` | Go to Settings |

## Available Scripts

### Backend
```bash
npm run start:dev    # Start in development mode
npm run start:prod   # Start in production mode
npm run build        # Build for production
npm run test         # Run unit tests
npm run test:e2e     # Run e2e tests
npm run test:cov     # Run tests with coverage
```

### Frontend
```bash
npm run dev          # Start in development mode
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Testing

### Backend Tests
```bash
cd backend
npm run test         # 21 unit tests
npm run test:e2e     # E2E tests
```

### Frontend Tests
```bash
cd frontend
npm run test         # 99 tests across 12 suites
```

## License

MIT
