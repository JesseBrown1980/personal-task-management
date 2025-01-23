'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { NewTask } from '@/db/schema';
import { cn } from '@/lib/utils';
import { validateTask } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import MutationState from './MutationState';

interface TaskFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Partial<NewTask>;
  submitLabel?: string;
}

export default function TaskForm({
  onSubmit,
  initialData = {},
  submitLabel = 'Submit',
}: TaskFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const formData = new FormData(e.currentTarget);
      const formObject = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        dueDate: formData.get('dueDate') as string,
        priority: formData.get('priority') as 'low' | 'medium' | 'high',
      };

      const validationResult = validateTask(formObject);

      if (!validationResult.success) {
        setErrors(validationResult.errors ?? {});
        return;
      }

      await onSubmit(formData);
    } catch (error) {
      setErrors({ form: ['An unexpected error occurred. Please try again.'] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <Alert variant="destructive">
          <AlertDescription>{errors.form[0]}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialData.title}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initialData.description}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date *</Label>
        <Input
          type="date"
          id="dueDate"
          name="dueDate"
          defaultValue={initialData.dueDate}
          className={cn(
            'cursor-pointer',
            '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
            '[&::-webkit-calendar-picker-indicator]:text-foreground',
            '[&::-webkit-calendar-picker-indicator]:dark:invert',
            '[&::-webkit-calendar-picker-indicator]:hover:opacity-70',
            errors.dueDate ? 'border-red-500' : ''
          )}
        />
        {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select name="priority" defaultValue={initialData.priority || 'low'}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <MutationState action={handleSubmit} loadingText="Saving...">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </MutationState>
    </form>
  );
}
