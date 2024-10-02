import { Avatar, AvatarFallback, AvatarImage } from '@arishi/shadcn-ui/components/avatar';
import type { MetaFunction } from '@remix-run/cloudflare';
import { DATA } from '~/content/data';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  return (
    <main className="flex min-h-[100dvh] flex-col space-y-10">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="flex justify-between gap-2">
            <div className="flex flex-1 flex-col space-y-1.5">
              <p className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Hi, I'm {DATA.name.split(' ')[0]} 👋
              </p>
              <p className="max-w-[600px] md:text-xl">{DATA.description}</p>
            </div>
            <div className="size-28 border">
              <Avatar>
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
