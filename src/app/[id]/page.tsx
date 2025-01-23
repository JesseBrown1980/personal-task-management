import { getTask } from '@/app/actions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TaskDetailContent from './TaskDetailContent';

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const task = await getTask(Number(params.id));

  if (!task) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-4">
      <Suspense fallback={<LoadingSpinner />}>
        <TaskDetailContent task={task} />
      </Suspense>
    </main>
  );
}
