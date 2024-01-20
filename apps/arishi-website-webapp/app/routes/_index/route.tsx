import { IntroSection } from './intro-section';
import { Section } from './section';
import type { MetaFunction } from '@remix-run/cloudflare';
import { ProjectCard } from '~/components/project-card';
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
              <Card key={work.company} className="border-0 shadow-none">
                <CardHeader className="p-0">
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
                <CardContent className="mt-2 text-xs text-pretty font-mono text-muted-foreground p-0">
                  {work.description}
                </CardContent>
              </Card>
            );
          })}
        </Section>
        <Section>
          <h2 className="text-xl font-bold">Education</h2>
          {RESUME_DATA.education.map((education) => {
            return (
              <Card key={education.school} className="border-0 shadow-none">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between gap-x-2 text-base">
                    <h3 className="font-semibold leading-none">{education.school}</h3>
                    <div className="text-sm tabular-nums text-gray-500">
                      {education.start} - {education.end}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-2 text-xs text-pretty font-mono text-muted-foreground p-0">
                  {education.degree}
                </CardContent>
              </Card>
            );
          })}
        </Section>
        <Section>
          <h2 className="text-xl font-bold">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {RESUME_DATA.skills.map((skill) => {
              return <Badge key={skill}>{skill}</Badge>;
            })}
          </div>
        </Section>
        <Section className="print-force-new-page scroll-mb-16">
          <h2 className="text-xl font-bold">Projects</h2>
          <div className="-mx-3 grid grid-cols-1 gap-3 print:grid-cols-3 print:gap-2 md:grid-cols-2 lg:grid-cols-3">
            {RESUME_DATA.projects.map((project) => {
              return (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  tags={project.techStack}
                  link={'link' in project ? project.link.href : undefined}
                />
              );
            })}
          </div>
        </Section>
      </section>
    </div>
  );
}
