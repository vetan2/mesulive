import { type StoryObj, type Meta } from "@storybook/react";

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
      <>
        <div>SideBar</div>
      </>
    ),
    variant: "temporary",
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
