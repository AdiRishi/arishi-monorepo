import type { ProcessingState } from "@repo/contracts/artifacts";
import type { ProcessorEnv } from "@repo/infra/worker-bindings";
import { DurableObject } from "cloudflare:workers";

/** How far one artifact's profile has got. Progress never moves backward, so a redelivered job resumes where the last attempt reached. */
export class CsvProfileSession extends DurableObject<ProcessorEnv> {
  constructor(ctx: DurableObjectState, env: ProcessorEnv) {
    super(ctx, env);
    ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS profile_progress (
      singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
      rows_processed INTEGER NOT NULL,
      total_rows INTEGER NOT NULL
    )`);
  }

  getState() {
    const row = this.ctx.storage.sql
      .exec<{ rows_processed: number; total_rows: number }>(
        "SELECT rows_processed, total_rows FROM profile_progress WHERE singleton = 1",
      )
      .toArray()[0];
    return {
      state:
        row === undefined
          ? { kind: "queued" }
          : { kind: "processing", rowsProcessed: row.rows_processed, totalRows: row.total_rows },
    } satisfies { readonly state: ProcessingState };
  }

  progress(rowsProcessed: number, totalRows: number): void {
    this.ctx.storage.sql.exec(
      `INSERT INTO profile_progress VALUES (1, ?, ?)
      ON CONFLICT (singleton) DO UPDATE SET rows_processed = MAX(rows_processed, excluded.rows_processed), total_rows = excluded.total_rows`,
      rowsProcessed,
      totalRows,
    );
  }
}
