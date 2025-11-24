# Task Manager Pro - Frontend

Modern task management UI built with Next.js 16, React 19, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS, shadcn/ui
- **State:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **Drag & Drop:** dnd-kit
- **Testing:** Jest + React Testing Library

## Prerequisites

- Node.js 20+
- npm or yarn
- Backend API running (see backend README)

## Installation

### 1. Clone and navigate

```bash
git clone <repo-url>
cd task-manager-pro/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start development server

```bash
npm run dev
```

Application runs at `http://localhost:3000`

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth pages (login, register)
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/            # Protected dashboard pages
│   │   ├── page.tsx          # Dashboard home
│   │   ├── tasks/            # Tasks page
│   │   ├── projects/         # Projects page
│   │   ├── categories/       # Categories page
│   │   └── settings/         # Settings page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── features/             # Feature components
│   │   ├── task-card.tsx
│   │   ├── task-form.tsx
│   │   ├── project-card.tsx
│   │   └── ...
│   ├── layouts/              # Layout components
│   │   ├── dashboard-layout.tsx
│   │   └── auth-layout.tsx
│   ├── providers/            # Context providers
│   │   └── theme-provider.tsx
│   └── tasks/                # Kanban board components
│       ├── KanbanBoard.tsx
│       ├── KanbanColumn.tsx
│       └── KanbanCard.tsx
├── hooks/                    # Custom React hooks
│   ├── useKeyboardShortcuts.ts
│   └── use-permissions.ts
├── services/                 # API service layer
│   ├── api.ts               # Axios instance
│   ├── auth.ts              # Auth endpoints
│   ├── tasks.ts             # Tasks endpoints
│   ├── projects.ts          # Projects endpoints
│   └── categories.ts        # Categories endpoints
├── store/                    # Zustand stores
│   └── auth.ts              # Authentication state
├── lib/                      # Utility functions
│   └── utils.ts
└── types/                    # TypeScript types
    └── index.ts
```

## Features

### Kanban Board
- Drag-and-drop task management
- Status columns: TODO, IN_PROGRESS, DONE
- Task filtering and sorting

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `?` | Show all shortcuts |
| `g` then `d` | Go to Dashboard |
| `g` then `t` | Go to Tasks |
| `g` then `p` | Go to Projects |
| `g` then `c` | Go to Categories |
| `g` then `s` | Go to Settings |

### Dark Mode
- Automatic system preference detection
- Manual toggle in settings
- Persistent preference

### PWA Support
- Installable as desktop/mobile app
- Offline capability
- Push notifications (future)

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## Testing

```bash
# Run all tests (99 tests across 12 suites)
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage

| Category | Tests |
|----------|-------|
| **Components** | Button, Input, Badge, Card |
| **Hooks** | useKeyboardShortcuts, usePermissions |
| **Services** | auth, tasks, projects, categories |
| **Store** | auth (Zustand) |
| **Utils** | cn() utility |

## Components

### UI Components (shadcn/ui)
- `Button` - Primary, secondary, destructive, ghost, outline variants
- `Card` - Container with header, content, footer
- `Dialog` - Modal dialogs
- `Input` - Text inputs
- `Select` - Dropdown selects
- `Badge` - Status badges
- `Avatar` - User avatars
- `Skeleton` - Loading states

### Feature Components
- `TaskCard` - Task display card
- `TaskForm` - Create/edit task form
- `ProjectCard` - Project display card
- `KanbanBoard` - Drag-and-drop board
- `NotificationBell` - Notifications dropdown

## State Management

### Zustand Store (auth.ts)
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user, accessToken, refreshToken) => void;
  setUser: (user) => void;
  logout: () => void;
}
```

### React Query
- Server state management
- Automatic caching and refetching
- Optimistic updates for mutations

## API Integration

All API calls go through the `services/` layer:

```typescript
// Example: Fetch tasks
import { tasksService } from '@/services/tasks';

const tasks = await tasksService.getAll({ status: 'TODO' });
```

### Axios Interceptors
- Automatic token injection
- Token refresh on 401 errors
- Request/response error handling

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

## Building for Production

```bash
# Build
npm run build

# Start production server
npm run start
```

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## License

MIT
