import { createTask } from '@/app/actions';
import LoadingSpinner from '@/components/LoadingSpinner';
import TaskForm from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function AddTaskPage() {
  return (
    <main className="mx-auto max-w-4xl p-4">
      <Suspense fallback={<LoadingSpinner />}>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add New Task</h1>
          <Button variant="secondary" asChild>
            <Link href="/">Back</Link>
          </Button>
        </div>

        <TaskForm
          onSubmit={async (formData) => {
            'use server';
            await createTask(formData);
            redirect('/');
          }}
          submitLabel="Create Task"
        />
      </Suspense>
    </main>
  );
}
