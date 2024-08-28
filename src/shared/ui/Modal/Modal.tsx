"use client";

import {
  Modal as ModalOrig,
  type ModalProps as ModalPropsOrig,
} from "@nextui-org/react";
import { forwardRef } from "react";

export interface ModalProps extends ModalPropsOrig {
  onExit?: () => void;
}

export const Modal = forwardRef<HTMLElement, ModalProps>(
  ({ classNames, onExit, ...props }, ref) => {
    return (
      <ModalOrig
        ref={ref}
        motionProps={{
          ...props.motionProps,
          onAnimationComplete: (definition) => {
            if (props.isOpen === false) {
              onExit?.();
            }
            props.motionProps?.onAnimationComplete?.(definition);
          },
        }}
        {...props}
      />
    );
  },
);
