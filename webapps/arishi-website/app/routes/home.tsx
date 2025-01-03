import { Avatar, AvatarFallback, AvatarImage } from '@arishi/ui/components/avatar';
import { Badge } from '@arishi/ui/components/badge';
import { AppType } from '@arishi/website-api';
import { hc } from 'hono/client';
import * as _ from 'radashi';
import Markdown from 'react-markdown';
import { Link } from 'react-router';
import { ProjectCard } from '~/components/project-card';
import { ResumeCard } from '~/components/resume-card';
import { DATA } from '~/content/data';
import { wrapPromise } from '~/lib/ts-utils';
import { Route } from './+types/home';

export const loader = async (args: Route.LoaderArgs) => {
  const apiClient = hc<AppType>('https://website-api.com', {
    fetch: args.context.cloudflare.env.WEBSITE_API.fetch.bind(args.context.cloudflare.env.WEBSITE_API),
  });
  const { rpcPing, honoPingResponse } = await _.all({
    rpcPing: wrapPromise(args.context.cloudflare.env.PUBLIC_DATA_SERVICE.ping()),
    honoPingResponse: apiClient['public-data'].ping.$get(),
  });
  const honoPing = await honoPingResponse.text();
  return { rpcPing, honoPing };
};

export const meta: Route.MetaFunction = () => {
  return [{ title: DATA.name }, { name: 'description', content: DATA.description }];
};

export default function Index({ loaderData: data }: Route.ComponentProps) {
  return (
    <section className="flex min-h-[100dvh] flex-col space-y-10">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="flex justify-between gap-2">
            <div className="flex flex-1 flex-col space-y-1.5">
              <p className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Hi, I&apos;m {DATA.name.split(' ')[0]} 👋
              </p>
              <p className="max-w-[600px] md:text-xl">{DATA.description}</p>
            </div>
            <div className="size-28 rounded-full border">
              <Avatar className="h-full w-full">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </section>
      <form hidden className="hidden">
        <input type="hidden" name="honoPing" value={data.honoPing} />
        <input type="hidden" name="rpcPing" value={data.rpcPing} />
      </form>
      <section id="about">
        <div>
          <h2 className="text-xl font-bold">About</h2>
        </div>
        <div>
          <Markdown className="prose dark:prose-invert max-w-full text-pretty font-sans text-sm text-muted-foreground">
            {DATA.summary}
          </Markdown>
        </div>
      </section>
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <div>
            <h2 className="text-xl font-bold">Work Experience</h2>
          </div>
          {DATA.work.map((work, id) => (
            <ResumeCard
              key={id}
              logoUrl={work.logoUrl}
              altText={work.company}
              title={work.company}
              subtitle={work.title}
              href={work.href}
              badges={work.badges}
              period={`${work.start} - ${work.end ?? 'Present'}`}
              description={work.description}
            />
          ))}
        </div>
      </section>
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-3">
          <div>
            <h2 className="text-xl font-bold">Education</h2>
          </div>
          {DATA.education.map((education, id) => (
            <div key={id}>
              <ResumeCard
                key={education.school}
                href={education.href}
                logoUrl={education.logoUrl}
                altText={education.school}
                title={education.school}
                subtitle={education.degree}
                period={`${education.start} - ${education.end}`}
              />
            </div>
          ))}
        </div>
      </section>
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-3">
          <div>
            <h2 className="text-xl font-bold">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-1">
            {DATA.skills.map((skill, id) => (
              <div key={id}>
                <Badge key={skill}>{skill}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="projects">
        <div className="w-full space-y-12 py-12">
          <div>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
                  My Projects
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Check out my latest work</h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  I&apos;ve worked on a variety of projects, from simple websites to complex web applications. Here are
                  a few of my favorites.
                </p>
              </div>
            </div>
          </div>
          <div className="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
            {DATA.projects.map((project, id) => (
              <div key={id}>
                <ProjectCard
                  href={project.href}
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  dates={project.dates}
                  tags={project.technologies}
                  image={project.image}
                  video={project.video}
                  links={project.links}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="contact">
        <div className="grid w-full items-center justify-center gap-4 px-4 py-12 text-center md:px-6">
          <div>
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">Contact</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get in Touch</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Want to chat? Just shoot me a dm{' '}
                <Link to={DATA.contact.social.X.url} className="text-blue-500 hover:underline">
                  with a direct question on twitter
                </Link>{' '}
                and I&apos;ll respond whenever I can. I will ignore all soliciting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
