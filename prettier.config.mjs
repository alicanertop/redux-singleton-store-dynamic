/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  semi: true,
  endOfLine: 'lf',
  singleQuote: true,
  trailingComma: 'es5',
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: ['^next', '^react', '^[a-zA-Z]', '^@prisma', '^@app', '^@', '^.'],
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
  ],
};