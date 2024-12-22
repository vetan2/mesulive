import { resolve } from "path";

import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    // eslint-disable-next-line no-param-reassign
    config.module = config.module || {};
    // eslint-disable-next-line no-param-reassign
    config.module!.rules = config.module!.rules || [];

    // Alias -----------------------------
    if (config.resolve) {
      // eslint-disable-next-line no-param-reassign
      config.resolve.alias = {
        ...config.resolve.alias,
        "~": resolve(__dirname, "../src"),
      };
    }
    // -----------------------------------

    // SVGR ------------------------------
    const fileLoaderRule = config.module.rules.find((rule) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ruleAny = rule as any;
      return ruleAny.test && ruleAny.test.test && ruleAny.test?.test?.(".svg");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule.resourceQuery?.not || []), /url/],
        }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;
    // -----------------------------------

    return config;
  },
};
export default config;
