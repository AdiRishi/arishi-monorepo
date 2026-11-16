import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@ui-sdk/react/navigation-menu";
import { useEffect, useState } from "react";

import { sections } from "./content";

const readingBand = { rootMargin: "-40% 0px -59% 0px" };

function useSectionInView(ids: readonly string[]) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const inBand = new Set<string>();
    const observers = ids.flatMap((id) => {
      const section = document.getElementById(id);
      if (!section) return [];
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(id);
          else inBand.delete(id);
        }
        setCurrent(ids.findLast((candidate) => inBand.has(candidate)) ?? null);
      }, readingBand);
      observer.observe(section);
      return [observer];
    });
    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, [ids]);

  return current;
}

const ids = Object.keys(sections);

export function SectionNav() {
  const current = useSectionInView(ids);

  return (
    <NavigationMenu
      aria-label="Sections"
      className="fixed inset-x-0 top-0 z-6 bg-linear-to-b from-paper from-70% to-paper/0 px-4 pt-[calc(14px+env(safe-area-inset-top,0px))] pb-3 md:top-[calc(24px+env(safe-area-inset-top,0px))] md:right-[30px] md:left-auto md:bg-none md:p-0"
    >
      <NavigationMenuList className="flex justify-between gap-2.5 font-mono text-[10px] tracking-[0.1em] uppercase md:justify-start md:gap-[26px] md:text-caption md:tracking-label">
        {Object.entries(sections).map(([id, name]) => (
          <NavigationMenuItem key={id}>
            <NavigationMenuLink
              href={`#${id}`}
              current={current === id}
              className="relative block px-0.5 py-1 text-mute transition-colors duration-250 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100 data-current:text-ink data-current:after:scale-x-100"
            >
              {name}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
