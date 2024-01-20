import { cn } from '~/lib/utils';

export function Section({ className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return <section className={cn('flex min-h-0 flex-col gap-y-3', className)} {...props} />;
}
