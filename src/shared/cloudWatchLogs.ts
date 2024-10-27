import "server-only";
import {
  CloudWatchLogsClient,
  PutLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { flow } from "fp-ts/lib/function";

import { E, TE } from "./fp";

const cloudWatchLogsSingleton = () => {
  return new CloudWatchLogsClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
};

declare const globalThis: {
  cloudWatchLogsGlobal: ReturnType<typeof cloudWatchLogsSingleton>;
} & typeof global;

export const cloudWatchLogs =
  globalThis.cloudWatchLogsGlobal ?? cloudWatchLogsSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.cloudWatchLogsGlobal = cloudWatchLogs;
}

export const sendLog = flow(
  TE.tryCatchK(async <T = unknown>(message: T) => {
    const logGroupName = "mesulive";

    // 로그 이벤트 전송
    await cloudWatchLogs.send(
      new PutLogEventsCommand({
        logEvents: [
          {
            message: JSON.stringify(message),
            timestamp: new Date().getTime(),
          },
        ],
        logGroupName,
        logStreamName: process.env.AWS_CLOUDWATCH_LOGS_STREAM,
      }),
    );
  }, E.toError),
  // eslint-disable-next-line no-console
  TE.orElse((e) => TE.fromIO(() => console.error(e))),
  TE.toUnion,
);

export const sendTRPCLog = sendLog<{ path: string; input: unknown }>;
