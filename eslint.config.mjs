import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import kurateh from "@kurateh/eslint-plugin";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["!**/.storybook", ".next", "node_modules"],
  },
  ...compat.extends(
    "plugin:@next/next/recommended",
    "plugin:storybook/recommended",
  ),
  ...kurateh.configs.react,
  {
    rules: {
      "@kurateh/import-path": 1,

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
            "**/*.test.ts*",
          ],
        },
      ],

      "prettier/prettier": [
        1,
        {},
        {
          usePrettierrc: true,
        },
      ],

      "no-console": 1,
    },
  },
  {
    files: ["**/layout.tsx", "**/page.tsx"],

    rules: {
      "react/function-component-definition": [
        2,
        {
          namedComponents: "function-declaration",
        },
      ],
    },
  },
  {
    files: ["**/*.test.ts*"],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ["**/*.config.*"],

    rules: {
      "import/no-anonymous-default-export": 0,
    },
  },
];
