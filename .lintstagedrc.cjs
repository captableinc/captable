const path = require("node:path");

const buildBiomeCommand = (filenames) =>
  `biome check --apply --no-errors-on-unmatched ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" ")}`;

/** @type {import('lint-staged').Config} */
module.exports = {
  "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [buildBiomeCommand],
};
