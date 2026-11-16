import { createAgent, registerTools } from "@ui-sdk/react/agent";

declare global {
  interface Window {
    agent?: ReturnType<typeof createAgent>;
  }
}

export function connectAgents(): () => void {
  const agent = createAgent();
  if (import.meta.env.DEV) window.agent = agent;
  // Nothing on the site needs a person, so the browser's agent may run any step except one
  // on a control marked with data-agent-confirm.
  return registerTools(agent, { allow: (step) => !step.confirm });
}
