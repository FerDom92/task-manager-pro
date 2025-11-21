'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth';
import {
  dashboardService,
  type DashboardStats,
  type ActivityItem,
} from '@/services/dashboard';
import {
  CheckSquare,
  FolderKanban,
  Clock,
  AlertTriangle,
  Plus,
  TrendingUp,
  Calendar,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  TODO: 'bg-slate-500',
  IN_PROGRESS: 'bg-blue-500',
  IN_REVIEW: 'bg-yellow-500',
  DONE: 'bg-green-500',
  CANCELLED: 'bg-red-500',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, activityData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getActivity(),
        ]);
        setStats(statsData);
        setActivity(activityData);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.overview.totalTasks || 0,
      icon: CheckSquare,
      description: 'All your tasks',
      href: '/dashboard/tasks',
    },
    {
      title: 'In Progress',
      value: stats?.overview.inProgress || 0,
      icon: Clock,
      description: 'Currently working',
      color: 'text-blue-500',
    },
    {
      title: 'Completed This Week',
      value: stats?.overview.completedThisWeek || 0,
      icon: TrendingUp,
      description: 'Last 7 days',
      color: 'text-green-500',
    },
    {
      title: 'Overdue',
      value: stats?.overview.overdueTasks || 0,
      icon: AlertTriangle,
      description: 'Need attention',
      color: stats?.overview.overdueTasks ? 'text-red-500' : '',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.firstName || user?.email}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s your productivity overview
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tasks">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color || 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color || ''}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/tasks">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats?.upcomingTasks && stats.upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {task.project && (
                          <Badge
                            variant="outline"
                            style={{ borderColor: task.project.color || '#6366f1' }}
                          >
                            {task.project.name}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Due {format(new Date(task.dueDate!), 'MMM d')}
                        </span>
                      </div>
                    </div>
                    <Badge className={statusColors[task.status]}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming tasks in the next 7 days
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length > 0 ? (
              <div className="space-y-3">
                {activity.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${statusColors[item.status]}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.isNew ? 'Created' : 'Updated'}{' '}
                        {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tasks by Status & Priority */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats?.tasksByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
                    <span className="text-sm">{status.replace('_', ' ')}</span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
              {Object.keys(stats?.tasksByStatus || {}).length === 0 && (
                <p className="text-sm text-muted-foreground">No tasks yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => {
                const count = stats?.tasksByPriority?.[priority] || 0;
                if (count === 0 && !stats?.tasksByPriority?.[priority]) return null;
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <span className="text-sm">{priority}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
              {Object.keys(stats?.tasksByPriority || {}).length === 0 && (
                <p className="text-sm text-muted-foreground">No tasks yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/tasks">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 pt-6">
              <CheckSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Manage Tasks</p>
                <p className="text-sm text-muted-foreground">
                  View and organize your tasks
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/projects">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 pt-6">
              <FolderKanban className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Projects</p>
                <p className="text-sm text-muted-foreground">
                  {stats?.overview.totalProjects || 0} active projects
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/settings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 pt-6">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Settings</p>
                <p className="text-sm text-muted-foreground">
                  Manage your preferences
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
