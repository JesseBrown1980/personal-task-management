'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/db/schema';
import { optimisticDeleteTask } from '@/lib/taskCache';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import Link from 'next/link';
import MutationState from './MutationState';
import TaskToggle from './TaskToggle';

interface TaskCardProps {
  task: Task;
  onDelete?: (id: number) => Promise<void>;
  showActions?: boolean;
}

export default function TaskCard({ task, onDelete, showActions = true }: TaskCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <Link href={`/${task.id}`} className="hover:underline">
          <CardTitle className="text-xl">{task.title}</CardTitle>
        </Link>
        <span className="text-muted-foreground text-sm">
          Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{task.description}</p>
      </CardContent>
      <CardFooter className="justify-between">
        <TaskActions task={task} onDelete={onDelete} showActions={showActions} />
      </CardFooter>
    </Card>
  );
}

interface TaskActionsProps {
  task: Task;
  onDelete?: (id: number) => Promise<void>;
  showActions?: boolean;
}

function TaskActions({ task, onDelete, showActions = true }: TaskActionsProps) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm('Are you sure you want to delete this task?')) return;

    queryClient.setQueryData(['tasks'], (oldData: Task[] = []) =>
      optimisticDeleteTask(oldData, task.id)
    );
    await onDelete(task.id);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <TaskToggle task={task} />
      {showActions && (
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${task.id}/edit`}>Edit</Link>
          </Button>
          <MutationState action={handleDelete} loadingText="Deleting...">
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </MutationState>
        </div>
      )}
    </div>
  );
}
