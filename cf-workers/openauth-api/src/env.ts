export type Env = {
  OPENAUTH_KV_STORAGE: KVNamespace;
};

export interface LocalExportedHandler<Env> {
  fetch: ExportedHandlerFetchHandler<Env>;
}
