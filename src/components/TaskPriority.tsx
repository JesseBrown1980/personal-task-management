'use client';

import { updateTask } from '@/app/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task } from '@/db/schema';
import { optimisticUpdateTask } from '@/lib/taskCache';
import { useQueryClient } from '@tanstack/react-query';
import MutationState from './MutationState';

interface TaskPriorityProps {
  task: Task;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function TaskPriority({ task }: TaskPriorityProps) {
  const queryClient = useQueryClient();

  const handlePriorityChange = async (newPriority: Task['priority']) => {
    // Optimistically update the cache
    queryClient.setQueryData(['tasks'], (oldData: Task[] = []) =>
      optimisticUpdateTask(oldData, task.id, { priority: newPriority })
    );

    await updateTask(task.id, { priority: newPriority });
  };

  return (
    <MutationState action={handlePriorityChange} loadingText="Updating...">
      <Select
        defaultValue={task.priority}
        onValueChange={(value) => handlePriorityChange(value as Task['priority'])}>
        <SelectTrigger className={priorityColors[task.priority]}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </MutationState>
  );
}
