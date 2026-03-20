/**
 * ESLint Configuration (v10.x)
 *
 * This config contains ONLY rules that ESLint handles.
 * All other rules are handled by oxlint (see .oxlintrc.json).
 *
 * ESLint-only rules (not available in oxlint):
 *   - perfectionist/sort-imports: Import sorting/grouping (not implemented in oxlint)
 *   - @typescript-eslint/naming-convention: Naming rules (not implemented in oxlint)
 *   - @typescript-eslint/no-shadow: TS-aware shadow detection (oxlint core version insufficient)
 *   - @typescript-eslint/no-use-before-define: TS-aware ordering (oxlint core version insufficient)
 *   - @typescript-eslint/prefer-optional-chain: (oxlint nursery)
 *   - @typescript-eslint/prefer-readonly: (oxlint nursery)
 *   - @typescript-eslint/prefer-string-starts-ends-with: (oxlint nursery)
 *   - @typescript-eslint/consistent-type-exports: (oxlint nursery)
 *   - @typescript-eslint/no-unnecessary-type-parameters: (oxlint nursery)
 */

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";
import prettierConfig from "eslint-config-prettier";
import oxlint from "eslint-plugin-oxlint";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  // Base presets (parser config + fallback rules for non-oxlint-covered rules)
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strict,
  ...tseslint.configs.strictTypeChecked,

  // Suppress "unused eslint-disable directive" warnings for rules now handled by oxlint
  {
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },

  // ESLint-only rules for all TypeScript files
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      perfectionist,
    },
    rules: {
      // ===== Dependency Management (not implemented in oxlint) =====
      "perfectionist/sort-imports": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          ignoreCase: true,
          newlinesBetween: 1,
          groups: [
            "type-import",
            ["value-builtin", "value-external"],
            "value-internal",
            "value-parent",
            "value-sibling",
            "value-index",
            "unknown",
          ],
        },
      ],

      // ===== Naming Convention (not implemented in oxlint) =====
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        {
          selector: "enum",
          format: ["PascalCase"],
        },
      ],

      // ===== TS-aware rules (oxlint core version insufficient) =====
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "error",

      // ===== Nursery rules in oxlint (not yet stable) =====
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/prefer-string-starts-ends-with": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/no-unnecessary-type-parameters": "error",

      // ===== Re-introduction prevention =====
      // .skip()/.only() are banned to ensure all tests run in CI.
      "no-restricted-syntax": [
        "error",
        {
          selector: 'MemberExpression[property.name="only"]',
          message:
            ".only() is banned. Remove it before committing. All tests must run in CI.",
        },
        {
          selector: 'MemberExpression[property.name="skip"]',
          message:
            ".skip() is banned. Remove it before committing. All tests must run in CI.",
        },
      ],

      // ===== Handled by oxlint but not auto-disabled by eslint-plugin-oxlint =====
      "@typescript-eslint/restrict-template-expressions": "off",
    },
  },

  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "*.config.js",
      "*.config.ts",
      "vitest.config.ts",
      "eslint.config.js",
      "**/*.d.ts",
    ],
  },

  // Prettier integration - disable conflicting rules
  prettierConfig,

  // Oxlint integration - disable ESLint rules already covered by oxlint (must be last)
  ...oxlint.configs["flat/recommended"],
);
