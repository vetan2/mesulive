"use client";

import { createBrowserInspector } from "@statelyai/inspect";
import { createActorContext } from "@xstate/react";
import { type PropsWithChildren } from "react";

import { potentialCalcRootMachine } from "./potentialCalcRootMachine";

const inspector = createBrowserInspector({ autoStart: false });

export const PotentialCalcRootMachineContext = createActorContext(
  potentialCalcRootMachine,
  { inspect: inspector.inspect },
);

export const PotentialCalcRootMachineProvider = ({
  children,
}: PropsWithChildren) => {
  return (
    <PotentialCalcRootMachineContext.Provider>
      {children}
    </PotentialCalcRootMachineContext.Provider>
  );
};
