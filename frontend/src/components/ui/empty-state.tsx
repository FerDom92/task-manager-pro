'use client';

import { LucideIcon, FileQuestion, FolderOpen, CheckSquare, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function NoTasksEmpty({ onCreateClick }: { onCreateClick?: () => void }) {
  return (
    <EmptyState
      icon={CheckSquare}
      title="No tasks yet"
      description="Get started by creating your first task. Stay organized and boost your productivity!"
      action={
        onCreateClick
          ? { label: 'Create your first task', onClick: onCreateClick }
          : undefined
      }
    />
  );
}

export function NoProjectsEmpty({ onCreateClick }: { onCreateClick?: () => void }) {
  return (
    <EmptyState
      icon={FolderOpen}
      title="No projects yet"
      description="Create a project to organize your tasks and collaborate with your team."
      action={
        onCreateClick
          ? { label: 'Create your first project', onClick: onCreateClick }
          : undefined
      }
    />
  );
}

export function NoNotificationsEmpty() {
  return (
    <EmptyState
      icon={Inbox}
      title="All caught up!"
      description="You have no new notifications. We'll let you know when something happens."
      className="py-8"
    />
  );
}

export function NoResultsEmpty({ searchTerm }: { searchTerm?: string }) {
  return (
    <EmptyState
      icon={FileQuestion}
      title="No results found"
      description={
        searchTerm
          ? `We couldn't find anything matching "${searchTerm}". Try a different search term.`
          : "We couldn't find what you're looking for. Try adjusting your filters."
      }
    />
  );
}
