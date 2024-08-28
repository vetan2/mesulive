import { type ActorRefFrom } from "xstate";

import { type CurrencyUnit } from "~/entities/game";
import { type Potential } from "~/entities/potential";

import { type potentialInputMachine } from "./potentialInputMachine";

export type PotentialCalcRootContext = {
  inputActorRef: ActorRefFrom<typeof potentialInputMachine>;
  results: Map<
    Potential.ResetMethod,
    {
      probability: number;
      ceil?: number;
      prices: { value: number; unit: CurrencyUnit }[];
      matchedOptionTables: {
        table: {
          optionName: string;
        }[];
        probability: number;
      };
    }
  >;
};

export type PotentialCalcRootEvent =
  | { type: "FETCH_GRADE_UP_RECORDS" }
  | { type: "FETCH_OPTION_TABLES" }
  | { type: "RECEIVE_RESULTS"; results: PotentialCalcRootContext["results"] }
  | { type: "RESET_RESULTS" };
