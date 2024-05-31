import { type Meta, type StoryObj } from "@storybook/react";
import { useAtom } from "jotai";
import { useEffect } from "react";

import { sidebarAtoms } from "./atoms";
import { Sidebar } from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Widgets/Sidebar",
  component: Sidebar,
  decorators: [
    (Story) => {
      const [isOpen, setIsOpen] = useAtom(sidebarAtoms.isOpen);
      useEffect(() => {
        setIsOpen(true);
      }, [setIsOpen, isOpen]);
      return Story();
    },
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
