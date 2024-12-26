import { cn } from '@arishi/ui/lib/utils';
import { useNavigation } from '@remix-run/react';
import { useEffect, useState, useRef } from 'react';
import NavDock from '~/components/navdock';

export type LayoutProps = {
  children: React.ReactNode;
};
export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col bg-background text-foreground">
      <GlobalLoading />
      <main className="mx-auto min-h-screen max-w-2xl bg-background px-6 py-12 antialiased sm:py-24">{children}</main>
      <NavDock />
    </div>
  );
}

function GlobalLoading() {
  const navigation = useNavigation();
  const active = navigation.state !== 'idle';

  const ref = useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    if (active) setAnimationComplete(false);

    void Promise.allSettled(ref.current.getAnimations().map(({ finished }) => finished)).then(
      () => !active && setAnimationComplete(true)
    );
  }, [active]);

  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-valuetext={active ? 'Loading' : undefined}
      className="fixed inset-x-0 left-0 top-0 z-50 h-1"
    >
      <div
        ref={ref}
        className={cn(
          'h-full bg-gradient-to-r from-primary to-primary transition-all duration-500 ease-in-out',
          navigation.state === 'idle' && animationComplete && 'w-0 opacity-0 transition-none',
          navigation.state === 'submitting' && 'w-4/12',
          navigation.state === 'loading' && 'w-10/12',
          navigation.state === 'idle' && !animationComplete && 'w-full'
        )}
      />
    </div>
  );
}
