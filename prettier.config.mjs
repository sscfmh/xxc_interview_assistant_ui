// prettier.config.mjs

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^@/components/(.*)$",
    "^@/(.*)$",
    "^../(.*)$",
    "^./(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  tailwindStylesheet: "./src/index.css",
  tailwindFunctions: ["clsx", "cva", "cx"],
};
