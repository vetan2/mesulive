"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { type PropsWithChildren } from "react";

export const MotionProvider = ({ children }: PropsWithChildren) => {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
};
