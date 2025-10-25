import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "warn",
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@next/next/no-img-element": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-require-imports": "warn",
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "lib/generated/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "**/generated/**",
      "**/prisma/**",
      "**/wasm*.js",
      "**/wasm-engine*.js",
      "**/runtime/**",
      "**/wasm.js",
      "**/wasm-engine-edge.js",
      "**/wasm-engine-edge.js",
      "**/wasm.js",
    ],
  },
];

export default eslintConfig;
