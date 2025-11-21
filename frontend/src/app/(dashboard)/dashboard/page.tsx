'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth';
import { CheckSquare, FolderKanban, Clock, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Total Tasks',
      value: '0',
      icon: CheckSquare,
      description: 'All tasks',
    },
    {
      title: 'Projects',
      value: '0',
      icon: FolderKanban,
      description: 'Active projects',
    },
    {
      title: 'In Progress',
      value: '0',
      icon: Clock,
      description: 'Tasks in progress',
    },
    {
      title: 'Overdue',
      value: '0',
      icon: AlertTriangle,
      description: 'Past due date',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.firstName || user?.email}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your tasks and projects
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
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
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No tasks yet. Create your first task to get started.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent activity to display.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
