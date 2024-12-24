import { NextUIProvider } from "@nextui-org/react";
import {
  withThemeByClassName,
  withThemeFromJSXProvider,
} from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";

import { OverlayProvider } from "~/app/_components/providers";
import { cx } from "~/shared/style";

import "~/shared/style/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    layout: "centered",
  },
  decorators: [
    withThemeFromJSXProvider({ Provider: NextUIProvider }),
    withThemeByClassName({
      themes: {
        default: cx("font-pretendard", "font-medium"),
      },
      defaultTheme: "default",
    }),
    (Story) => (
      <OverlayProvider>
        <Story />
      </OverlayProvider>
    ),
  ],
};

export default preview;
