import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { ResumeData } from "@/content/resume-type";

type EducationItem = ResumeData["education"][number];

function EducationPeriod({ start, end }: { start: string; end: string }) {
  return (
    <div
      className="text-sm tabular-nums text-gray-500"
      title={`Period: ${start} to ${end}`}
    >
      {start} - {end}
    </div>
  );
}

function EducationCard({ education }: { education: EducationItem }) {
  const { school, start, end, degree } = education;
  return (
    <Card className="rounded-lg border-0 shadow-none gap-0 py-0">
      <CardHeader className="px-0 flex flex-col space-y-1.5">
        <div className="flex items-center justify-between gap-x-2 text-base">
          <h3
            className="font-semibold leading-none"
            id={`education-${school.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {school}
          </h3>
          <EducationPeriod start={start} end={end} />
        </div>
      </CardHeader>
      <CardContent
        className="px-0 mt-2 text-foreground/80 print:text-[12px]"
        aria-labelledby={`education-${school.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {degree}
      </CardContent>
    </Card>
  );
}

export function Education({
  education,
}: {
  education: readonly EducationItem[];
}) {
  return (
    <Section>
      <h2 className="text-xl font-bold" id="education-section">
        Education
      </h2>
      <div
        className="space-y-4"
        role="feed"
        aria-labelledby="education-section"
      >
        {education.map((item) => (
          <article key={item.school}>
            <EducationCard education={item} />
          </article>
        ))}
      </div>
    </Section>
  );
}
