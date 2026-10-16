import { AppRequestError } from "@repo/contracts/app";
import type { ArtifactId } from "@repo/contracts/artifacts";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ProfileDetail } from "./profile-detail";
import { artifactQueryOptions, artifactsQueryKey, artifactsQueryOptions } from "./queries";
import { RecentProfiles } from "./recent-profiles";
import { uploadArtifact } from "./upload";
import { UploadZone } from "./upload-zone";

function SelectedProfile({ artifactId }: { readonly artifactId: ArtifactId | undefined }) {
  if (artifactId === undefined) return <ProfileDetail artifact={undefined} />;
  return <ArtifactProfile artifactId={artifactId} />;
}

function ArtifactProfile({ artifactId }: { readonly artifactId: ArtifactId }) {
  const detail = useQuery(artifactQueryOptions(artifactId));
  if (detail.isPending) return <output>Loading profile…</output>;
  if (detail.isError)
    return (
      <Alert variant="destructive">
        <AlertTitle>
          {detail.error instanceof AppRequestError && detail.error.code === "not_found"
            ? "Profile not found"
            : "Could not load profile"}
        </AlertTitle>
        <AlertDescription>{detail.error.message}</AlertDescription>
      </Alert>
    );
  return <ProfileDetail artifact={detail.data} />;
}

export function CsvProfilerPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<ArtifactId>();
  const artifacts = useSuspenseQuery(artifactsQueryOptions());
  const activeId = selectedId ?? artifacts.data[0]?.id;
  const upload = useMutation({
    mutationFn: uploadArtifact,
    onSuccess: async (artifact) => {
      setSelectedId(artifact.id);
      await queryClient.invalidateQueries({ queryKey: artifactsQueryKey });
    },
  });

  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center px-5 sm:px-8">
          <span className="text-base font-semibold tracking-tight">CSV Profile</span>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14">
        <section className="flex max-w-2xl flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Inspect a CSV</h1>
          <p className="text-base text-muted-foreground">
            Upload a CSV to inspect its shape, quality, and inferred column types.
          </p>
        </section>

        <UploadZone isUploading={upload.isPending} onUpload={(file) => upload.mutate(file)} />

        {upload.error ? (
          <Alert variant="destructive">
            <AlertTitle>Upload failed</AlertTitle>
            <AlertDescription>{upload.error.message}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid min-w-0 gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <RecentProfiles
            artifacts={artifacts.data}
            selectedId={activeId}
            onSelect={setSelectedId}
          />
          <SelectedProfile artifactId={activeId} />
        </div>
      </main>
    </>
  );
}
