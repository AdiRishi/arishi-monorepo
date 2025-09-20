import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { ResumeData } from "@/content/resume-type";

type Project = ResumeData["projects"][number];

function ProjectLink({
  title,
  href,
  active,
}: {
  title: string;
  href?: string;
  active?: boolean;
}) {
  if (!href)
    return (
      <>
        {title}
        {active ? (
          <span
            className="ml-1 inline-block size-1 rounded-full bg-green-500 align-middle"
            title="Active project indicator"
            aria-hidden="true"
          />
        ) : null}
      </>
    );
  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 hover:underline"
        aria-label={`${title} project (opens in new tab)`}
      >
        {title}
        {active ? (
          <span
            className="size-1 rounded-full bg-green-500"
            title="Active project indicator"
            aria-hidden="true"
          />
        ) : null}
      </a>
      <div
        className="hidden font-mono text-xs underline print:visible"
        aria-hidden="true"
      >
        {href.replace("https://", "").replace("www.", "").replace("/", "")}
      </div>
    </>
  );
}

function ProjectTags({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <ul
      className="mt-2 flex list-none flex-wrap gap-1 p-0"
      aria-label="Technologies used"
    >
      {tags.map((tag) => (
        <li key={tag}>
          <Badge
            className="px-1 py-0 text-[10px] print:px-1 print:py-0.5 print:text-[8px] print:leading-tight"
            variant="secondary"
          >
            {tag}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

function ProjectCard({
  title,
  description,
  tags,
  link,
  active,
}: {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  active?: boolean;
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden gap-0 rounded-lg border p-3 shadow-none">
      <CardHeader className="px-0">
        <div className="space-y-1">
          <CardTitle className="text-base">
            <ProjectLink title={title} href={link} active={active} />
          </CardTitle>
          <CardDescription
            className="text-pretty font-mono text-xs print:text-[10px]"
            aria-label="Project description"
          >
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-0 mt-auto flex">
        <ProjectTags tags={tags} />
      </CardContent>
    </Card>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <Section className="scroll-mb-16 print:space-y-4">
      <h2 className="text-xl font-bold" id="side-projects">
        Side projects
      </h2>
      <div
        className="-mx-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-2"
        role="feed"
        aria-labelledby="side-projects"
      >
        {projects.map((project) => (
          <article key={project.title} className="h-full">
            <ProjectCard
              title={project.title}
              description={project.description}
              tags={project.technologies}
              link={project.href}
              active={project.active}
            />
          </article>
        ))}
      </div>
    </Section>
  );
}
