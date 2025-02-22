import { RESUME_DATA } from '~/content/data';
import { Section } from './section';

interface AboutProps {
  summary: typeof RESUME_DATA.summary;
  className?: string;
}

export function Summary({ summary, className }: AboutProps) {
  return (
    <Section className={className}>
      <h2 className="text-xl font-bold" id="about-section">
        About
      </h2>
      <div
        className="text-foreground/80 font-mono text-sm text-pretty print:text-[12px]"
        aria-labelledby="about-section"
      >
        {summary}
      </div>
    </Section>
  );
}
