'use server';

import { db } from '@/db/client';
import { NewTask, Task, tasks } from '@/db/schema';
import { validateTask } from '@/lib/validations';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getTasks() {
  return db.select().from(tasks).orderBy(tasks.dueDate);
}

export async function getTask(id: number): Promise<Task | undefined> {
  const result = await db.select().from(tasks).where(eq(tasks.id, id));
  return result[0];
}

export async function createTask(formData: FormData) {
  const data = {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || '',
    dueDate: formData.get('dueDate') as string,
    priority: (formData.get('priority') as 'low' | 'medium' | 'high') || 'low',
  };

  const validation = validateTask(data);
  if (!validation.success) {
    throw new Error('Invalid task data');
  }

  type TaskInput = {
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
  };

  const validatedData = validation.data as TaskInput;
  await db.insert(tasks).values({
    title: validatedData.title,
    description: validatedData.description || '',
    dueDate: validatedData.dueDate,
    priority: validatedData.priority,
  });

  revalidatePath('/');
  redirect('/');
}

export async function updateTask(id: number, data: Partial<NewTask>) {
  await db
    .update(tasks)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(tasks.id, id));

  revalidatePath('/');
  revalidatePath(`/${id}`);
}

export async function deleteTask(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath('/');
  redirect('/');
}
