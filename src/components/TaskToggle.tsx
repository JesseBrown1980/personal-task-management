'use client';

import { updateTask } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Task } from '@/db/schema';
import { optimisticUpdateTask } from '@/lib/taskCache';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Circle } from 'lucide-react';
import { useOptimistic } from 'react';
import MutationState from './MutationState';

interface TaskToggleProps {
  task: Task;
}

export default function TaskToggle({ task }: TaskToggleProps) {
  const queryClient = useQueryClient();
  const [optimisticTask, updateOptimisticTask] = useOptimistic(
    task,
    (state, isCompleted: boolean) => ({ ...state, isCompleted })
  );

  const handleToggle = async () => {
    const newStatus = !optimisticTask.isCompleted;
    updateOptimisticTask(newStatus);

    try {
      // Optimistically update the cache
      queryClient.setQueryData(['tasks'], (oldData: Task[] = []) =>
        optimisticUpdateTask(oldData, task.id, { isCompleted: newStatus })
      );

      await updateTask(task.id, { isCompleted: newStatus });
    } catch (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      throw error;
    }
  };

  return (
    <MutationState action={handleToggle} loadingText="Updating...">
      <Button
        onClick={handleToggle}
        variant={optimisticTask.isCompleted ? 'outline' : 'secondary'}
        size="sm"
        className={cn(
          'min-w-[100px] transition-all duration-200',
          optimisticTask.isCompleted
            ? 'bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800'
        )}>
        {optimisticTask.isCompleted ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Completed
          </>
        ) : (
          <>
            <Circle className="h-4 w-4" />
            Pending
          </>
        )}
      </Button>
    </MutationState>
  );
}
