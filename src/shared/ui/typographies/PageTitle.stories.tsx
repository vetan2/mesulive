import { type StoryObj, type Meta } from "@storybook/react";

import { PageTitle } from "./PageTitle";

const meta: Meta<typeof PageTitle> = {
  title: "UI/typographies/PageTitle",
  component: PageTitle,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "타이틀입니다",
    startColorVar: "var(--mesulive-primary-500)",
    endColorVar: "var(--mesulive-secondary-500)",
  },
};
