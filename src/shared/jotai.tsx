import { ScopeProvider } from "jotai-scope";
import { omit } from "lodash-es";
import { type PropsWithChildren, type ComponentProps, type FC } from "react";

export const withScopeProvider =
  <ScopeProps extends object>(
    atoms: ComponentProps<typeof ScopeProvider>["atoms"],
    HydrateAtoms: FC<PropsWithChildren<ScopeProps>> = ({ children }) => children,
  ) =>
  <ComponentProps extends object>(
    forwardedProps: (keyof ScopeProps)[],
    Component: FC<ComponentProps>,
  ): FC<ScopeProps & ComponentProps> =>
  (props) => (
    <ScopeProvider atoms={atoms}>
      <HydrateAtoms {...props}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Component {...(omit(props, forwardedProps) as any)} />
      </HydrateAtoms>
    </ScopeProvider>
  );
