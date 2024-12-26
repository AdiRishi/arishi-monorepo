import { Button, buttonVariants } from '@arishi/ui/components/button';
import { Dock, DockIcon } from '@arishi/ui/components/dock';
import { Separator } from '@arishi/ui/components/separator';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@arishi/ui/components/tooltip';
import { cn } from '@arishi/ui/lib/utils';
import { Link } from '@remix-run/react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { DATA } from '~/content/data';

export default function NavDock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 mb-4">
      <TooltipProvider delayDuration={0}>
        <Dock direction="middle" className="pointer-events-auto">
          {DATA.navbar.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    aria-label={item.label}
                    className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-12 rounded-full')}
                  >
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
          {Object.entries(DATA.contact.social).map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={social.url}
                    aria-label={social.name}
                    className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-12 rounded-full')}
                  >
                    <social.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{social.name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="h-full" />
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" type="button" size="icon" className="size-12 rounded-full">
                  <SunIcon className="h-[1.2rem] w-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200" />
                  <MoonIcon className="hidden h-[1.2rem] w-[1.2rem] text-neutral-800 dark:block dark:text-neutral-200" />
                </Button>
              </TooltipTrigger>
              <TooltipContent hidden>
                <p>Theme</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </TooltipProvider>
    </div>
  );
}
