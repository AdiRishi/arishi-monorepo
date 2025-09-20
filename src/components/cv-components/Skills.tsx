import React from "react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export function Skills({ skills }: { skills: string[] }) {
  return (
    <Section>
      <h2 className="text-xl font-bold" id="skills-section">
        Skills
      </h2>
      <ul
        className={cn("flex list-none flex-wrap gap-1 p-0")}
        aria-label="List of skills"
      >
        {skills.map((skill) => (
          <li key={skill}>
            <Badge className="print:text-[10px]" aria-label={`Skill: ${skill}`}>
              {skill}
            </Badge>
          </li>
        ))}
      </ul>
    </Section>
  );
}
