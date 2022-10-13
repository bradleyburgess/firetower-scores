const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");

// WARNING: Very peculiar behavior.
// `fast-glob` somehow takes the project root as the base directory,
// while `path` takes the current dir (scripts) as the base dir.
// This is why we have a discrepancy below.

const minFiles = fg.sync("dist/*.min.js");            // <-- note missing ".."
for (let file of minFiles) {
  const filePath = path.join(__dirname, "..", file);  // <-- note ".."
  const input = fs.readFileSync(filePath, "utf-8");
  const output = input.replace(/\\n */g, "");
  fs.writeFileSync(filePath, output, "utf-8");
}
