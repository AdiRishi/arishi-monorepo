import { cn } from '@arishi/shadcn-ui/lib/utils';

export function ContentSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('px-4 py-12 lg:px-8 lg:py-12 xl:px-32 xl:py-12', className)}>{children}</section>;
}
