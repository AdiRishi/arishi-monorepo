import type { ArtifactId, ArtifactSummary } from "@repo/contracts/artifacts";
import { FileSpreadsheetIcon, InboxIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { StatusBadge } from "./status-badge";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );

export function RecentProfiles({
  artifacts,
  onSelect,
  selectedId,
}: {
  readonly artifacts: ReadonlyArray<ArtifactSummary>;
  readonly onSelect: (artifactId: ArtifactId) => void;
  readonly selectedId: ArtifactId | undefined;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-3" aria-labelledby="recent-profiles-heading">
      <h2 id="recent-profiles-heading" className="text-base font-semibold">
        Recent profiles
      </h2>
      {artifacts.length === 0 ? (
        <Empty className="min-h-52 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>No profiles yet</EmptyTitle>
            <EmptyDescription>Your first upload will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-1">
          {artifacts.map((artifact) => (
            <Button
              key={artifact.id}
              className="h-auto w-full justify-start px-3 py-3"
              variant={artifact.id === selectedId ? "outline" : "ghost"}
              onClick={() => onSelect(artifact.id)}
            >
              <FileSpreadsheetIcon data-icon="inline-start" />
              <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
                <span className="max-w-full truncate font-medium">{artifact.fileName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(artifact.createdAt)}
                </span>
              </span>
              <StatusBadge status={artifact.status} />
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}
