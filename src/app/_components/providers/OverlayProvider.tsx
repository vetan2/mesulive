"use client";

import { OverlayProvider as OverlayProviderOrig } from "overlay-kit";
import { type PropsWithChildren } from "react";

export const OverlayProvider = ({ children }: PropsWithChildren) => {
  return <OverlayProviderOrig>{children}</OverlayProviderOrig>;
};
