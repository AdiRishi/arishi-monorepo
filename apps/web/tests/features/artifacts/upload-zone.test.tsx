import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

import { UploadZone } from "@/features/artifacts/upload-zone";

test("choosing a CSV hands the file to the uploader", async () => {
  const uploads: File[] = [];
  const source = "date,amount\n2026-08-01,42\n";
  const file = new File([source], "transactions.csv", { type: "text/csv" });
  const screen = await render(
    <UploadZone isUploading={false} onUpload={(file) => uploads.push(file)} />,
  );

  await userEvent.upload(screen.getByLabelText("CSV file"), file);

  expect(uploads.map((file) => ({ name: file.name, type: file.type }))).toEqual([
    { name: "transactions.csv", type: "text/csv" },
  ]);
  expect(await Promise.all(uploads.map((file) => file.text()))).toEqual([source]);
});

test("an active upload disables further file selection", async () => {
  const screen = await render(<UploadZone isUploading onUpload={() => {}} />);

  await expect.element(screen.getByLabelText("CSV file")).toBeDisabled();
  await expect.element(screen.getByRole("button", { name: "Uploading" })).toBeDisabled();
});

test("an active upload ignores dropped files", async () => {
  const uploads: File[] = [];
  const screen = await render(<UploadZone isUploading onUpload={(file) => uploads.push(file)} />);
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(new File(["value\n1"], "sample.csv"));
  screen
    .getByText("Drop a CSV here")
    .element()
    .dispatchEvent(new DragEvent("drop", { bubbles: true, dataTransfer }));
  expect(uploads).toEqual([]);
});
