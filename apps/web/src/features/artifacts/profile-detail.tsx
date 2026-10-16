import type { ArtifactDetail, ColumnProfile } from "@repo/contracts/artifacts";
import { AlertTriangleIcon, DownloadIcon, FileSpreadsheetIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const integer = new Intl.NumberFormat();

const columnRange = (column: ColumnProfile) => {
  switch (column.kind) {
    case "number":
    case "date":
      return { maximum: String(column.maximum), minimum: String(column.minimum) };
    case "boolean":
      return {
        maximum: `${column.trueValues} true`,
        minimum: `${column.falseValues} false`,
      };
    case "empty":
    case "string":
      return { maximum: "—", minimum: "—" };
  }
};

function ProcessingDetail({ artifact }: { readonly artifact: ArtifactDetail }) {
  if (artifact.status !== "queued" && artifact.status !== "processing") return null;
  const value =
    artifact.status === "processing" && artifact.totalRows > 0
      ? Math.round((artifact.rowsProcessed / artifact.totalRows) * 100)
      : 0;

  return (
    <div className="flex min-h-72 flex-col justify-center gap-4 border px-6 py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{artifact.fileName}</h2>
        <p className="text-sm text-muted-foreground">
          {artifact.status === "queued"
            ? "Waiting for the processor."
            : "Inspecting rows and inferring columns."}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{artifact.status === "queued" ? "Queued" : "Profiling"}</span>
        <span className="text-muted-foreground tabular-nums">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

export function ProfileDetail({ artifact }: { readonly artifact: ArtifactDetail | undefined }) {
  if (artifact === undefined) {
    return (
      <div className="flex min-h-72 items-center justify-center border px-6 text-sm text-muted-foreground">
        Select a profile to inspect it.
      </div>
    );
  }
  if (artifact.status === "queued" || artifact.status === "processing") {
    return <ProcessingDetail artifact={artifact} />;
  }
  if (artifact.status === "failed") {
    return (
      <Alert variant="destructive">
        <AlertTriangleIcon />
        <AlertTitle>Profiling failed</AlertTitle>
        <AlertDescription>{artifact.error}</AlertDescription>
      </Alert>
    );
  }

  const profile = artifact.profile;
  return (
    <section className="min-w-0 border" aria-labelledby="profile-heading">
      <header className="flex flex-wrap items-center gap-4 border-b px-4 py-3">
        <FileSpreadsheetIcon className="size-5" aria-hidden="true" />
        <h2 id="profile-heading" className="mr-auto min-w-0 truncate text-base font-semibold">
          {artifact.fileName}
        </h2>
        <Badge>{integer.format(profile.rowCount)} rows</Badge>
        <Badge variant="outline">{integer.format(profile.columns.length)} columns</Badge>
        {profile.malformedRows > 0 ? (
          <Badge variant="destructive">{integer.format(profile.malformedRows)} malformed</Badge>
        ) : null}
        <a
          className={buttonVariants({ size: "sm", variant: "outline" })}
          href={`/artifacts/${artifact.id}/source`}
        >
          <DownloadIcon data-icon="inline-start" />
          Download
        </a>
      </header>

      <div className="flex flex-col gap-7 px-4 py-5">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Column profile</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Non-empty</TableHead>
                <TableHead>Empty</TableHead>
                <TableHead>Minimum</TableHead>
                <TableHead>Maximum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profile.columns.map((column) => {
                const range = columnRange(column);
                return (
                  <TableRow key={column.name}>
                    <TableCell className="font-mono font-medium">{column.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{column.kind}</Badge>
                    </TableCell>
                    <TableCell>{integer.format(column.nonEmptyValues)}</TableCell>
                    <TableCell>{integer.format(column.emptyValues)}</TableCell>
                    <TableCell className="font-mono">{range.minimum}</TableCell>
                    <TableCell className="font-mono">{range.maximum}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Row preview</h3>
          <Table>
            <TableHeader>
              <TableRow>
                {profile.columns.map((column) => (
                  <TableHead key={column.name} className="font-mono">
                    {column.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {profile.preview.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((value, columnIndex) => (
                    <TableCell
                      key={`${rowIndex}-${columnIndex}`}
                      className="max-w-72 truncate font-mono"
                    >
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="truncate font-mono text-xs text-muted-foreground">SHA-256 {profile.sha256}</p>
      </div>
    </section>
  );
}
