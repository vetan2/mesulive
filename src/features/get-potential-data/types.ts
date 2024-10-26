import { type Potential } from "~/entities/potential";

export type OptionTable = {
  name: string;
  probability: number;
  stat?: Potential.PossibleStat;
  figure?: number;
}[][];

export type GradeUpRecord = {
  probability: number;
  ceil?: number;
};
