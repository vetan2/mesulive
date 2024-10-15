import { type Potential } from "~/entities/potential";

export type RawOptionTable = {
  optionName: string;
  probability: number;
  stat?: Potential.PossibleStat;
  figure?: number;
}[][];

export type OptionTable = {
  name: string;
  probability: number;
  stat?: Potential.PossibleStat;
  figure?: number;
}[][];

export type OptionIdNameRecord = {
  [key: number]: string;
};

export type GradeUpRecord = {
  probability: number;
  ceil?: number;
};
