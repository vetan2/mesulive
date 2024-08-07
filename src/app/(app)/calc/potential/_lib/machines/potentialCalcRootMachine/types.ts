import { type ActorRefFrom } from "xstate";

import { type potentialInputMachine } from "~/app/(app)/calc/potential/_lib/machines/potentialInputMachine";
import { type CurrencyUnit } from "~/entities/game";
import { type Potential } from "~/entities/potential";

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
