import { ArtifactDetail } from "@repo/contracts/artifacts";
import { Schema } from "effect";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { ProfileDetail } from "@/features/artifacts/profile-detail";

test("a completed profile exposes the result and source download", async () => {
  const artifact = Schema.decodeSync(ArtifactDetail)({
    byteSize: 42,
    completedAt: "2026-08-22T00:00:01.000Z",
    contentType: "text/csv",
    createdAt: "2026-08-22T00:00:00.000Z",
    fileName: "transactions.csv",
    id: "28f31da1-a2ed-4f1f-a9d9-463107ad09f0",
    profile: {
      columns: [
        {
          emptyValues: 0,
          kind: "number",
          maximum: 42,
          minimum: -4,
          name: "amount",
          nonEmptyValues: 2,
        },
      ],
      malformedRows: 0,
      preview: [["-4"], ["42"]],
      rowCount: 2,
      sha256: "a".repeat(64),
    },
    status: "complete",
  });

  const screen = await render(<ProfileDetail artifact={artifact} />);

  await expect.element(screen.getByRole("heading", { name: "transactions.csv" })).toBeVisible();
  await expect
    .element(screen.getByRole("link", { name: /download/i }))
    .toHaveAttribute("href", "/artifacts/28f31da1-a2ed-4f1f-a9d9-463107ad09f0/source");
  expect(screen.getByText("amount").all()).toHaveLength(2);
  expect(screen.getByText("-4").all()).toHaveLength(2);
});
