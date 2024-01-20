interface IfProps {
  condition?: unknown;
  children: React.ReactNode;
}

export function If({ condition, children }: IfProps) {
  return condition ? children : null;
}
