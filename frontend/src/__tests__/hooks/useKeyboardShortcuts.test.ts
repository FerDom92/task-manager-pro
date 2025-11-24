import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, useSequenceShortcuts } from '@/hooks/useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call action when shortcut key is pressed', () => {
    const mockAction = jest.fn();
    const shortcuts = [{ key: '?', action: mockAction, description: 'Test' }];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', { key: '?' });
    document.dispatchEvent(event);

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should not call action when typing in input', () => {
    const mockAction = jest.fn();
    const shortcuts = [{ key: '?', action: mockAction, description: 'Test' }];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent('keydown', { key: '?', bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    input.dispatchEvent(event);

    expect(mockAction).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('should handle ctrl modifier', () => {
    const mockAction = jest.fn();
    const shortcuts = [
      { key: 'k', ctrl: true, action: mockAction, description: 'Test' },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Without ctrl - should not trigger
    const eventWithoutCtrl = new KeyboardEvent('keydown', { key: 'k' });
    document.dispatchEvent(eventWithoutCtrl);
    expect(mockAction).not.toHaveBeenCalled();

    // With ctrl - should trigger
    const eventWithCtrl = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });
    document.dispatchEvent(eventWithCtrl);
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});

describe('useSequenceShortcuts', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call action for key sequence', () => {
    const mockAction = jest.fn();
    const sequences = { 'g d': mockAction };

    renderHook(() => useSequenceShortcuts(sequences));

    // Press 'g'
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }));
    // Press 'd'
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should not trigger if sequence times out', () => {
    const mockAction = jest.fn();
    const sequences = { 'g d': mockAction };

    renderHook(() => useSequenceShortcuts(sequences));

    // Press 'g'
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }));

    // Wait for timeout
    jest.advanceTimersByTime(1500);

    // Press 'd' after timeout
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));

    expect(mockAction).not.toHaveBeenCalled();
  });

  it('should ignore modifier keys in sequence', () => {
    const mockAction = jest.fn();
    const sequences = { 'g d': mockAction };

    renderHook(() => useSequenceShortcuts(sequences));

    // Press with ctrl held - should be ignored
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'g', ctrlKey: true })
    );
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'd', ctrlKey: true })
    );

    expect(mockAction).not.toHaveBeenCalled();
  });
});
