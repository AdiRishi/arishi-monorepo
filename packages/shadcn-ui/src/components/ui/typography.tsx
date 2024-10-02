import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../lib/utils';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 text-lg font-light tracking-tight',
      h6: 'scroll-m-20 text-base font-light tracking-tight',
      p: 'leading-7',
      tagline: 'text-sm font-light uppercase tracking-[8px] md:text-lg',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      ul: 'ml-6 list-disc [&>li]:mt-2',
      ol: 'ml-6 list-decimal [&>li]:mt-2',
      inlineCode: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      lead: 'text-xl text-muted-foreground',
      largeText: 'text-lg font-semibold',
      smallText: 'text-sm font-medium leading-none',
      mutedText: 'text-muted-foreground" text-sm',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

type VariantPropType = VariantProps<typeof typographyVariants>;

const variantElementMap: Record<NonNullable<VariantPropType['variant']>, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  tagline: 'p',
  blockquote: 'blockquote',
  inlineCode: 'code',
  largeText: 'div',
  smallText: 'small',
  lead: 'p',
  mutedText: 'p',
  ul: 'ul',
  ol: 'ol',
};

export interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  asChild?: boolean;
  as?: string;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : (as ?? (variant ? variantElementMap[variant] : 'p') ?? 'div');
    return <Comp className={cn(typographyVariants({ variant, className }))} ref={ref} {...props} />;
  }
);

Typography.displayName = 'Typography';

export { Typography };
