import { Button } from "@ui-sdk/react/button";
import { toast } from "@ui-sdk/react/toast";

import { email, profiles } from "./content";
import { label } from "./section";

const row = "flex items-baseline justify-between gap-x-6 border-b border-line";
const value = "text-title wrap-anywhere transition-colors group-hover:text-accent";

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email);
    toast.success("Email address copied", { id: "copy-email", description: email });
  } catch {
    toast.error("Couldn't copy the address", {
      id: "copy-email",
      description: `Write to ${email}.`,
    });
  }
}

export function ContactList() {
  return (
    <ul className="max-w-[680px] border-t border-line">
      <li className={row}>
        <a
          href={`mailto:${email}`}
          aria-label={`Email ${email}`}
          className={`group flex-1 py-4 ${value}`}
        >
          {email}
        </a>
        <span className={`${label} flex items-baseline gap-4`}>
          <span className="hidden xs:inline">Email</span>
          <Button
            aria-label="Copy email address"
            onClick={copyEmail}
            className="-mr-2 px-2 py-2 text-ink uppercase transition-colors hover:text-accent data-pending:cursor-progress"
          >
            Copy
          </Button>
        </span>
      </li>
      {profiles.map((profile) => (
        <li key={profile.name}>
          <a href={profile.href} target="_blank" rel="noopener" className={`group py-4 ${row}`}>
            <span className={value}>{profile.handle}</span>
            <span
              className={`${label} whitespace-nowrap transition-colors group-hover:text-accent`}
            >
              {profile.name} ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
