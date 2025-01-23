'use client';

import { Task } from '@/db/schema';
import { useDebounce } from '@/hooks/useDebounce';
import { useCallback, useState } from 'react';

interface TaskSearchProps {
  tasks: Task[];
  onSearch: (filteredTasks: Task[]) => void;
}

export default function TaskSearch({ tasks, onSearch }: TaskSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebounce((term: string) => {
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term.toLowerCase()) ||
        task.description.toLowerCase().includes(term.toLowerCase())
    );
    onSearch(filtered);
  }, 300);

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      debouncedSearch(term);
    },
    [debouncedSearch]
  );

  return (
    <input
      type="search"
      placeholder="Search tasks..."
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
    />
  );
}
