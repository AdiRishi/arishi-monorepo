import type { MetaFunction } from '@remix-run/cloudflare';
import { GlobeIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { ProjectCard } from '~/components/project-card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { RESUME_DATA } from '~/data/resume';
import { CommandMenu } from './command-menu';
import { Section } from './section';

export const meta: MetaFunction = () => {
  return [{ title: RESUME_DATA.name }, { name: 'description', content: RESUME_DATA.about }];
};

export default function Index() {
  return (
    <div className="container relative mx-auto scroll-my-12 overflow-auto p-4 md:p-16 print:p-12">
      <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6">
        <IntroSection />
        <AboutSection />
        <WorkExperienceSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <CommandMenu
          links={[
            {
              url: RESUME_DATA.personalWebsiteUrl,
              title: 'Personal Website',
            },
            ...RESUME_DATA.contact.social.map((socialMediaLink) => ({
              url: socialMediaLink.url,
              title: socialMediaLink.name,
            })),
          ]}
        />
      </section>
    </div>
  );
}

function IntroSection() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 space-y-1.5">
        <h1 className="text-2xl font-bold">{RESUME_DATA.name}</h1>
        <p className="max-w-md text-pretty font-mono text-sm text-muted-foreground">{RESUME_DATA.about}</p>
        <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
          <a
            className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
            href={RESUME_DATA.locationLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlobeIcon className="size-3" />
            {RESUME_DATA.location}
          </a>
        </p>
        <div className="flex gap-x-1 pt-1 font-mono text-sm text-muted-foreground print:hidden">
          {RESUME_DATA.contact.email ? (
            <Button className="size-8" variant="outline" size="icon" asChild>
              <a href={`mailto:${RESUME_DATA.contact.email}`} aria-label="Email Me">
                <MailIcon className="size-4" />
              </a>
            </Button>
          ) : null}
          {RESUME_DATA.contact.tel ? (
            <Button className="size-8" variant="outline" size="icon" asChild>
              <a href={`tel:${RESUME_DATA.contact.tel}`} target="_blank" rel="noopener noreferrer" aria-label="Call me">
                <PhoneIcon className="size-4" />
              </a>
            </Button>
          ) : null}
          {RESUME_DATA.contact.social.map((social) => (
            <Button key={social.name} className="size-8" variant="outline" size="icon" asChild>
              <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                <social.icon className="size-4" />
              </a>
            </Button>
          ))}
        </div>
        <div className="hidden flex-col gap-x-1 font-mono text-sm text-muted-foreground print:flex">
          {RESUME_DATA.contact.email ? (
            <a href={`mailto:${RESUME_DATA.contact.email}`} target="_blank" rel="noopener noreferrer">
              <span className="underline">{RESUME_DATA.contact.email}</span>
            </a>
          ) : null}
          {RESUME_DATA.contact.tel ? (
            <a href={`tel:${RESUME_DATA.contact.tel}`} target="_blank" rel="noopener noreferrer">
              <span className="underline">{RESUME_DATA.contact.tel}</span>
            </a>
          ) : null}
        </div>
      </div>

      <Avatar className="size-28">
        <AvatarImage alt={RESUME_DATA.name} src={RESUME_DATA.avatarUrl} />
        <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
      </Avatar>
    </div>
  );
}

function AboutSection() {
  return (
    <Section>
      <h2 className="text-xl font-bold">About</h2>
      <p className="text-pretty font-mono text-sm text-muted-foreground">{RESUME_DATA.summary}</p>
    </Section>
  );
}

function WorkExperienceSection() {
  return (
    <Section>
      <h2 className="text-xl font-bold">Work Experience</h2>
      {RESUME_DATA.work.map((work, i) => {
        return (
          <Card key={`${work.company}-${i}`} className="border-0 shadow-none">
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
            <CardContent className="mt-2 text-pretty p-0 font-mono text-xs text-muted-foreground">
              {work.description}
            </CardContent>
          </Card>
        );
      })}
    </Section>
  );
}

function EducationSection() {
  return (
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
            <CardContent className="mt-2 text-pretty p-0 font-mono text-xs text-muted-foreground">
              {education.degree}
            </CardContent>
          </Card>
        );
      })}
    </Section>
  );
}

function SkillsSection() {
  return (
    <Section>
      <h2 className="text-xl font-bold">Skills</h2>
      <div className="flex flex-wrap gap-1">
        {RESUME_DATA.skills.map((skill) => {
          return <Badge key={skill}>{skill}</Badge>;
        })}
      </div>
    </Section>
  );
}

function ProjectsSection() {
  return (
    <Section className="scroll-mb-16">
      <h2 className="text-xl font-bold">Projects</h2>
      <div className="-mx-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-2">
        {RESUME_DATA.projects.map((project) => {
          return (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              tags={project.techStack}
              link={project.link ? project.link.href : undefined}
            />
          );
        })}
      </div>
    </Section>
  );
}
