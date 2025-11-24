# Task Manager Pro

Full-stack task and project management application.

## Tech Stack

- **Backend:** NestJS, Prisma, PostgreSQL, JWT Auth
- **Frontend:** Next.js 16, React, Tailwind CSS, shadcn/ui
- **Features:** Kanban board, drag-and-drop, PWA, keyboard shortcuts

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL (or Docker)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd task-manager-pro

# Backend
cd backend
cp .env.example .env  # Configure DATABASE_URL and JWT secrets
npm install
npx prisma migrate dev
npm run start:dev

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Docker

```bash
# Full stack
docker-compose up -d

# Development (DB only)
docker-compose -f docker-compose.dev.yml up -d
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register user |
| `/api/auth/login` | POST | Login |
| `/api/auth/me` | GET | Current user |
| `/api/tasks` | GET/POST | List/Create tasks |
| `/api/tasks/:id` | GET/PATCH/DELETE | Task CRUD |
| `/api/projects` | GET/POST | List/Create projects |
| `/api/categories` | GET/POST | List/Create categories |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | New task |
| `D` | Dashboard |
| `T` | Tasks |
| `P` | Projects |
| `?` | Show shortcuts |

## Scripts

```bash
# Backend
npm run start:dev    # Development
npm run test         # Unit tests
npm run test:e2e     # E2E tests
npm run build        # Production build

# Frontend
npm run dev          # Development
npm run build        # Production build
npm run lint         # Lint code
```

## License

MIT
