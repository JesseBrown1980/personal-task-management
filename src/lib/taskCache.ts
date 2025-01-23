import { getTasks } from '@/app/actions';
import { Task } from '@/db/schema';
import { cache } from 'react';

export const getTasksWithCache = cache(async () => {
  const tasks = await getTasks();
  return tasks;
});

export function optimisticUpdateTask(
  tasks: Task[],
  taskId: number,
  updates: Partial<Task>
): Task[] {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
  );
}

export function optimisticDeleteTask(tasks: Task[], taskId: number): Task[] {
  return tasks.filter((task) => task.id !== taskId);
}
