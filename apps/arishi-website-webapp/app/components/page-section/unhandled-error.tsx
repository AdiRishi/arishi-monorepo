import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/button';

export type UnhandledErrorProps = {
  title: string;
  statusCode: number;
  description: string;
};

export const UnhandledError = ({ title, statusCode, description }: UnhandledErrorProps) => {
  return (
    <section className="relative h-[calc(50vh-60px)] sm:h-[calc(50vh-70px)] md:h-[calc(50vh-70px)] lg:h-[calc(100vh-70px)]">
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="text-9xl font-bold text-black">{statusCode}</p>
        <p className="mt-4 text-2xl">{title}</p>
        <p className="mt-2">{description}</p>
        <Link to="/" className="mt-4 w-full px-6 py-2">
          <Button>Go Home</Button>
        </Link>
      </div>
    </section>
  );
};
