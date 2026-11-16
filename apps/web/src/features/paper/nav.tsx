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
  const [current, setCurrent] = useState(ids[0] ?? null);

  useEffect(() => {
    const inBand = new Set<string>();
    // The last section is short, so the page can end before it reaches the reading band.
    const mark = () => {
      const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
      const reading = atEnd ? ids.at(-1) : ids.findLast((id) => inBand.has(id));
      setCurrent(reading ?? ids[0] ?? null);
    };
    const observers = ids.flatMap((id) => {
      const section = document.getElementById(id);
      if (!section) return [];
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(id);
          else inBand.delete(id);
        }
        mark();
      }, readingBand);
      observer.observe(section);
      return [observer];
    });
    addEventListener("scroll", mark, { passive: true });
    return () => {
      removeEventListener("scroll", mark);
      for (const observer of observers) observer.disconnect();
    };
  }, [ids]);

  return current;
}

const ids = Object.keys(sections);

export function SectionNav() {
  const current = useSectionInView(ids);

  return (
    <NavigationMenu aria-label="Sections" className="min-w-0 flex-1 md:flex-none">
      <NavigationMenuList className="-mx-1 flex justify-between font-mono text-label uppercase md:mx-0 md:justify-start md:gap-6">
        {Object.entries(sections).map(([id, { name }]) => (
          <NavigationMenuItem key={id}>
            <NavigationMenuLink
              href={`#${id}`}
              current={current === id}
              className="relative block px-1 py-2.5 text-mute transition-colors duration-250 after:absolute after:inset-x-1 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100 data-current:text-ink data-current:after:scale-x-100"
            >
              {name}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
