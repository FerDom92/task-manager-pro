'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Tag,
  Settings,
  LogOut,
  Menu,
  Keyboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/auth';
import { NotificationBell } from '@/components/features/notification-bell';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { KeyboardShortcutsDialog } from '@/components/features/keyboard-shortcuts-dialog';
import { useKeyboardShortcuts, useSequenceShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Categories', href: '/dashboard/categories', icon: Tag },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Single key shortcuts
  useKeyboardShortcuts([
    { key: '?', action: () => setShortcutsOpen(true), description: 'Show shortcuts' },
  ]);

  // Sequence shortcuts (g + key for navigation)
  const sequences = useMemo(() => ({
    'g d': () => router.push('/dashboard'),
    'g t': () => router.push('/dashboard/tasks'),
    'g p': () => router.push('/dashboard/projects'),
    'g c': () => router.push('/dashboard/categories'),
    'g s': () => router.push('/dashboard/settings'),
  }), [router]);

  useSequenceShortcuts(sequences);

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || user.email[0]}`.toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-background border-b px-4 h-14">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Task Manager Pro</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationBell />
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex fixed top-0 left-64 right-0 z-30 items-center justify-end bg-background border-b px-6 h-14 gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShortcutsOpen(true)}
          title="Keyboard shortcuts (?)"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
        <ThemeToggle />
        <NotificationBell />
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center h-14 px-4 border-b">
            <span className="font-bold text-lg">Task Manager Pro</span>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t space-y-2">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm min-w-0 flex-1">
                <span className="font-medium truncate">
                  {user?.firstName || user?.email}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:pl-64 pt-14">
        <div className="p-6">{children}</div>
      </main>

      <KeyboardShortcutsDialog
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </div>
  );
}
