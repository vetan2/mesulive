import { type Meta, type StoryObj } from "@storybook/react";

import { DefaultModal } from "./DefaultModal";

const meta: Meta<typeof DefaultModal> = {
  title: "UI/DefaultModal",
  component: DefaultModal,
  argTypes: {
    children: {
      control: {
        type: "text",
      },
    },
    title: {
      control: {
        type: "text",
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

export const Default: Story = {
  args: {
    title: "타이틀",
    children: "내용",
    isOpen: true,
  },
};
