'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task } from '@/db/schema';
import { useState } from 'react';

interface TaskFilterProps {
  onFilterChange: (filter: TaskFilter) => void;
}

export type TaskFilter = {
  status: 'all' | 'completed' | 'pending';
  priority: 'all' | Task['priority'];
};

export default function TaskFilter({ onFilterChange }: TaskFilterProps) {
  const [filter, setFilter] = useState<TaskFilter>({
    status: 'all',
    priority: 'all',
  });

  const handleFilterChange = (key: keyof TaskFilter, value: string) => {
    const newFilter = { ...filter, [key]: value };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="mb-4 flex gap-4">
      <Select value={filter.status} onValueChange={(value) => handleFilterChange('status', value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filter.priority}
        onValueChange={(value) => handleFilterChange('priority', value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
