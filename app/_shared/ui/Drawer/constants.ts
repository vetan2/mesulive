import { type motion } from "framer-motion";
import { type ComponentProps } from "react";

export const drawerTransition: ComponentProps<typeof motion.div>["transition"] = {
  bounce: 0,
  duration: 0.3,
  ease: [0.32, 0.72, 0, 1], // Same as Vault
};
