import { useCallback, useEffect, useRef, useState } from "react";

export const useWorker = <I>(worker: Worker) => {
  const workerRef = useRef<Worker>(worker);
  const [status, setStatus] = useState<"idle" | "pending">("idle");

  const terminate = useCallback(() => {
    console.log("terminateWorker");
    workerRef.current.terminate();
    setStatus("idle");
  }, []);

  const start = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (input: I, options?: { onDone?: (result: any) => void }) => {
      console.log("startWorker", workerRef.current);
      if (!workerRef.current) {
        return;
      }

      setStatus("pending");
      workerRef.current.onmessage = (event) => {
        options?.onDone?.(event.data);
        setStatus("idle");
      };
      workerRef.current.postMessage(input);
    },
    [],
  );

  useEffect(() => {
    return () => {
      terminate();
    };
  }, [terminate]);

  return { start, terminate, status };
};
