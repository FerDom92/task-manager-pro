# Task Manager Pro - Roadmap Detallado

## Información del Proyecto
**Prioridad:** 🔴 Alta
**Tiempo estimado:** 2-3 semanas
**Status:** 📝 En Planificación

---

## Stack Tecnológico

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Styling:** Tailwind CSS
- **Componentes:** Shadcn/ui
- **Forms:** React Hook Form + Zod
- **Estado:** Zustand / React Query
- **Auth:** NextAuth.js

### Backend
- **Framework:** Nest.js
- **Lenguaje:** TypeScript
- **ORM:** Prisma
- **Validación:** class-validator, class-transformer
- **Auth:** JWT + Passport

### Database
- **DB:** PostgreSQL (Supabase/PlanetScale)
- **Migraciones:** Prisma Migrate

### Testing
- **Unit Tests:** Jest
- **Integration Tests:** Jest + Supertest
- **E2E Tests:** Playwright (opcional)
- **Frontend Tests:** React Testing Library

### DevOps & Deploy
- **Frontend Deploy:** Vercel
- **Backend Deploy:** Railway / Render
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry (opcional)

---

## Fase 1: Setup Inicial (Día 1-2)

### Backend Setup
- [ ] Crear proyecto Nest.js
  ```bash
  npm i -g @nestjs/cli
  nest new task-manager-backend
  ```
- [ ] Configurar TypeScript strict mode
- [ ] Instalar dependencias base:
  - `@nestjs/config` - Variables de entorno
  - `@nestjs/jwt` - Autenticación JWT
  - `@nestjs/passport` - Estrategias de auth
  - `@prisma/client` - ORM
  - `prisma` - CLI de Prisma
  - `class-validator` - Validación
  - `class-transformer` - Transformación de datos
  - `bcrypt` - Hash de contraseñas
- [ ] Configurar estructura de carpetas:
  ```
  src/
  ├── auth/
  ├── users/
  ├── tasks/
  ├── projects/
  ├── common/
  │   ├── decorators/
  │   ├── guards/
  │   ├── filters/
  │   └── interceptors/
  └── config/
  ```
- [ ] Configurar Prisma
- [ ] Crear archivo `.env.example`
- [ ] Setup ESLint + Prettier

### Frontend Setup
- [ ] Crear proyecto Next.js 16
  ```bash
  npx create-next-app@latest task-manager-frontend --typescript --tailwind --app
  ```
- [ ] Instalar dependencias:
  - `shadcn/ui` - Componentes UI
  - `zustand` - Estado global
  - `@tanstack/react-query` - Server state
  - `axios` - HTTP client
  - `react-hook-form` - Forms
  - `zod` - Validación
  - `next-auth` - Autenticación
  - `lucide-react` - Iconos
  - `date-fns` - Manejo de fechas
- [ ] Configurar Shadcn/ui
  ```bash
  npx shadcn-ui@latest init
  ```
- [ ] Crear estructura de carpetas:
  ```
  src/
  ├── app/
  │   ├── (auth)/
  │   ├── (dashboard)/
  │   └── api/
  ├── components/
  │   ├── ui/
  │   ├── features/
  │   └── layouts/
  ├── lib/
  ├── hooks/
  ├── types/
  └── store/
  ```
- [ ] Setup ESLint + Prettier (configuración coordinada con backend)

### Database Setup
- [ ] Crear cuenta en Supabase/PlanetScale
- [ ] Crear base de datos PostgreSQL
- [ ] Configurar cadena de conexión
- [ ] Diseñar schema inicial de Prisma

---

## Fase 2: Autenticación y Usuarios (Día 3-5)

### Backend - Auth Module

#### Prisma Schema
- [ ] Definir modelo User:
  ```prisma
  model User {
    id        String   @id @default(uuid())
    email     String   @unique
    password  String
    firstName String?
    lastName  String?
    role      Role     @default(USER)
    avatar    String?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    tasks     Task[]
    projects  ProjectMember[]
  }

  enum Role {
    ADMIN
    MANAGER
    USER
  }
  ```
- [ ] Correr migración: `npx prisma migrate dev --name init`

#### Auth Service
- [ ] Crear módulo de autenticación: `nest g module auth`
- [ ] Crear servicio: `nest g service auth`
- [ ] Crear controlador: `nest g controller auth`
- [ ] Implementar registro de usuarios:
  - Validar email único
  - Hash de contraseña con bcrypt (salt rounds: 10)
  - Guardar en DB
- [ ] Implementar login:
  - Validar credenciales
  - Generar JWT (access token + refresh token)
  - Retornar tokens
- [ ] Implementar refresh token endpoint
- [ ] Implementar logout
- [ ] Crear DTOs:
  - `RegisterDto`
  - `LoginDto`
  - `RefreshTokenDto`

#### Guards y Decorators
- [ ] Crear `JwtAuthGuard`
- [ ] Crear `RolesGuard`
- [ ] Crear decorator `@Roles()`
- [ ] Crear decorator `@CurrentUser()`
- [ ] Crear Passport strategy para JWT

#### Endpoints Auth
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /auth/me
```

### Frontend - Auth Pages

#### Auth Context/Store
- [ ] Configurar NextAuth.js
- [ ] Crear store de autenticación con Zustand:
  - Estado: `user`, `token`, `isAuthenticated`
  - Acciones: `login`, `logout`, `register`, `refreshToken`
- [ ] Crear hook `useAuth()`

#### Páginas de Auth
- [ ] `/login` - Página de inicio de sesión
  - Form con email y password
  - Validación con Zod
  - Manejo de errores
  - Link a registro
  - Link a "olvidé mi contraseña"
- [ ] `/register` - Página de registro
  - Form con email, password, confirmación
  - Validación de fortaleza de password
  - Términos y condiciones
  - Link a login
- [ ] `/forgot-password` - Recuperación de contraseña (opcional para v1)

#### Componentes UI
- [ ] `LoginForm` component
- [ ] `RegisterForm` component
- [ ] `AuthLayout` - Layout para páginas de auth
- [ ] `ProtectedRoute` - HOC para rutas protegidas

#### OAuth (opcional para v1)
- [ ] Configurar Google OAuth
- [ ] Configurar GitHub OAuth
- [ ] Botones de "Continuar con Google/GitHub"

---

## Fase 3: Gestión de Tareas - CRUD (Día 6-9)

### Backend - Tasks Module

#### Prisma Schema
- [ ] Definir modelo Task:
  ```prisma
  model Task {
    id          String       @id @default(uuid())
    title       String
    description String?
    status      TaskStatus   @default(TODO)
    priority    TaskPriority @default(MEDIUM)
    dueDate     DateTime?
    categoryId  String?
    category    Category?    @relation(fields: [categoryId], references: [id])
    projectId   String?
    project     Project?     @relation(fields: [projectId], references: [id])
    assigneeId  String?
    assignee    User?        @relation(fields: [assigneeId], references: [id])
    createdById String
    createdBy   User         @relation("CreatedTasks", fields: [createdById], references: [id])
    createdAt   DateTime     @default(now())
    updatedAt   DateTime     @updatedAt
  }

  enum TaskStatus {
    TODO
    IN_PROGRESS
    IN_REVIEW
    DONE
    CANCELLED
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  model Category {
    id        String   @id @default(uuid())
    name      String
    color     String
    tasks     Task[]
    createdAt DateTime @default(now())
  }
  ```
- [ ] Migración de tasks y categorías

#### Tasks Service
- [ ] Crear módulo: `nest g module tasks`
- [ ] Crear servicio: `nest g service tasks`
- [ ] Crear controlador: `nest g controller tasks`
- [ ] Implementar CRUD:
  - `create()` - Crear tarea
  - `findAll()` - Listar tareas (con paginación)
  - `findOne()` - Obtener tarea por ID
  - `update()` - Actualizar tarea
  - `delete()` - Eliminar tarea (soft delete opcional)
- [ ] Implementar filtros:
  - Por status
  - Por prioridad
  - Por categoría
  - Por proyecto
  - Por asignado
  - Por rango de fechas
- [ ] Implementar búsqueda por texto
- [ ] Implementar ordenamiento

#### DTOs y Validación
- [ ] `CreateTaskDto`
- [ ] `UpdateTaskDto`
- [ ] `FilterTasksDto`
- [ ] Validators personalizados

#### Endpoints Tasks
```
POST   /tasks
GET    /tasks
GET    /tasks/:id
PATCH  /tasks/:id
DELETE /tasks/:id
GET    /tasks/search?q=keyword
GET    /tasks/filter?status=TODO&priority=HIGH
```

### Frontend - Tasks UI

#### Páginas
- [ ] `/dashboard/tasks` - Lista de tareas
- [ ] `/dashboard/tasks/new` - Crear tarea
- [ ] `/dashboard/tasks/:id` - Detalle de tarea
- [ ] `/dashboard/tasks/:id/edit` - Editar tarea

#### Componentes
- [ ] `TaskList` - Lista de tareas
  - Vista de tabla
  - Vista de kanban (opcional v1)
  - Vista de lista
- [ ] `TaskCard` - Card de tarea individual
- [ ] `TaskForm` - Formulario crear/editar
- [ ] `TaskFilters` - Sidebar de filtros
- [ ] `TaskSearch` - Barra de búsqueda
- [ ] `TaskDetails` - Modal/página de detalles
- [ ] `PriorityBadge` - Badge de prioridad
- [ ] `StatusBadge` - Badge de status
- [ ] `CategoryTag` - Tag de categoría

#### Features
- [ ] Paginación de tareas
- [ ] Búsqueda en tiempo real (debounced)
- [ ] Filtros múltiples
- [ ] Ordenamiento por columnas
- [ ] Cambio rápido de status (drag & drop opcional)
- [ ] Asignación de tareas
- [ ] Fechas de vencimiento con calendario
- [ ] Loading states
- [ ] Empty states
- [ ] Error handling

#### Hooks
- [ ] `useTasks()` - Fetch y cache de tareas
- [ ] `useTaskMutations()` - Create, update, delete
- [ ] `useTaskFilters()` - Estado de filtros

---

## Fase 4: Sistema de Proyectos (Día 10-12)

### Backend - Projects Module

#### Prisma Schema
- [ ] Definir modelo Project:
  ```prisma
  model Project {
    id          String          @id @default(uuid())
    name        String
    description String?
    color       String?
    icon        String?
    ownerId     String
    owner       User            @relation(fields: [ownerId], references: [id])
    members     ProjectMember[]
    tasks       Task[]
    createdAt   DateTime        @default(now())
    updatedAt   DateTime        @updatedAt
  }

  model ProjectMember {
    id        String      @id @default(uuid())
    projectId String
    project   Project     @relation(fields: [projectId], references: [id])
    userId    String
    user      User        @relation(fields: [userId], references: [id])
    role      ProjectRole @default(MEMBER)
    joinedAt  DateTime    @default(now())

    @@unique([projectId, userId])
  }

  enum ProjectRole {
    OWNER
    ADMIN
    MEMBER
    VIEWER
  }
  ```
- [ ] Migración de projects

#### Projects Service
- [ ] Crear módulo: `nest g module projects`
- [ ] CRUD de proyectos
- [ ] Gestión de miembros:
  - Agregar miembro
  - Remover miembro
  - Actualizar rol de miembro
- [ ] Listar proyectos del usuario
- [ ] Listar tareas del proyecto
- [ ] Validaciones de permisos

#### Endpoints Projects
```
POST   /projects
GET    /projects
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id
POST   /projects/:id/members
DELETE /projects/:id/members/:userId
PATCH  /projects/:id/members/:userId
GET    /projects/:id/tasks
```

### Frontend - Projects UI

#### Páginas
- [ ] `/dashboard/projects` - Lista de proyectos
- [ ] `/dashboard/projects/new` - Crear proyecto
- [ ] `/dashboard/projects/:id` - Vista de proyecto
- [ ] `/dashboard/projects/:id/settings` - Configuración

#### Componentes
- [ ] `ProjectList` - Grid de proyectos
- [ ] `ProjectCard` - Card de proyecto
- [ ] `ProjectForm` - Formulario proyecto
- [ ] `ProjectMembers` - Lista de miembros
- [ ] `ProjectTasks` - Tareas del proyecto
- [ ] `MemberInvite` - Invitar miembro
- [ ] `ProjectSettings` - Configuración del proyecto

---

## Fase 5: Dashboard y Estadísticas (Día 13-14)

### Backend - Analytics

#### Endpoints
- [ ] `GET /dashboard/stats` - Estadísticas generales
  - Total de tareas
  - Tareas por status
  - Tareas por prioridad
  - Tareas vencidas
  - Productividad (tareas completadas/semana)
- [ ] `GET /dashboard/activity` - Actividad reciente
- [ ] Optimizar queries con agregaciones de Prisma

### Frontend - Dashboard

#### Página Principal
- [ ] `/dashboard` - Vista principal
  - KPIs en cards
  - Gráficos de estadísticas
  - Tareas recientes
  - Actividad del equipo
  - Próximos vencimientos

#### Componentes
- [ ] `StatsCard` - Card de estadística
- [ ] `TasksChart` - Gráfico de tareas (Chart.js/Recharts)
- [ ] `ActivityFeed` - Feed de actividad
- [ ] `UpcomingTasks` - Tareas próximas a vencer
- [ ] `ProductivityChart` - Gráfico de productividad

---

## Fase 6: Notificaciones (Día 15)

### Backend - Notifications

#### Email Service
- [ ] Configurar servicio de email (Resend/SendGrid)
- [ ] Templates de emails:
  - Bienvenida
  - Asignación de tarea
  - Tarea próxima a vencer
  - Invitación a proyecto
- [ ] Queue de emails (opcional: Bull)

#### Notificaciones en App
- [ ] Modelo de Notification en Prisma
- [ ] CRUD de notificaciones
- [ ] WebSocket para notificaciones en tiempo real (opcional v2)

### Frontend - Notifications

- [ ] `NotificationBell` - Icono con contador
- [ ] `NotificationDropdown` - Lista de notificaciones
- [ ] `NotificationItem` - Item individual
- [ ] Toast notifications (react-hot-toast)

---

## Fase 7: Roles y Permisos (Día 16)

### Backend - Authorization

- [ ] Implementar `RolesGuard` completo
- [ ] Policies de autorización:
  - Solo el creador puede eliminar
  - Solo admin/manager puede asignar
  - Solo miembros pueden ver proyecto
- [ ] Middleware de permisos
- [ ] Tests de autorización

### Frontend - Role-based UI

- [ ] Mostrar/ocultar acciones según rol
- [ ] Deshabilitar botones según permisos
- [ ] Mensajes de "sin permisos"

---

## Fase 8: UI/UX Polish (Día 17-18)

### Tema y Diseño
- [ ] Implementar dark/light mode
  - Usar `next-themes`
  - Toggle en navbar
  - Persistir preferencia
- [ ] Diseño responsive completo:
  - Mobile (320px+)
  - Tablet (768px+)
  - Desktop (1024px+)
- [ ] Animaciones con Framer Motion:
  - Page transitions
  - Modal animations
  - Loading animations
- [ ] Skeleton loaders
- [ ] Empty states con ilustraciones
- [ ] Error states
- [ ] Success states

### Componentes UI Avanzados
- [ ] `Sidebar` responsive con collapse
- [ ] `Navbar` con usuario y menú
- [ ] `CommandPalette` (⌘K) para búsqueda rápida
- [ ] `ContextMenu` en tareas
- [ ] `Tooltip` en iconos
- [ ] `Modal` reutilizable
- [ ] `Drawer` para formularios

### Accesibilidad
- [ ] Navegación por teclado
- [ ] ARIA labels
- [ ] Focus management
- [ ] Screen reader support
- [ ] Color contrast (WCAG AA)

---

## Fase 9: Testing (Día 19-20)

### Backend Tests

#### Unit Tests
- [ ] Auth service tests
- [ ] Tasks service tests
- [ ] Projects service tests
- [ ] Guards tests
- [ ] Validators tests

#### Integration Tests
- [ ] Auth endpoints e2e
- [ ] Tasks endpoints e2e
- [ ] Projects endpoints e2e
- [ ] Authorization flows

#### Coverage
- [ ] Objetivo: >70% coverage
- [ ] Configurar coverage reports
- [ ] CI para ejecutar tests

### Frontend Tests

#### Unit Tests
- [ ] Hooks tests
- [ ] Utils tests
- [ ] Store tests

#### Component Tests
- [ ] TaskForm tests
- [ ] TaskList tests
- [ ] ProjectForm tests
- [ ] Auth forms tests

#### E2E Tests (opcional)
- [ ] Login flow
- [ ] Create task flow
- [ ] Create project flow

---

## Fase 10: Deploy y DevOps (Día 21)

### CI/CD Pipeline

#### GitHub Actions
- [ ] Workflow para backend:
  - Lint
  - Tests
  - Build
  - Deploy a Railway/Render
- [ ] Workflow para frontend:
  - Lint
  - Type check
  - Build
  - Deploy a Vercel

### Environments

#### Backend Deploy (Railway/Render)
- [ ] Configurar variables de entorno
- [ ] Database connection
- [ ] Configurar dominio (opcional)
- [ ] SSL/HTTPS
- [ ] Health check endpoint

#### Frontend Deploy (Vercel)
- [ ] Conectar repositorio
- [ ] Configurar variables de entorno
- [ ] Preview deployments
- [ ] Production deployment
- [ ] Dominio personalizado (opcional)

### Monitoring
- [ ] Configurar Sentry (error tracking)
- [ ] Logs en producción
- [ ] Performance monitoring (opcional)

---

## Fase 11: Documentación (Día 22)

### README.md
- [ ] Descripción del proyecto
- [ ] Screenshots/GIFs
- [ ] Features principales
- [ ] Stack tecnológico
- [ ] Requisitos previos
- [ ] Instrucciones de instalación
- [ ] Variables de entorno (.env.example)
- [ ] Comandos disponibles
- [ ] Arquitectura del proyecto
- [ ] Decisiones técnicas
- [ ] Roadmap futuro
- [ ] Licencia

### Documentación Técnica
- [ ] API documentation (Swagger - opcional)
- [ ] Architecture diagram
- [ ] Database schema diagram
- [ ] Component hierarchy
- [ ] State management flow

### Code Documentation
- [ ] Comentarios en funciones complejas
- [ ] JSDoc en funciones públicas
- [ ] README en carpetas principales

---

## Fase 12: Features Opcionales (V2)

### Si hay tiempo extra:
- [ ] **Kanban Board** - Vista de tablero drag & drop
- [ ] **Calendar View** - Vista de calendario
- [ ] **File Attachments** - Adjuntar archivos a tareas
- [ ] **Comments** - Comentarios en tareas
- [ ] **Activity Log** - Historial de cambios
- [ ] **Tags** - Sistema de etiquetas
- [ ] **Favorites** - Marcar tareas favoritas
- [ ] **Search Filters** - Filtros guardados
- [ ] **Export Data** - Exportar a CSV/PDF
- [ ] **Notifications Settings** - Preferencias de notificaciones
- [ ] **Two-Factor Auth** - 2FA para seguridad
- [ ] **API Rate Limiting** - Limitar requests
- [ ] **Webhooks** - Integraciones externas

---

## Checklist de Calidad Final

### Antes de Publicar
- [ ] ✅ Todos los tests pasan
- [ ] ✅ Coverage >70%
- [ ] ✅ No hay console.logs en producción
- [ ] ✅ No hay warnings en consola
- [ ] ✅ ESLint sin errores
- [ ] ✅ TypeScript sin errores
- [ ] ✅ Responsive en todos los tamaños
- [ ] ✅ Dark mode funcional
- [ ] ✅ Accesibilidad validada
- [ ] ✅ Performance optimizado
- [ ] ✅ SEO básico (meta tags)
- [ ] ✅ Lighthouse score >90
- [ ] ✅ README completo
- [ ] ✅ .env.example actualizado
- [ ] ✅ Deploy exitoso
- [ ] ✅ SSL/HTTPS activo
- [ ] ✅ Error tracking configurado

---

## Recursos y Referencias

### Documentación
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Nest.js Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

### Tutoriales
- Next.js Authentication with NextAuth
- Nest.js JWT Authentication
- Prisma with PostgreSQL
- React Query Best Practices

### Tools
- [Excalidraw](https://excalidraw.com) - Diagramas
- [Figma](https://figma.com) - Diseño UI
- [Postman](https://postman.com) - Test API

---

## Métricas de Éxito

Al finalizar este proyecto, deberías tener:

✅ Aplicación full stack completamente funcional
✅ Autenticación y autorización robusta
✅ CRUD completo de tareas y proyectos
✅ Dashboard con estadísticas
✅ UI/UX profesional y responsive
✅ Tests con buena cobertura
✅ Documentación completa
✅ Deploy en producción
✅ Código limpio y mantenible
✅ Performance optimizado

---

**¡Éxito en el desarrollo del Task Manager Pro!** 🚀
