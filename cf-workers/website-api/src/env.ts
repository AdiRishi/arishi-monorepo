// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Env = {};

export interface LocalExportedHandler<Env> {
  fetch: ExportedHandlerFetchHandler<Env>;
}
