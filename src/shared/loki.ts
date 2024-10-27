import { E, TE } from "./fp";

/**
 * Loki labels
 */
type LokiLabels = {
  [key in string]: string;
} & {
  environment?: never;
  service?: never;
  level?: never;
};

const createLogger = (logLevel: string) =>
  TE.tryCatchK(
    async (
      streams: {
        message: object;
        labels: LokiLabels;
      }[],
    ) => {
      await fetch(`https://${process.env.LOKI_HOST}/loki/api/v1/push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(
            `${process.env.LOKI_USER}:${process.env.LOKI_TOKEN}`,
          )}`,
        },
        body: JSON.stringify({
          streams: streams.map(({ message, labels }) => ({
            stream: {
              level: logLevel,
              environment: process.env.LOKI_ENVIRONMENT,
              service: "mesulive",
              ...labels,
            },
            values: [
              [`${Date.now().toString()}000000`, JSON.stringify(message)],
            ],
          })),
        }),
      })
        .then((r) => {
          if (!r.ok) {
            throw new Error(r.statusText);
          }
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error("Error:", e);
        });
    },
    E.toError,
  );

const lokiLoggerSingleton = () => {
  return {
    info: createLogger("info"),
    error: createLogger("error"),
    debug: createLogger("debug"),
    warn: createLogger("warn"),
  };
};

declare const globalThis: {
  lokiLoggerGlobal: ReturnType<typeof lokiLoggerSingleton>;
} & typeof global;

export const lokiLogger = globalThis.lokiLoggerGlobal ?? lokiLoggerSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.lokiLoggerGlobal = lokiLogger;
}
