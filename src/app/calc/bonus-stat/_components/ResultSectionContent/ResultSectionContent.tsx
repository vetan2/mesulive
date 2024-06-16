"use client";

import { AnimatePresence, m } from "framer-motion";
import { match } from "ts-pattern";

import { useCalcResult } from "~/app/calc/bonus-stat/_lib/hooks";
import { BonusStat } from "~/entities/bonus-stat";
import { S } from "~/shared/ui";

import { ResultRow } from "./ResultRow";

export const ResultSectionContent = () => {
  const { result, state } = useCalcResult();

  return (
    <div className="relative flex flex-col">
      {BonusStat.resetMethodSchema.options.map((method) => (
        <ResultRow
          key={method}
          method={method}
          prob={match({ state, method })
            .with({ method: "ABYSS" }, () => undefined)
            .with({ state: "success" }, () => result?.[method] ?? 0)
            .otherwise(() => undefined)}
        />
      ))}
      <AnimatePresence>
        {state === "pending" && (
          <m.div
            className="absolute inset-0 flex h-full w-full items-center justify-center bg-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <S.CircularProgress
              classNames={{ svg: "w-20 h-20" }}
              aria-label="Loading..."
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
