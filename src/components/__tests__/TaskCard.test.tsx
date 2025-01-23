import { Task } from '@/db/schema';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import TaskCard from '../TaskCard';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock TanStack Query
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    setQueryData: jest.fn(),
  }),
  useMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

// Mock taskCache
jest.mock('@/lib/taskCache', () => ({
  optimisticDeleteTask: (tasks: Task[], id: number) => tasks.filter((t) => t.id !== id),
}));

// Mock TaskToggle component
jest.mock('../TaskToggle', () => ({
  __esModule: true,
  default: () => <div data-testid="task-toggle">Toggle</div>,
}));

// Mock MutationState component
jest.mock('../MutationState', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

describe('TaskCard', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2024-12-31',
    isCompleted: false,
    priority: 'low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('renders task details correctly', () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/Dec 30, 2024/)).toBeInTheDocument();
  });

  it('shows action buttons when showActions is true', () => {
    render(<TaskCard task={mockTask} showActions={true} />);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('hides action buttons when showActions is false', () => {
    render(<TaskCard task={mockTask} showActions={false} />);

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked and confirmed', async () => {
    const mockDelete = jest.fn();
    window.confirm = jest.fn(() => true);

    render(<TaskCard task={mockTask} showActions={true} onDelete={mockDelete} />);

    await fireEvent.click(screen.getByText('Delete'));
    expect(mockDelete).toHaveBeenCalledWith(mockTask.id);
  });
});
