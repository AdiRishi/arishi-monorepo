import { createAgent, registerTools } from "@ui-sdk/react/agent";

declare global {
  interface Window {
    agent?: ReturnType<typeof createAgent>;
  }
}

/**
 * Lets agents read and use the page's ui-sdk components: a browser's own agent through WebMCP,
 * and, in development, a coding agent through `window.agent` in the page.
 */
export function connectAgents(): () => void {
  const agent = createAgent();
  if (import.meta.env.DEV) window.agent = agent;
  // Nothing on the site needs a person's confirmation, so every step the browser's agent asks
  // for may run. A control marked with data-agent-confirm would still be refused.
  return registerTools(agent, { allow: (step) => !step.confirm });
}
