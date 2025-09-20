import { GlobeIcon, MailIcon, PhoneIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { RESUME_DATA } from "@/content/resume-data";
import type { ResumeData } from "@/content/resume-type";

type Contact = ResumeData["contact"];

function LocationLink({
  location,
  locationLink,
}: {
  location: string;
  locationLink: string;
}) {
  return (
    <p className="max-w-md items-center text-pretty font-mono text-sm text-foreground/80 print:text-[12px]">
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

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button className="size-8" variant="outline" size="icon" asChild={true}>
      <a
        href={href}
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    </Button>
  );
}

function ContactButtons({
  contact,
  personalUrl,
}: {
  contact: Contact;
  personalUrl?: string;
}) {
  const socials = Object.values(contact.social ?? {});

  return (
    <ul
      className="flex list-none gap-x-1 pt-1 font-mono text-sm text-foreground/80 print:hidden"
      aria-label="Contact links"
    >
      {personalUrl && (
        <li>
          <SocialButton href={personalUrl} label="Personal website">
            <Icons.globe className="size-4" aria-hidden="true" />
          </SocialButton>
        </li>
      )}
      {contact.email && (
        <li>
          <SocialButton href={`mailto:${contact.email}`} label="Email">
            <MailIcon className="size-4" aria-hidden="true" />
          </SocialButton>
        </li>
      )}
      {contact.tel && (
        <li>
          <SocialButton href={`tel:${contact.tel}`} label="Phone">
            <PhoneIcon className="size-4" aria-hidden="true" />
          </SocialButton>
        </li>
      )}
      {socials.map((social) => (
        <li key={social.name}>
          <SocialButton href={social.url} label={social.name}>
            <social.icon className="size-4" aria-hidden="true" />
          </SocialButton>
        </li>
      ))}
    </ul>
  );
}

function PrintContact({
  contact,
  personalUrl,
}: {
  contact: Contact;
  personalUrl?: string;
}) {
  return (
    <div className="hidden gap-x-2 font-mono text-sm text-foreground/80 print:flex print:text-[12px]">
      {personalUrl && (
        <>
          <a className="underline hover:text-foreground/70" href={personalUrl}>
            {new URL(personalUrl).hostname}
          </a>
          <span aria-hidden="true">/</span>
        </>
      )}
      {contact.email && (
        <>
          <a
            className="underline hover:text-foreground/70"
            href={`mailto:${contact.email}`}
          >
            {contact.email}
          </a>
          <span aria-hidden="true">/</span>
        </>
      )}
      {contact.tel && (
        <a
          className="underline hover:text-foreground/70"
          href={`tel:${contact.tel}`}
        >
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
        <p className="max-w-md text-pretty font-mono text-sm text-foreground/80 print:text-[12px]">
          {RESUME_DATA.description}
        </p>

        <LocationLink
          location={RESUME_DATA.location}
          locationLink={RESUME_DATA.locationLink}
        />

        <ContactButtons
          contact={RESUME_DATA.contact}
          personalUrl={RESUME_DATA.url}
        />

        <PrintContact
          contact={RESUME_DATA.contact}
          personalUrl={RESUME_DATA.url}
        />
      </div>

      <Avatar className="size-28">
        <AvatarImage
          src={RESUME_DATA.avatarUrl}
          alt={`${RESUME_DATA.name}'s profile picture`}
        />
        <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
      </Avatar>
    </header>
  );
}
