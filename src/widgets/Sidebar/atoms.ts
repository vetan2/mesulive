import { atom } from "jotai";

const isOpen = atom(false);
isOpen.debugLabel = "sidebar/isOpen";

export const sidebarAtoms = {
  isOpen,
};
