// .lintstagedrc.cjs
const path = require('path')

const buildBiomeCommand = (filenames) =>
  `biome check --apply --no-errors-on-unmatched ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`

/** @type {import('lint-staged').Config} */
module.exports = {
  '*.{js,jsx,ts,tsx,json,cjs,mjs}': [buildBiomeCommand],
}
