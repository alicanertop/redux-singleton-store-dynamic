/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  trailingComma: 'es5',
  singleQuote: true,
  semi: true,
  endOfLine: 'lf',
  importOrder: ['^next', '^react', '^[a-zA-Z]', '^@prisma', '^@app', '^@', '^.'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
  ],
};

export default config;