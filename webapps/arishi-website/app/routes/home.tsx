import { AppType } from '@arishi/website-api';
import { hc } from 'hono/client';
import * as _ from 'radashi';
import { CommandMenu } from '~/components/command-menu';
import { Education } from '~/components/resume-sections/education';
import { Header } from '~/components/resume-sections/header';
import { Projects } from '~/components/resume-sections/projects';
import { Skills } from '~/components/resume-sections/skills';
import { Summary } from '~/components/resume-sections/summary';
import { WorkExperience } from '~/components/resume-sections/work-experience';
import { RESUME_DATA } from '~/content/data';
import { wrapPromise } from '~/lib/ts-utils';
import { Route } from './+types/home';

export const meta: Route.MetaFunction = () => {
  return [{ title: RESUME_DATA.name }, { name: 'description', content: RESUME_DATA.description }];
};

export async function loader({ context }: Route.LoaderArgs) {
  const apiClient = hc<AppType>('https://website-api.com', {
    fetch: context.cloudflare.env.WEBSITE_API.fetch.bind(context.cloudflare.env.WEBSITE_API),
  });
  const { rpcPing, honoPingResponse } = await _.all({
    rpcPing: wrapPromise(context.cloudflare.env.PUBLIC_DATA_SERVICE.ping()),
    honoPingResponse: apiClient['public-data'].ping.$get(),
  });
  const honoPing = await honoPingResponse.text();
  return { rpcPing, honoPing };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <div className="sr-only">
        <h1>{RESUME_DATA.name}&apos;s Resume</h1>
      </div>
      <div className="hidden">
        <p>{loaderData.honoPing}</p>
        <p>{loaderData.rpcPing}</p>
      </div>
      <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-4" aria-label="Resume Content">
        <Header />

        <div className="space-y-8 print:space-y-4">
          <Summary summary={RESUME_DATA.summary} />

          <WorkExperience work={RESUME_DATA.work} />

          <Education education={RESUME_DATA.education} />

          <Skills skills={RESUME_DATA.skills} />

          <Projects projects={RESUME_DATA.projects} />
        </div>
      </section>
      <nav className="print:hidden" aria-label="Quick navigation">
        <CommandMenu />
      </nav>
    </div>
  );
}
