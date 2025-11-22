'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Trash2, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskCard } from '@/components/features/task-card';
import { TaskForm } from '@/components/features/task-form';
import { TaskListSkeleton } from '@/components/ui/skeletons';
import { NoTasksEmpty, NoResultsEmpty } from '@/components/ui/empty-state';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { tasksService, type TaskFilters } from '@/services/tasks';
import { categoriesService } from '@/services/categories';
import { permissionsService } from '@/services/permissions';
import type { Task, Category, TaskPermissions, TaskStatus } from '@/types';
import { useAuthStore } from '@/store/auth';

type ViewMode = 'grid' | 'kanban';

export default function TasksPage() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [taskPermissions, setTaskPermissions] = useState<TaskPermissions | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    limit: 100, // Higher limit for kanban view
  });
  const [search, setSearch] = useState('');
  const [meta, setMeta] = useState({ total: 0, totalPages: 0 });

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await tasksService.getAll({
        ...filters,
        search: search || undefined,
      });
      setTasks(response.data);
      setMeta({ total: response.meta.total, totalPages: response.meta.totalPages });
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, search]);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateTask = async (data: Parameters<typeof tasksService.create>[0]) => {
    try {
      await tasksService.create(data);
      setIsDialogOpen(false);
      loadTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (data: Parameters<typeof tasksService.create>[0]) => {
    if (!selectedTask) return;
    try {
      await tasksService.update(selectedTask.id, data);
      setIsDialogOpen(false);
      setSelectedTask(undefined);
      loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasksService.delete(id);
      loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const openEditDialog = async (task: Task) => {
    setSelectedTask(task);
    setTaskPermissions(null);
    setIsDialogOpen(true);
    try {
      const perms = await permissionsService.getTaskPermissions(task.id);
      setTaskPermissions(perms);
    } catch (error) {
      console.error('Failed to load permissions:', error);
      // Default to checking if user is creator
      setTaskPermissions({
        canView: true,
        canUpdate: task.createdById === user?.id,
        canDelete: task.createdById === user?.id,
        canAssign: task.createdById === user?.id,
      });
    }
  };

  const openCreateDialog = () => {
    setSelectedTask(undefined);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await tasksService.update(taskId, { status: newStatus });
      loadTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            {meta.total} task{meta.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              setFilters((f) => ({
                ...f,
                status: value === 'all' ? undefined : value,
              }))
            }
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority || 'all'}
            onValueChange={(value) =>
              setFilters((f) => ({
                ...f,
                priority: value === 'all' ? undefined : value,
              }))
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <TaskListSkeleton count={6} />
      ) : tasks.length === 0 ? (
        search || filters.status || filters.priority ? (
          <NoResultsEmpty searchTerm={search} />
        ) : (
          <NoTasksEmpty onCreateClick={openCreateDialog} />
        )
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onTaskClick={openEditDialog}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => openEditDialog(task)}
            />
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={filters.page === 1}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {filters.page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={filters.page === meta.totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={selectedTask}
            categories={categories}
            onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => setIsDialogOpen(false)}
            readOnly={!!(selectedTask && taskPermissions && !taskPermissions.canUpdate)}
          />
          {selectedTask && taskPermissions?.canDelete && (
            <Button
              variant="destructive"
              className="w-full mt-2"
              onClick={() => {
                handleDeleteTask(selectedTask.id);
                setIsDialogOpen(false);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Task
            </Button>
          )}
          {selectedTask && taskPermissions && !taskPermissions.canDelete && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Only the task creator or project admin can delete this task
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
