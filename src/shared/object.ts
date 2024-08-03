export const entries = <T extends Record<string, unknown>>(obj: T) =>
  Object.entries(obj) as [keyof T, T[keyof T]][];

export const values = <T extends Record<string, unknown>>(obj: T) =>
  Object.values(obj) as T[keyof T][];

export const keys = <T extends Record<string, unknown>>(obj: T) =>
  Object.keys(obj) as (keyof T)[];
