export type Env = {};

export interface LocalExportedHandler<Env> {
  fetch: ExportedHandlerFetchHandler<Env>;
}
