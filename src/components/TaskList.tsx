'use client';

import { Task } from '@/db/schema';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onDelete?: (id: number) => Promise<void>;
  showActions?: boolean;
}

export default function TaskList({ tasks, onDelete, showActions = false }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={onDelete} showActions={showActions} />
      ))}
    </div>
  );
}
