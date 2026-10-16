import { uploadLimitLabel } from "@repo/contracts/artifacts";
import { useHydrated } from "@tanstack/react-router";
import { UploadIcon } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function UploadZone({
  isUploading,
  onUpload,
}: {
  readonly isUploading: boolean;
  readonly onUpload: (file: File) => void;
}) {
  const hydrated = useHydrated();
  const disabled = isUploading || !hydrated;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const receiveDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = event.dataTransfer.files.item(0);
    if (file !== null) onUpload(file);
  };

  return (
    <FieldGroup>
      <Field>
        <FieldLabel className="sr-only" htmlFor="csv-file">
          CSV file
        </FieldLabel>
        <input
          ref={inputRef}
          className="sr-only"
          id="csv-file"
          type="file"
          accept=".csv,text/csv"
          disabled={disabled}
          onChange={(event) => {
            const file = event.currentTarget.files?.item(0);
            if (file !== null && file !== undefined) onUpload(file);
            event.currentTarget.value = "";
          }}
        />
        <div
          className={cn(
            "flex min-h-72 flex-col items-center justify-center gap-4 rounded-lg border border-dashed px-6 py-12 transition-colors",
            isDragging ? "border-primary bg-accent" : "bg-background",
          )}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={receiveDrop}
        >
          <UploadIcon className="size-9 text-primary" aria-hidden="true" />
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-lg font-semibold">Drop a CSV here</p>
            <p className="text-sm text-muted-foreground">or choose a file</p>
          </div>
          <Button type="button" disabled={disabled} onClick={() => inputRef.current?.click()}>
            {isUploading ? (
              <>
                <Spinner data-icon="inline-start" aria-hidden="true" />
                Uploading
              </>
            ) : (
              "Choose CSV"
            )}
          </Button>
          <FieldDescription>CSV up to {uploadLimitLabel}</FieldDescription>
        </div>
      </Field>
    </FieldGroup>
  );
}
