/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:@vetan2/react",
    "plugin:storybook/recommended",
  ],
  plugins: ["@vetan2"],
  rules: {
    "@vetan2/import-path": 1,

    "import/order": [
      1,
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        "newlines-between": "always",
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
        ],
        pathGroups: [
          {
            pattern: "~*/**",
            group: "internal",
          },
          {
            pattern: "@*/**",
            group: "internal",
          },
        ],
      },
    ],
    "import/no-extraneous-dependencies": [
      1,
      {
        devDependencies: [
          ".storybook/**",
          "**/*.config.*",
          "scripts/**",
          "**/*.stories.ts*",
        ],
      },
    ],
    "prettier/prettier": [1, {}, { usePrettierrc: true }],
  },
  overrides: [
    {
      files: ["layout.tsx", "page.tsx"],
      rules: {
        "react/function-component-definition": [
          2,
          { namedComponents: "function-declaration" },
        ],
      },
    },
    {
      files: ["**/*.test.ts*"],
      env: {
        jest: true,
      },
    },
    {
      files: ["**/*.config.*"],
      rules: { "import/no-anonymous-default-export": 0 },
    },
  ],
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.eslint.json"],
  },
};
