'use client';

import { deleteTask } from '@/app/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Task } from '@/db/schema';
import { getTasksWithCache } from '@/lib/taskCache';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import MutationState from './MutationState';
import TaskList from './TaskList';

interface TaskListWrapperProps {
  initialTasks: Task[];
}

export default function TaskListWrapper({ initialTasks }: TaskListWrapperProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasksWithCache,
    initialData: initialTasks,
    staleTime: 5000,
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete task:', error);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      throw error;
    }
  };

  if (!tasks.length) {
    return (
      <Alert>
        <AlertDescription>No tasks yet. Create one to get started!</AlertDescription>
      </Alert>
    );
  }

  return (
    <MutationState action={handleDelete} loadingText="Deleting...">
      <TaskList tasks={tasks} onDelete={handleDelete} showActions />
    </MutationState>
  );
}
