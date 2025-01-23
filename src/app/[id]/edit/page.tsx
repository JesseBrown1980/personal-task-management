import { getTask, updateTask } from '@/app/actions';
import LoadingSpinner from '@/components/LoadingSpinner';
import TaskForm from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

interface EditTaskPageProps {
  params: {
    id: string;
  };
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  return (
    <main className="mx-auto max-w-4xl p-4">
      <Suspense fallback={<LoadingSpinner />}>
        <EditTaskContent params={params} />
      </Suspense>
    </main>
  );
}

async function EditTaskContent({ params }: EditTaskPageProps) {
  const task = await getTask(Number(params.id));

  if (!task) {
    notFound();
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Task</h1>
        <Button variant="secondary" asChild>
          <Link href={`/${task.id}`}>Back</Link>
        </Button>
      </div>

      <TaskForm
        initialData={task}
        onSubmit={async (formData) => {
          'use server';
          const data = {
            title: formData.get('title') as string | undefined,
            description: formData.get('description') as string | undefined,
            dueDate: formData.get('dueDate') as string | undefined,
            priority: formData.get('priority') as 'low' | 'medium' | 'high' | undefined,
          };

          await updateTask(task.id, data);
          redirect(`/${task.id}`);
        }}
        submitLabel="Update Task"
      />
    </>
  );
}
