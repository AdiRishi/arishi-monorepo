/** @type {import("prettier").Config} */
export default {
  singleQuote: true,
  trailingComma: 'es5',
  semi: true,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx', 'cn', 'cva'],
  importOrder: ['<THIRD_PARTY_MODULES>', '^[./]'],
};
