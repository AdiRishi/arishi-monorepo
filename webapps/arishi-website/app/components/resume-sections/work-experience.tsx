import { Badge } from '@arishi/ui/components/badge';
import { Card, CardHeader, CardContent } from '@arishi/ui/components/card';
import { cn } from '@arishi/ui/lib/utils';
import { RESUME_DATA } from '~/content/data';
import { Section } from './section';

type WorkExperience = (typeof RESUME_DATA)['work'][number];
type WorkBadges = readonly string[];

interface BadgeListProps {
  className?: string;
  badges: WorkBadges;
}

function BadgeList({ className, badges }: BadgeListProps) {
  if (badges.length === 0) return null;

  return (
    <ul className={cn('inline-flex list-none gap-x-1 p-0', className)} aria-label="Technologies used">
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

interface WorkPeriodProps {
  start: WorkExperience['start'];
  end?: WorkExperience['end'];
}

function WorkPeriod({ start, end }: WorkPeriodProps) {
  return (
    <div
      className="text-sm text-gray-500 tabular-nums"
      aria-label={`Employment period: ${start} to ${end ?? 'Present'}`}
    >
      {start} - {end ?? 'Present'}
    </div>
  );
}

interface CompanyLinkProps {
  company: WorkExperience['company'];
  link: WorkExperience['href'];
}

function CompanyLink({ company, link }: CompanyLinkProps) {
  return (
    <a
      className="hover:underline"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company} company website`}
    >
      {company}
    </a>
  );
}

interface WorkExperienceItemProps {
  work: WorkExperience;
}

function WorkExperienceItem({ work }: WorkExperienceItemProps) {
  const { company, href, badges, title, start, end, description } = work;

  return (
    <Card className="py-1 print:py-0">
      <CardHeader className="print:space-y-1">
        <div className="flex items-center justify-between gap-x-2 text-base">
          <h3 className="inline-flex items-center justify-center gap-x-1 leading-none font-semibold print:text-sm">
            <CompanyLink company={company} link={href} />
            <BadgeList className="hidden gap-x-1 sm:inline-flex" badges={badges} />
          </h3>
          <WorkPeriod start={start} end={end} />
        </div>

        <h4 className="font-mono text-sm leading-none font-semibold print:text-[12px]">{title}</h4>
      </CardHeader>

      <CardContent>
        <div className="text-foreground/80 mt-2 text-xs text-pretty print:mt-1 print:text-[10px]">{description}</div>
        <div className="mt-2">
          <BadgeList className="-mx-2 flex-wrap gap-1 sm:hidden" badges={badges} />
        </div>
      </CardContent>
    </Card>
  );
}

interface WorkExperienceProps {
  work: (typeof RESUME_DATA)['work'];
}

export function WorkExperience({ work }: WorkExperienceProps) {
  return (
    <Section>
      <h2 className="text-xl font-bold" id="work-experience">
        Work Experience
      </h2>
      <div className="space-y-4 print:space-y-0" role="feed" aria-labelledby="work-experience">
        {work.map((item) => (
          <article key={`${item.company}-${item.start}`}>
            <WorkExperienceItem work={item} />
          </article>
        ))}
      </div>
    </Section>
  );
}
