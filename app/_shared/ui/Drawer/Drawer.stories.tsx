import { type StoryObj, type Meta } from "@storybook/react";
import { motion } from "framer-motion";

import { drawerTransition } from "./constants";
import { Drawer } from "./Drawer";

const meta: Meta<typeof Drawer> = {
  title: "UI/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    children: (
      <div className="flex h-full items-center justify-center border-r bg-default-50 p-4 font-bold">SideBar</div>
    ),
    variant: "temporary",
    isOpen: true,
  },
  render: (props) => (
    <div className="flex h-screen w-full">
      <Drawer {...props} />
      <motion.div
        className="flex h-full flex-1 items-center justify-center border-4 border-primary-100 bg-primary-50"
        animate={{ marginLeft: props.variant !== "persisted" || props.isOpen ? 0 : -240 }}
        transition={drawerTransition}
      >
        Content
      </motion.div>
    </div>
  ),
  argTypes: {
    variant: {
      options: ["permanent", "persisted", "temporary"],
      control: {
        type: "radio",
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
    isOpen: {
      control: {
        type: "boolean",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Permanent: Story = {
  args: {
    variant: "permanent",
  },
};

export const Persisted: Story = {
  args: {
    variant: "persisted",
  },
};

export const Temporary: Story = {
  args: {
    variant: "temporary",
  },
};
