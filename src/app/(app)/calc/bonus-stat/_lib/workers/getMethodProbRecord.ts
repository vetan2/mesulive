import {
  getMethodProbRecord,
  getMethodProbRecordParamSchema,
  type GetMethodProbRecord,
} from "~/app/(app)/calc/bonus-stat/_lib/logic";

addEventListener(
  "message",
  (event: MessageEvent<Parameters<GetMethodProbRecord>[0]>) => {
    const inputs = getMethodProbRecordParamSchema.safeParse(event.data);

    if (inputs.success) {
      postMessage(getMethodProbRecord(inputs.data));
    } else {
      // eslint-disable-next-line no-console
      console.error(inputs.error.errors);
    }
  },
);
