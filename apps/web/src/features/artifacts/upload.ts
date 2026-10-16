import { ApiError, ArtifactSummary, CsvUpload } from "@repo/contracts/artifacts";
import { Schema } from "effect";

export const uploadArtifact = async (file: File) => {
  const data = new FormData();
  data.set("file", Schema.decodeSync(CsvUpload)(file));
  const response = await fetch("/api/artifacts", { method: "POST", body: data });
  const body: unknown = await response.json();
  if (!response.ok) throw new Error(Schema.decodeUnknownSync(ApiError)(body).message);
  return Schema.decodeUnknownSync(ArtifactSummary)(body);
};
