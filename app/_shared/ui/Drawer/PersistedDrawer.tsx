import { motion } from "framer-motion";
import { type ReactNode } from "react";

import { cn } from "@/_shared/style";

import { drawerTransition } from "./constants";

interface Props {
  isOpen?: boolean;
  children?: ReactNode;
  className?: string;
}

export const PersistedDrawer = ({ isOpen = true, children, className }: Props) => {
  return (
    <div>
      <motion.div
        className={cn("h-screen w-60", className)}
        animate={{
          x: isOpen ? 0 : -240,
        }}
        transition={drawerTransition}
      >
        {children}
      </motion.div>
    </div>
  );
};
