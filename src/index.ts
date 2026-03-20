#!/usr/bin/env node

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);

if (args.length === 0) {
  process.stderr.write("Usage: rb-to-ts <input.rb>\n");
  process.exit(1);
}

const inputPath = args[0];

if (!inputPath) {
  process.stderr.write("Error: input file path is required\n");
  process.exit(1);
}

const source = readFileSync(inputPath, "utf-8");
process.stdout.write(`// TODO: Implement transpiler pipeline\n// Input: ${inputPath} (${String(source.length)} bytes)\n`);
