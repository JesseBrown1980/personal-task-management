'use client';

import TaskPriority from '@/components/TaskPriority';
import TaskToggle from '@/components/TaskToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/db/schema';
import { format } from 'date-fns';
import Link from 'next/link';
import DeleteTaskButton from './DeleteTaskButton';

interface TaskDetailContentProps {
  task: Task;
}

function TaskActions({ taskId }: { taskId: number }) {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" asChild>
        <Link href="/">Back</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/${taskId}/edit`}>Edit</Link>
      </Button>
      <DeleteTaskButton taskId={taskId} />
    </div>
  );
}

export default function TaskDetailContent({ task }: TaskDetailContentProps) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Details</h1>
        <TaskActions taskId={task.id} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">{task.title}</CardTitle>
          <TaskPriority task={task} />
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{task.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </span>
            <TaskToggle task={task} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
