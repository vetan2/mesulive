"use client";

import { createBrowserInspector } from "@statelyai/inspect";
import { createActorContext } from "@xstate/react";
import { useEffect, type PropsWithChildren } from "react";

import { potentialCalcRootMachine } from "./potentialCalcRootMachine";

const inspector = createBrowserInspector({ autoStart: false });

export const PotentialCalcRootMachineContext = createActorContext(
  potentialCalcRootMachine,
  { inspect: inspector.inspect },
);

export const PotentialCalcRootMachineProvider = ({
  children,
}: PropsWithChildren) => {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      inspector.adapter["status"] === "disconnected"
    ) {
      // inspector.start();
    }
  }, []);

  return (
    <PotentialCalcRootMachineContext.Provider>
      {children}
    </PotentialCalcRootMachineContext.Provider>
  );
};
