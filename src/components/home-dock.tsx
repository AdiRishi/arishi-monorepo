"use client";

import Link from "next/link";
import { Command, Home } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeDock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex items-center justify-center">
      <div className="pointer-events-auto">
        <Dock className="bg-background/70 border-border" direction="middle">
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  aria-label="Home"
                  prefetch={false}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full"
                  )}
                >
                  <Home className="size-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Home</TooltipContent>
            </Tooltip>
          </DockIcon>

          <Separator orientation="vertical" className="h-full" />

          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="https://github.com/AdiRishi"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noreferrer noopener"
                  prefetch={false}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full"
                  )}
                >
                  <Icons.github className="size-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>GitHub</TooltipContent>
            </Tooltip>
          </DockIcon>

          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="https://www.linkedin.com/in/adishwar-rishi-8a832498"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noreferrer noopener"
                  prefetch={false}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full"
                  )}
                >
                  <Icons.linkedin className="size-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>LinkedIn</TooltipContent>
            </Tooltip>
          </DockIcon>

          <Separator orientation="vertical" className="h-full" />

          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Command"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full"
                  )}
                >
                  <Command className="size-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Command</TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </div>
    </div>
  );
}
