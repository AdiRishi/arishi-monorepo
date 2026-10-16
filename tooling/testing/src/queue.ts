import { WorkerEntrypoint } from "cloudflare:workers";

/*
 * Stands in for a queue another Worker consumes. The producer under test
 * calls `send` and `sendBatch` on it as on a Queue binding; tests read what
 * was sent in order, or make the queue refuse sends as Cloudflare does
 * during an outage. Offered messages include the refused ones, so a test can
 * tell a send that failed from one that has not happened yet.
 */

/** A message as producers send it: a value Schema has already encoded. */
export type Encoded =
  | string
  | number
  | boolean
  | null
  | ReadonlyArray<Encoded>
  | { readonly [field: string]: Encoded };

let offered: Array<Encoded> = [];
let sent: Array<Encoded> = [];
let accepting = true;

export const queuedMessages = (): ReadonlyArray<Encoded> => sent;

export const offeredMessages = (): ReadonlyArray<Encoded> => offered;

export const setQueueAccepting = (next: boolean) => {
  accepting = next;
};

export const resetQueue = () => {
  offered = [];
  sent = [];
  accepting = true;
};

export class RecordedQueue extends WorkerEntrypoint {
  send(body: Encoded): void {
    offered.push(body);
    if (!accepting) throw new Error("The queue refused the message.");
    sent.push(body);
  }

  sendBatch(messages: ReadonlyArray<{ readonly body: Encoded }>): void {
    offered.push(...messages.map((message) => message.body));
    if (!accepting) throw new Error("The queue refused the batch.");
    sent.push(...messages.map((message) => message.body));
  }
}
