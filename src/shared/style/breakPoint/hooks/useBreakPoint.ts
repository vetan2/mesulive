import { useState } from "react";
import {
  useDebounceCallback,
  useEventListener,
  useIsomorphicLayoutEffect,
} from "usehooks-ts";

import { type BreakPoint } from "~/shared/style/breakPoint/types";
import { getBreakPoints } from "~/shared/style/breakPoint/utils";

type UseBreakPointOptions<InitializeWithValue extends boolean | undefined> = {
  initializeWithValue: InitializeWithValue;
  debounceDelay?: number;
};

const IS_SERVER = typeof window === "undefined";

// SSR version of useWindowSize.
export function useBreakPoint(
  options: UseBreakPointOptions<false>,
): BreakPoint | undefined;
// CSR version of useWindowSize.
export function useBreakPoint(
  options?: Partial<UseBreakPointOptions<true>>,
): BreakPoint;
export function useBreakPoint(
  options: Partial<UseBreakPointOptions<boolean>> = {},
): BreakPoint | undefined {
  let { initializeWithValue = true } = options;
  if (IS_SERVER) {
    initializeWithValue = false;
  }

  const [breakPoint, setBreakPoint] = useState<BreakPoint | undefined>(() => {
    if (initializeWithValue) {
      return getBreakPoints(window.innerWidth);
    }
    return undefined;
  });

  const debouncedSetBreakPoint = useDebounceCallback(
    setBreakPoint,
    options.debounceDelay,
  );

  function handleSize() {
    const setter = options.debounceDelay
      ? debouncedSetBreakPoint
      : setBreakPoint;

    setter(getBreakPoints(window.innerWidth));
  }

  useEventListener("resize", handleSize);

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize();
  }, []);

  return breakPoint;
}
