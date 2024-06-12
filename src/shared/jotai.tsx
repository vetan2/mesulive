import { ScopeProvider } from "jotai-scope";
import { type PropsWithChildren, type ComponentProps, type FC } from "react";

export const createScopeProvider =
  <ScopeProps,>(
    atoms: ComponentProps<typeof ScopeProvider>["atoms"],
    HydrateAtoms: FC<PropsWithChildren<ScopeProps>> = ({ children }) =>
      children,
  ): FC<PropsWithChildren<ScopeProps>> =>
  ({ children, ...props }) => (
    <ScopeProvider atoms={atoms}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <HydrateAtoms {...(props as any)}>{children}</HydrateAtoms>
    </ScopeProvider>
  );
