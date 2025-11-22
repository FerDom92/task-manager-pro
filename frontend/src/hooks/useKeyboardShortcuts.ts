import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Global app shortcuts hook
export function useGlobalShortcuts({
  onNewTask,
  onSearch,
  onToggleTheme,
}: {
  onNewTask?: () => void;
  onSearch?: () => void;
  onToggleTheme?: () => void;
}) {
  const router = useRouter();

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'n',
      action: () => onNewTask?.(),
      description: 'Create new task',
    },
    {
      key: 'k',
      ctrl: true,
      action: () => onSearch?.(),
      description: 'Focus search',
    },
    {
      key: 'd',
      action: () => router.push('/dashboard'),
      description: 'Go to dashboard',
    },
    {
      key: 't',
      action: () => router.push('/dashboard/tasks'),
      description: 'Go to tasks',
    },
    {
      key: 'p',
      action: () => router.push('/dashboard/projects'),
      description: 'Go to projects',
    },
    ...(onToggleTheme
      ? [
          {
            key: '\\',
            ctrl: true,
            action: onToggleTheme,
            description: 'Toggle theme',
          },
        ]
      : []),
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}
