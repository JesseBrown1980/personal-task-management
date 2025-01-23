'use client';

import { deleteTask } from '@/app/actions';
import MutationState from '@/components/MutationState';
import { Button } from '@/components/ui/button';
import { Task } from '@/db/schema';
import { optimisticDeleteTask } from '@/lib/taskCache';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface DeleteTaskButtonProps {
  taskId: number;
}

export default function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    // Optimistically update the cache
    queryClient.setQueryData(['tasks'], (oldData: Task[] = []) =>
      optimisticDeleteTask(oldData, taskId)
    );

    try {
      await deleteTask(taskId);
      router.push('/');
    } catch (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      throw error;
    }
  };

  return (
    <MutationState action={handleDelete} loadingText="Deleting...">
      <Button variant="destructive" onClick={handleDelete}>
        Delete Task
      </Button>
    </MutationState>
  );
}
