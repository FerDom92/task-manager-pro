'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { tasksService, type TaskStats } from '@/services/tasks';
import {
  CheckSquare,
  FolderKanban,
  Clock,
  AlertTriangle,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await tasksService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: CheckSquare,
      description: 'All tasks',
    },
    {
      title: 'In Progress',
      value: stats?.byStatus?.IN_PROGRESS || 0,
      icon: Clock,
      description: 'Currently working on',
    },
    {
      title: 'Completed',
      value: stats?.byStatus?.DONE || 0,
      icon: FolderKanban,
      description: 'Tasks completed',
    },
    {
      title: 'Overdue',
      value: stats?.overdue || 0,
      icon: AlertTriangle,
      description: 'Past due date',
      className: stats?.overdue ? 'text-red-500' : '',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.firstName || user?.email}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your tasks
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tasks">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon
                    className={`h-4 w-4 text-muted-foreground ${stat.className || ''}`}
                  />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stat.className || ''}`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tasks by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats?.byStatus || {}).map(([status, count]) => (
                    <div key={status} className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {status.replace('_', ' ')}
                      </span>
                      <span className="font-medium">{count as number}</span>
                    </div>
                  ))}
                  {Object.keys(stats?.byStatus || {}).length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No tasks yet. Create your first task!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tasks by Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats?.byPriority || {}).map(
                    ([priority, count]) => (
                      <div key={priority} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {priority}
                        </span>
                        <span className="font-medium">{count as number}</span>
                      </div>
                    )
                  )}
                  {Object.keys(stats?.byPriority || {}).length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No tasks yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
