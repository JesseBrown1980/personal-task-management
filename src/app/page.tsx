import LoadingSpinner from '@/components/LoadingSpinner';
import RefreshButton from '@/components/RefreshButton';
import TaskListWrapper from '@/components/TaskListWrapper';
import { Button } from '@/components/ui/button';
import getQueryClient from '@/lib/getQueryClient';
import { getTasksWithCache } from '@/lib/taskCache';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['tasks'],
    queryFn: getTasksWithCache,
  });

  return (
    <main className="mx-auto max-w-4xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <RefreshButton />
        </div>
        <Button asChild>
          <Link href="/add">Add Task</Link>
        </Button>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TaskListWrapper initialTasks={await getTasksWithCache()} />
        </HydrationBoundary>
      </Suspense>
    </main>
  );
}
