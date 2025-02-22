import { Card, CardHeader, CardContent } from '@arishi/ui/components/card';
import { RESUME_DATA } from '~/content/data';
import { Section } from './section';

type Education = (typeof RESUME_DATA)['education'][number];

interface EducationPeriodProps {
  start: Education['start'];
  end: Education['end'];
}

function EducationPeriod({ start, end }: EducationPeriodProps) {
  return (
    <div className="text-sm text-gray-500 tabular-nums" aria-label={`Period: ${start} to ${end}`}>
      {start} - {end}
    </div>
  );
}

interface EducationItemProps {
  education: Education;
}

function EducationItem({ education }: EducationItemProps) {
  const { school, start, end, degree } = education;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-x-2 text-base">
          <h3 className="leading-none font-semibold" id={`education-${school.toLowerCase().replace(/\s+/g, '-')}`}>
            {school}
          </h3>
          <EducationPeriod start={start} end={end} />
        </div>
      </CardHeader>
      <CardContent
        className="text-foreground/80 mt-2 print:text-[12px]"
        aria-labelledby={`education-${school.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {degree}
      </CardContent>
    </Card>
  );
}

interface EducationListProps {
  education: readonly Education[];
}

export function Education({ education }: EducationListProps) {
  return (
    <Section>
      <h2 className="text-xl font-bold" id="education-section">
        Education
      </h2>
      <div className="space-y-4" role="feed" aria-labelledby="education-section">
        {education.map((item) => (
          <article key={item.school}>
            <EducationItem education={item} />
          </article>
        ))}
      </div>
    </Section>
  );
}
