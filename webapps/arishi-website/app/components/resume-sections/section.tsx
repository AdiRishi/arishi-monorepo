import { cn } from '@arishi/ui/lib/utils';
import React from 'react';

export type BadgeProps = React.HTMLAttributes<HTMLDivElement>;

export function Section({ className, ...props }: BadgeProps) {
  return <section className={cn('flex min-h-0 flex-col gap-y-3 print:gap-y-1', className)} {...props} />;
}
