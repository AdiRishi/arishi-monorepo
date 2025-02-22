import { Button } from '@arishi/ui/components/button';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@arishi/ui/components/command';
import { CommandIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { RESUME_DATA } from '~/content/data';

function getCommandMenuLinks() {
  const links = [];

  if (RESUME_DATA.url) {
    links.push({
      url: RESUME_DATA.url,
      title: 'Personal Website',
    });
  }

  const socialLinks = Object.values(RESUME_DATA.contact.social);

  return [
    ...links,
    ...socialLinks.map((socialMediaLink) => ({
      url: socialMediaLink.url,
      title: socialMediaLink.name,
    })),
  ];
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const links = useMemo(getCommandMenuLinks, []);
  const isMac = typeof window !== 'undefined' ? window.navigator.userAgent.includes('Mac') : false;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <p className="border-t-muted text-muted-foreground fixed right-0 bottom-0 left-0 hidden border-t bg-white p-1 text-center text-sm xl:block print:hidden">
        Press{' '}
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span>+K
        </kbd>{' '}
        to open the command menu
      </p>
      <Button
        onClick={() => setOpen((open) => !open)}
        variant="outline"
        size="icon"
        className="fixed right-4 bottom-4 flex rounded-full shadow-2xl xl:hidden print:hidden"
      >
        <CommandIcon className="my-6 size-6" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.print();
              }}
            >
              <span>Print</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Links">
            {links.map(({ url, title }) => (
              <CommandItem
                key={url}
                onSelect={() => {
                  setOpen(false);
                  window.open(url, '_blank');
                }}
              >
                <span>{title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
