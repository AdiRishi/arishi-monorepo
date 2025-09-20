import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { ResumeData } from "@/content/resume-type";
import { cn } from "@/lib/utils";

type WorkItem = ResumeData["work"][number];

function BadgeList({
  badges,
  className,
}: {
  badges: string[];
  className?: string;
}) {
  if (!badges || badges.length === 0) return null;
  return (
    <ul
      className={cn("inline-flex list-none gap-x-1 p-0", className)}
      aria-label="Technologies used"
    >
      {badges.map((badge) => (
        <li key={badge}>
          <Badge
            variant="secondary"
            className="align-middle text-xs print:px-1 print:py-0.5 print:text-[8px] print:leading-tight"
          >
            {badge}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

function WorkPeriod({ start, end }: { start: string; end?: string }) {
  return (
    <div
      className="text-sm tabular-nums text-gray-500"
      title={`Employment period: ${start} to ${end ?? "Present"}`}
    >
      {start} - {end ?? "Present"}
    </div>
  );
}

function CompanyLink({ company, href }: { company: string; href: string }) {
  return (
    <a
      className="hover:underline"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company} company website`}
    >
      {company}
    </a>
  );
}

function WorkExperienceItem({ work }: { work: WorkItem }) {
  const { company, href, badges = [], title, start, end, description } = work;
  return (
    <Card className="rounded-lg border-0 shadow-none gap-0 py-0">
      <CardHeader className="px-0 flex flex-col space-y-1.5 print:space-y-1">
        <div className="flex items-center justify-between gap-x-2 text-base w-full">
          <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none print:text-sm">
            <CompanyLink company={company} href={href} />
            <BadgeList
              className="hidden gap-x-1 sm:inline-flex"
              badges={badges}
            />
          </h3>
          <WorkPeriod start={start} end={end} />
        </div>
        <h4 className="font-mono text-sm font-semibold leading-none print:text-[12px]">
          {title}
        </h4>
      </CardHeader>
      <CardContent className="px-0">
        <div className="mt-2 text-xs text-foreground/80 print:mt-1 print:text-[10px] text-pretty">
          {description}
        </div>
        <div className="mt-2">
          <BadgeList
            className="-mx-2 flex-wrap gap-1 sm:hidden"
            badges={badges}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function WorkExperience({ work }: { work: ResumeData["work"] }) {
  return (
    <Section>
      <h2 className="text-xl font-bold" id="work-experience">
        Work Experience
      </h2>
      <div
        className="space-y-4 print:space-y-0"
        role="feed"
        aria-labelledby="work-experience"
      >
        {work.map((item) => (
          <article key={`${item.company}-${item.start}`}>
            <WorkExperienceItem work={item} />
          </article>
        ))}
      </div>
    </Section>
  );
}
