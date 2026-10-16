import type { ArtifactSummary } from "@repo/contracts/artifacts";

import { Badge } from "@/components/ui/badge";

type Status = ArtifactSummary["status"];

export function StatusBadge({ status }: { readonly status: Status }) {
  switch (status) {
    case "queued":
      return <Badge variant="outline">Queued</Badge>;
    case "processing":
      return <Badge variant="secondary">Profiling</Badge>;
    case "complete":
      return <Badge>Complete</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
  }
}
