'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface MutationStateProps {
  children: React.ReactNode;
  action: (...args: any[]) => Promise<any>;
  onSuccess?: () => void;
  loadingText?: string;
}

export default function MutationState({
  children,
  action,
  onSuccess,
  loadingText = 'Processing...',
}: MutationStateProps) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: action,
    onSuccess: () => {
      router.refresh();
      onSuccess?.();
    },
  });

  return (
    <div className="relative">
      {mutation.isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <div className="rounded-md bg-white p-4 shadow-lg">
            <p className="text-sm text-gray-600">{loadingText}</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
