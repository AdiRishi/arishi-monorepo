import { Avatar, AvatarFallback, AvatarImage } from '@arishi/ui/components/avatar';
import { Button } from '@arishi/ui/components/button';
import { GlobeIcon, PhoneIcon } from 'lucide-react';
import { RESUME_DATA } from '~/content/data';

interface LocationLinkProps {
  location: typeof RESUME_DATA.location;
  locationLink: typeof RESUME_DATA.locationLink;
}

function LocationLink({ location, locationLink }: LocationLinkProps) {
  return (
    <p className="text-foreground max-w-md items-center font-mono text-xs text-pretty">
      <a
        className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
        href={locationLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Location: ${location}`}
      >
        <GlobeIcon className="size-3" aria-hidden="true" />
        {location}
      </a>
    </p>
  );
}

interface SocialButtonProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

function SocialButton({ href, icon: Icon, label }: SocialButtonProps) {
  return (
    <Button className="size-8" variant="outline" size="icon" asChild>
      <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
        <Icon className="size-4" aria-hidden="true" />
      </a>
    </Button>
  );
}

interface ContactButtonsProps {
  contact: typeof RESUME_DATA.contact;
  personalWebsiteUrl?: string;
}

function ContactButtons({ contact, personalWebsiteUrl }: ContactButtonsProps) {
  return (
    <div
      className="text-foreground/80 flex gap-x-1 pt-1 font-mono text-sm print:hidden"
      role="list"
      aria-label="Contact links"
    >
      {personalWebsiteUrl && <SocialButton href={personalWebsiteUrl} icon={GlobeIcon} label="Personal website" />}
      {contact.tel && <SocialButton href={`tel:${contact.tel}`} icon={PhoneIcon} label="Phone" />}
      {Object.values(contact.social).map((social) => (
        <SocialButton key={social.name} href={social.url} icon={social.icon} label={social.name} />
      ))}
    </div>
  );
}

interface PrintContactProps {
  contact: typeof RESUME_DATA.contact;
  personalWebsiteUrl?: string;
}

function PrintContact({ contact, personalWebsiteUrl }: PrintContactProps) {
  return (
    <div
      className="text-foreground/80 hidden gap-x-2 font-mono text-sm print:flex print:text-[12px]"
      aria-label="Print contact information"
    >
      {personalWebsiteUrl && (
        <>
          <a className="hover:text-foreground/70 underline" href={personalWebsiteUrl}>
            {new URL(personalWebsiteUrl).hostname}
          </a>
          <span aria-hidden="true">/</span>
        </>
      )}
      {contact.email && (
        <>
          <a className="hover:text-foreground/70 underline" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <span aria-hidden="true">/</span>
        </>
      )}
      {contact.tel && (
        <a className="hover:text-foreground/70 underline" href={`tel:${contact.tel}`}>
          {contact.tel}
        </a>
      )}
    </div>
  );
}

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex-1 space-y-1.5">
        <h1 className="text-2xl font-bold" id="resume-name">
          {RESUME_DATA.name}
        </h1>
        <p
          className="text-foreground/80 max-w-md font-mono text-sm text-pretty print:text-[12px]"
          aria-labelledby="resume-name"
        >
          {RESUME_DATA.description}
        </p>

        <LocationLink location={RESUME_DATA.location} locationLink={RESUME_DATA.locationLink} />

        <ContactButtons contact={RESUME_DATA.contact} personalWebsiteUrl={RESUME_DATA.url} />

        <PrintContact contact={RESUME_DATA.contact} personalWebsiteUrl={RESUME_DATA.url} />
      </div>

      <Avatar className="size-28" aria-hidden="true">
        <AvatarImage alt={`${RESUME_DATA.name}'s profile picture`} src={RESUME_DATA.avatarUrl} />
        <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
      </Avatar>
    </header>
  );
}
