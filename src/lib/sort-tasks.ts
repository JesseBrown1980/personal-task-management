import { Task } from '@/db/schema';

type SortOption = 'dueDate' | 'title' | 'status';

export function sortTasks(tasks: Task[], sortBy: SortOption = 'dueDate') {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
        return Number(b.isCompleted) - Number(a.isCompleted);
      default:
        return 0;
    }
  });
}
