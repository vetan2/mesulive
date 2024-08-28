"use client";

import {
  type ProviderProps,
  ScopeProvider as ScopeProviderOrig,
} from "bunshi/react";
import { type PropsWithChildren } from "react";

export const ScopeProvider = <T,>({
  children,
  ...others
}: PropsWithChildren<ProviderProps<T>>) => {
  return <ScopeProviderOrig {...others}>{children}</ScopeProviderOrig>;
};
