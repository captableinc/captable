#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");

const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));

const pdfWorkerPath = path.join(pdfjsDistPath, "build", "pdf.worker.min.js");

fs.copyFileSync(pdfWorkerPath, "./public/pdf.worker.min.js");
