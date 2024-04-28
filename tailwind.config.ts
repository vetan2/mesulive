import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

import { danger, primary, secondary, success, warning } from "./app/_shared/style/colors";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary,
            secondary,
            warning,
            success,
            danger,
          },
        },
        dark: {
          colors: {
            primary,
            secondary,
            warning,
            success,
            danger,
          },
        },
      },
    }),
  ],
};
export default config;
