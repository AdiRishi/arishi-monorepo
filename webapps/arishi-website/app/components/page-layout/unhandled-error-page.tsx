import { Button } from '@arishi/ui/components/button';
import { Link } from '@remix-run/react';
import { ContentSection } from './content-section';

export type UnhandledErrorProps = {
  title: string;
  statusCode: number;
  description: string;
};

export const UnhandledError = ({ title, statusCode, description }: UnhandledErrorProps) => {
  return (
    <ContentSection className="flex flex-col items-center justify-center">
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="text-9xl font-bold text-black">{statusCode}</p>
        <p className="mt-4 text-2xl">{title}</p>
        <p className="mt-2">{description}</p>
        <Link to="/" className="mt-4 w-full px-6 py-2" reloadDocument>
          <Button>Go Home</Button>
        </Link>
      </div>
    </ContentSection>
  );
};
