import { Button, buttonVariants } from '@arishi/shadcn-ui/components/button';
import { Dock, DockIcon } from '@arishi/shadcn-ui/components/magicui/dock';
import { Separator } from '@arishi/shadcn-ui/components/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '@arishi/shadcn-ui/components/tooltip';
import { cn } from '@arishi/shadcn-ui/lib/utils';
import { Link } from '@remix-run/react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { forwardRef } from 'react';
import { DATA } from '~/content/data';

export default function NavDock() {
  return (
    <div className="fixed inset-x-0 bottom-20 z-30 mx-auto mb-4 flex h-full max-h-14 origin-bottom">
      <Dock direction="bottom">
        {DATA.navbar.map((item) => (
          <DockIcon key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={item.href} className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-12')}>
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={social.url} className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-12')}>
                    <social.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent>
              <p>Theme</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </div>
  );
}

export const ModeToggle = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>((props, ref) => {
  return (
    <Button ref={ref} variant="ghost" type="button" size="icon" className="px-2" {...props}>
      <SunIcon className="h-[1.2rem] w-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200" />
      <MoonIcon className="hidden h-[1.2rem] w-[1.2rem] text-neutral-800 dark:block dark:text-neutral-200" />
    </Button>
  );
});
ModeToggle.displayName = 'ModeToggle';
