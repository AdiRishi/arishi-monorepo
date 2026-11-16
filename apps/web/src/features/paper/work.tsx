import {
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@ui-sdk/react/timeline";

import { roles } from "./content";

export function WorkHistory() {
  return (
    <Timeline aria-label="Work history" className="border-t border-line">
      {roles.map((role) => (
        <TimelineItem
          key={`${role.company} ${role.dateTime}`}
          className="grid grid-cols-1 gap-2 border-b border-line py-[30px] sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6"
        >
          <p className="pt-1.5 font-mono text-[11.5px] leading-[1.9] tracking-[0.14em] text-mute uppercase tabular-nums">
            <TimelineTime dateTime={role.dateTime} className="block font-medium text-ink">
              {role.when}
            </TimelineTime>
            {role.where}
          </p>
          <div>
            <TimelineTitle
              render={({ children, ...props }) => <h3 {...props}>{children}</h3>}
              className="text-[clamp(1.4rem,2.3vw,1.9rem)] leading-[1.15] font-normal tracking-[-0.01em]"
            >
              {role.title}{" "}
              <span className="font-light text-mute italic">
                at{" "}
                <a href={role.companyHref} target="_blank" rel="noopener">
                  {role.company}
                </a>
              </span>
            </TimelineTitle>
            <TimelineDescription className="mt-2.5 max-w-[60ch] text-[1.05rem] font-light">
              {role.description}
            </TimelineDescription>
            <ul className="mt-3.5 flex flex-wrap gap-x-[18px] gap-y-2 font-mono text-label tracking-[0.14em] text-mute uppercase">
              {role.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
