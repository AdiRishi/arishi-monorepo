import { Badge } from '@arishi/ui/components/badge';
import { cn } from '@arishi/ui/lib/utils';
import { Section } from './section';

type Skills = readonly string[];

interface SkillsListProps {
  skills: Skills;
  className?: string;
}

function SkillsList({ skills, className }: SkillsListProps) {
  return (
    <ul className={cn('flex list-none flex-wrap gap-1 p-0', className)} aria-label="List of skills">
      {skills.map((skill) => (
        <li key={skill}>
          <Badge
            className="justify-start gap-0 font-mono font-semibold text-nowrap focus:ring-2 focus:ring-offset-2 focus:outline-none print:text-[10px]"
            aria-label={`Skill: ${skill}`}
          >
            {skill}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

interface SkillsProps {
  skills: Skills;
  className?: string;
}

export function Skills({ skills, className }: SkillsProps) {
  return (
    <Section className={className}>
      <h2 className="text-xl font-bold" id="skills-section">
        Skills
      </h2>
      <SkillsList skills={skills} aria-labelledby="skills-section" />
    </Section>
  );
}
