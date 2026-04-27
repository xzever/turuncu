import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // matchMedia / localStorage ilk senkron okuma — useEffect içi setState yaygın ve geçerli
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "**/.next/**",
    ".next-stale*/**",
    "**/.next-stale*/**",
    ".claude/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local legacy snapshot; not part of active codebase.
    "_legacy_backup_*/**",
    // Monorepo skeleton; not part of root Next.js app.
    "apps/**",
  ]),
]);

export default eslintConfig;
