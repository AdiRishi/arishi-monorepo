import {
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@ui-sdk/react/timeline";

import { employers } from "./content";
import { account, inlineLink, ledgerRow, meta } from "./section";

export function WorkHistory() {
  return (
    <Timeline aria-label="Work history" className="border-t border-line">
      {employers.map(({ company, href, dateTime, when, story, roles }) => (
        <TimelineItem key={company} className={ledgerRow}>
          <div>
            <TimelineTitle
              render={({ children, ...props }) => <h3 {...props}>{children}</h3>}
              className="text-title"
            >
              <a href={href} target="_blank" rel="noopener" className={inlineLink}>
                {company}
              </a>
            </TimelineTitle>
            <p className={`${meta} mt-1.5`}>
              <TimelineTime dateTime={dateTime}>{when}</TimelineTime>
            </p>
            <ol className="mt-4 space-y-2.5">
              {roles.map((role) => (
                <li key={role.title} className="text-note leading-[1.35] text-balance">
                  {role.title}
                  {roles.length > 1 && <span className={`${meta} block`}>{role.when}</span>}
                </li>
              ))}
            </ol>
          </div>
          <TimelineDescription className={account}>{story}</TimelineDescription>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
