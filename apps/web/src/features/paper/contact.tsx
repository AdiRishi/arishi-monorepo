import { Button } from "@ui-sdk/react/button";
import { toast } from "@ui-sdk/react/toast";

import { email, profiles } from "./content";

const row =
  "col-span-full grid grid-cols-subgrid items-baseline gap-y-1 border-b border-line py-[18px]";
const name = "text-[clamp(1.3rem,2.2vw,1.8rem)] leading-[1.1] tracking-[-0.01em]";
const handle = "font-light wrap-anywhere text-mute xs:text-right";

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
    <ul className="grid grid-cols-1 gap-x-5 border-t border-line xs:grid-cols-[minmax(0,1fr)_auto_auto]">
      {profiles.map((profile) => (
        <li key={profile.name} className={row}>
          <a
            href={profile.href}
            target="_blank"
            rel="noopener"
            className="group col-span-2 grid grid-cols-subgrid items-baseline gap-y-1"
          >
            <span className={`${name} group-hover:text-accent`}>{profile.name}</span>
            <span className={handle}>{profile.handle}</span>
          </a>
        </li>
      ))}
      <li className={row}>
        <a
          href={`mailto:${email}`}
          className="group col-span-2 grid grid-cols-subgrid items-baseline gap-y-1"
        >
          <span className={`${name} group-hover:text-accent`}>Email</span>
          <span className={handle}>{email}</span>
        </a>
        <Button
          aria-label="Copy email address"
          onClick={copyEmail}
          className="justify-self-start py-1 font-mono text-label tracking-label text-mute uppercase hover:text-accent data-pending:cursor-progress xs:justify-self-end"
        >
          Copy
        </Button>
      </li>
    </ul>
  );
}
