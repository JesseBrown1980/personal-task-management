import '@testing-library/jest-dom';
import React from 'react';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronUp: () => <div data-testid="chevron-up" />,
  ChevronDown: () => <div data-testid="chevron-down" />,
  Check: () => <div data-testid="check" />,
}));

// Mock Radix UI Select
jest.mock('@radix-ui/react-select', () => {
  const SelectPrimitive = {
    Root: ({
      children,
      onValueChange,
      value,
    }: {
      children: React.ReactNode;
      onValueChange?: (value: string) => void;
      value?: string;
    }) => (
      <div data-testid="select-root" data-value={value}>
        {children}
      </div>
    ),
    Trigger: ({ children }: { children: React.ReactNode }) => (
      <button data-testid="select-trigger">{children}</button>
    ),
    Value: ({ children }: { children: React.ReactNode }) => (
      <span data-testid="select-value">{children}</span>
    ),
    Portal: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="select-portal">{children}</div>
    ),
    Content: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="select-content">{children}</div>
    ),
    Viewport: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="select-viewport">{children}</div>
    ),
    Item: ({
      children,
      value,
      onSelect,
    }: {
      children: React.ReactNode;
      value: string;
      onSelect?: () => void;
    }) => (
      <div
        data-testid="select-item"
        data-value={value}
        onClick={() => {
          onSelect?.();
          // Find the closest Root component and call its onValueChange
          const root = document.querySelector('[data-testid="select-root"]');
          const rootValue = root?.getAttribute('data-value');
          if (rootValue !== value) {
            const event = new CustomEvent('select', { detail: value });
            root?.dispatchEvent(event);
          }
        }}>
        {children}
      </div>
    ),
    ItemText: ({ children }: { children: React.ReactNode }) => (
      <span data-testid="select-item-text">{children}</span>
    ),
    ItemIndicator: ({ children }: { children: React.ReactNode }) => (
      <span data-testid="select-item-indicator">{children}</span>
    ),
    ScrollUpButton: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="select-scroll-up">{children}</div>
    ),
    ScrollDownButton: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="select-scroll-down">{children}</div>
    ),
    Label: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="select-label">{children}</div>
    ),
    Group: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="select-group">{children}</div>
    ),
    Separator: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="select-separator">{children}</div>
    ),
    Icon: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="select-icon">{children}</div>
    ),
  };

  return SelectPrimitive;
});

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => {
  const mockQueryClient = {
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
    resetQueries: jest.fn(),
  };

  return {
    ...jest.requireActual('@tanstack/react-query'),
    useQueryClient: () => mockQueryClient,
    QueryClient: jest.fn(() => mockQueryClient),
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});
