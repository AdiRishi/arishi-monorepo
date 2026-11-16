import {
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@ui-sdk/react/timeline";

import { employers } from "./content";
import { inlineLink, ledgerRow, meta } from "./section";

export function WorkHistory() {
  return (
    <Timeline aria-label="Work history" className="border-t border-line">
      {employers.map((employer) => (
        <TimelineItem key={employer.company} className={ledgerRow}>
          <div>
            <TimelineTitle
              render={({ children, ...props }) => <h3 {...props}>{children}</h3>}
              className="text-title"
            >
              <a href={employer.href} target="_blank" rel="noopener" className={inlineLink}>
                {employer.company}
              </a>
            </TimelineTitle>
            <p className={`${meta} mt-1.5`}>
              <TimelineTime dateTime={employer.dateTime}>{employer.when}</TimelineTime>
              {" · "}
              {employer.where}
            </p>
          </div>
          <TimelineDescription className="max-w-[60ch] lg:row-span-2">
            {employer.story}
          </TimelineDescription>
          <ol className="space-y-2.5 lg:mt-2">
            {employer.roles.map((role) => (
              <li key={role.title} className="text-note leading-[1.35]">
                {role.title}
                <span className={`${meta} block`}>{role.when}</span>
              </li>
            ))}
          </ol>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
