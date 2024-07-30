import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useRef } from "react";

import { bonusStatCalcAtoms } from "~/app/(app)/calc/bonus-stat/_lib/atoms";
import { O } from "~/shared/fp";

export const useCalcResult = () => {
  const workerRef = useRef<Worker>();
  const [result, setResult] = useAtom(bonusStatCalcAtoms.calcResult);
  const [resultState, setResultState] = useAtom(bonusStatCalcAtoms.resultState);
  const inputs = useAtomValue(bonusStatCalcAtoms.calcInput);

  const initWorker = useCallback(() => {
    workerRef.current = new Worker(
      new URL(
        "~/app/(app)/calc/bonus-stat/_lib/workers/getMethodProbRecord.ts",
        import.meta.url,
      ),
    );
    workerRef.current.onmessage = (event) => {
      setResult(event.data);
      setResultState("success");
    };
  }, [setResult, setResultState]);

  const startWorker = useCallback(() => {
    if (O.isSome(inputs)) {
      initWorker();
      setResultState("pending");
      workerRef.current?.postMessage(inputs.value);
    } else {
      setResultState("idle");
    }
  }, [initWorker, inputs, setResultState]);

  const terminateWorker = useCallback(() => {
    workerRef.current?.terminate();
    setResultState("idle");
  }, [setResultState]);

  useEffect(() => {
    initWorker();
  }, [initWorker]);

  useEffect(() => {
    startWorker();
    return () => {
      terminateWorker();
    };
  }, [startWorker, terminateWorker]);

  return { result, state: resultState };
};
