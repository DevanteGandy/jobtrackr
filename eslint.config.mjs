import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat();

export default [
  {
    ignores: [
      "**/node_modules/**",
      ".next/**",
      "dist/**",
      "**/.prisma/**",
      "prisma/migrations/**",
      "src/generated/**",        
      "src/generated/prisma/**",  
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
