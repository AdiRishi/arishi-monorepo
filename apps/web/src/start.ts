import { appRequestErrorSerialization } from "@repo/contracts/app";
import { createSerializationAdapter } from "@tanstack/react-router";
import { createCsrfMiddleware, createStart } from "@tanstack/react-start";

const csrfMiddleware = createCsrfMiddleware({
  filter: (context) => context.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware],
  serializationAdapters: [createSerializationAdapter(appRequestErrorSerialization)],
}));
