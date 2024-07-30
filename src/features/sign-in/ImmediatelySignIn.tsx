"use client";

import { signIn } from "next-auth/react";
import { useLayoutEffect } from "react";

interface Props {
  provider?: Parameters<typeof signIn>[0];
}

export const ImmediatelySignIn = ({ provider }: Props) => {
  useLayoutEffect(() => {
    signIn(provider);
  }, [provider]);

  return null;
};
