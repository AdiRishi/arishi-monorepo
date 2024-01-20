import { IntroSection } from './intro-section';
import { Section } from './section';
import type { MetaFunction } from '@remix-run/cloudflare';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { RESUME_DATA } from '~/data/resume';

export const meta: MetaFunction = () => {
  return [{ title: RESUME_DATA.name }, { name: 'description', content: RESUME_DATA.about }];
};

export default function Index() {
  return (
    <div className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
      <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-6">
        <IntroSection />
        <Section>
          <h2 className="text-xl font-bold">About</h2>
          <p className="text-pretty font-mono text-sm text-muted-foreground">{RESUME_DATA.summary}</p>
        </Section>
        <Section>
          <h2 className="text-xl font-bold">Work Experience</h2>
          {RESUME_DATA.work.map((work) => {
            return (
              <Card key={work.company}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-x-2 text-base">
                    <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                      <a className="hover:underline" href={work.link}>
                        {work.company}
                      </a>

                      <span className="inline-flex gap-x-1">
                        {work.badges.map((badge) => (
                          <Badge variant="secondary" className="align-middle text-xs" key={badge}>
                            {badge}
                          </Badge>
                        ))}
                      </span>
                    </h3>
                    <div className="text-sm tabular-nums text-gray-500">
                      {work.start} - {work.end}
                    </div>
                  </div>

                  <h4 className="font-mono text-sm leading-none">{work.title}</h4>
                </CardHeader>
                <CardContent className="mt-2 text-xs">{work.description}</CardContent>
              </Card>
            );
          })}
        </Section>
      </section>
    </div>
  );
}
