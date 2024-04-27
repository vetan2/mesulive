import { type Meta, type StoryObj } from "@storybook/react";

import { Sidebar } from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Widgets/Sidebar",
  component: Sidebar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
