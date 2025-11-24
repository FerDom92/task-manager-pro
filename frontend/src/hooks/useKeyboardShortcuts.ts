import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

// For sequence-based shortcuts (like "g d" for go to dashboard)
let keySequence: string[] = [];
let sequenceTimeout: NodeJS.Timeout | null = null;

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
        // For special characters like ?, match the key directly
        const keyMatch = event.key === shortcut.key || event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : true;
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

// Sequence-based shortcuts hook (like "g d" for go to dashboard)
export function useSequenceShortcuts(sequences: Record<string, () => void>) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ignore modifier keys alone
      if (['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) {
        return;
      }

      // Don't capture if modifiers are pressed (except shift for ?)
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      const key = event.key.toLowerCase();

      // Clear previous timeout
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
      }

      // Add to sequence
      keySequence.push(key);

      // Check for matching sequence
      const seq = keySequence.join(' ');

      if (sequences[seq]) {
        event.preventDefault();
        sequences[seq]();
        keySequence = [];
        return;
      }

      // Keep only last 2 keys for sequence matching
      if (keySequence.length > 2) {
        keySequence = keySequence.slice(-2);
      }

      // Clear sequence after 1 second of inactivity
      sequenceTimeout = setTimeout(() => {
        keySequence = [];
      }, 1000);
    },
    [sequences]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
      }
    };
  }, [handleKeyDown]);
}

