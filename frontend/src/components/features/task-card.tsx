'use client';

import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  TODO: 'bg-slate-500',
  IN_PROGRESS: 'bg-blue-500',
  IN_REVIEW: 'bg-yellow-500',
  DONE: 'bg-green-500',
  CANCELLED: 'bg-red-500',
};

const priorityColors: Record<string, string> = {
  LOW: 'bg-slate-400',
  MEDIUM: 'bg-blue-400',
  HIGH: 'bg-orange-500',
  URGENT: 'bg-red-600',
};

const statusLabels: Record<string, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  DONE: 'Done',
  CANCELLED: 'Cancelled',
};

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'DONE' &&
    task.status !== 'CANCELLED';

  return (
    <Card
      className={cn(
        'cursor-pointer transition-shadow hover:shadow-md',
        isOverdue && 'border-red-300'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium line-clamp-2">{task.title}</h3>
          <Badge className={cn('shrink-0', priorityColors[task.priority])}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={statusColors[task.status]}>
            <span className="text-white">{statusLabels[task.status]}</span>
          </Badge>

          {task.category && (
            <Badge
              variant="outline"
              style={{ borderColor: task.category.color }}
            >
              {task.category.name}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {task.dueDate && (
            <div
              className={cn(
                'flex items-center gap-1',
                isOverdue && 'text-red-500'
              )}
            >
              <Calendar className="h-3 w-3" />
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </div>
          )}

          {task.assignee && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {task.assignee.firstName || task.assignee.email}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
