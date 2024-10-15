import { type FC, type SVGProps } from "react";

export type SVGComponent = FC<SVGProps<SVGSVGElement>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ArrayElement<T extends any[]> = T[number];

export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>;
};
