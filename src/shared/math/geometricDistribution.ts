import { option } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { P, match } from "ts-pattern";

import { O } from "~/shared/fp";

export const mean = (prob: number) =>
  pipe(
    prob,
    O.fromPredicate((v) => v > 0 && v <= 1),
    O.map((v) => 1 / v),
    O.toUndefined,
  );

export const getCostFromTopPct =
  (prob: number) =>
  (topPct: number): number | undefined =>
    pipe(
      { prob, topPct },
      O.some,
      O.filter(({ prob }) => prob > 0 && prob <= 1),
      O.filter(({ topPct }) => topPct > 0 && topPct < 100),
      O.map(
        ({ prob, topPct }) => Math.log(1 - topPct / 100) / Math.log(1 - prob),
      ),
      O.getOrElseW(() => undefined),
    );

export const getTopPctFromCost =
  (prob: number) =>
  (cost: number): number | undefined =>
    pipe(
      { prob, cost },
      O.some,
      O.filter(({ prob }) => prob > 0 && prob <= 1),
      O.filter(({ cost }) => cost > 0),
      O.map(({ prob, cost }) => (1 - (1 - prob) ** cost) * 100),
      O.getOrElseW(() => undefined),
    );

export class TopPctCost {
  private params:
    | {
        type: "Bernoulli";
        probability: number;
        ceil?: number;
      }
    | { type: "data"; samples: number[] };
  // type: "data"
  private sortedData: number[];

  // type: "Bernoulli", ceil != null
  private probabilities: number[] = [];
  private cumulativeProbabilities: number[] = [];

  public meanCost: number | undefined;
  public meanTopPct: number | undefined;

  constructor(
    params:
      | { type: "Bernoulli"; probability: number; ceil?: number }
      | { type: "data"; samples: number[] },
  ) {
    this.params = params;
    this.sortedData =
      params.type === "data" ? [...params.samples].sort((a, b) => a - b) : [];
    this.probabilities =
      params.type === "Bernoulli" && params.ceil != null
        ? [
            ...Array(params.ceil - 1)
              .fill(0)
              .map(
                (_, i) => params.probability * (1 - params.probability) ** i,
              ),
            (1 - params.probability) ** (params.ceil - 1),
          ]
        : [];
    this.cumulativeProbabilities = this.probabilities.reduce(
      (acc, prob, i, arr) => {
        if (i === 0) return [prob];
        if (i === arr.length - 1) return [...acc, 1];
        return [...acc, acc[i - 1] + prob];
      },
      [] as number[],
    );
    this.meanCost = match(params)
      .with({ type: "Bernoulli", ceil: P.number }, () =>
        this.probabilities.reduce((acc, prob, i) => acc + (i + 1) * prob, 0),
      )
      .with({ type: "Bernoulli" }, ({ probability }) => mean(probability))
      .with({ type: "data" }, () =>
        Math.ceil(
          this.sortedData.reduce((a, b) => a + b, 0) / this.sortedData.length,
        ),
      )
      .otherwise(() => undefined);
    this.meanTopPct = pipe(
      this.meanCost,
      O.fromNullable,
      O.map(Math.floor),
      O.map(this.getTopPctFromCost.bind(this)),
      O.toUndefined,
    );
  }

  public getCostFromTopPct(topPct: number): number | undefined {
    return match(this.params)
      .with({ type: "Bernoulli", ceil: P.number }, () =>
        topPct <= 0
          ? undefined
          : topPct > 100
            ? this.cumulativeProbabilities.length
            : Math.min(
                this.cumulativeProbabilities.filter((cp) => cp * 100 < topPct)
                  .length + 1,
                this.cumulativeProbabilities.length,
              ),
      )
      .with({ type: "Bernoulli" }, ({ probability }) =>
        getCostFromTopPct(probability)(topPct),
      )
      .with({ type: "data" }, () =>
        pipe(
          topPct,
          O.fromPredicate((tp) => tp > 0 && tp <= 100),
          O.map(
            (tp) =>
              this.sortedData[
                Math.floor((tp / 100) * this.sortedData.length) - 1
              ],
          ),
          O.toUndefined,
        ),
      )
      .otherwise(() => undefined);
  }

  public getTopPctFromCost(cost: number): number | undefined {
    return match(this.params)
      .with({ type: "Bernoulli", ceil: P.number }, () =>
        cost <= 0
          ? undefined
          : cost >= this.cumulativeProbabilities.length
            ? 100
            : this.cumulativeProbabilities[cost - 1] * 100,
      )
      .with({ type: "Bernoulli" }, ({ probability }) =>
        getTopPctFromCost(probability)(cost),
      )
      .with({ type: "data" }, () =>
        pipe(
          cost,
          O.fromPredicate((c) => c > 0),
          O.map((c) => {
            let i = 0;
            while (i < this.sortedData.length) {
              i++;
              if (this.sortedData[i - 1] >= c) break;
            }
            return (i / this.sortedData.length) * 100;
          }),
          option.toUndefined,
        ),
      )
      .otherwise(() => undefined);
  }
}
