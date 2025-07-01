#!/usr/bin/env node
const { exec } = require('child_process');

const [, , promptArg] = process.argv;
if (!promptArg) {
  console.error("Usage: node server.js \"<prompt>\"");
  process.exit(1);
}

const shell = process.env.SHELL || "/bin/bash";
const cmd = `gemini -p "${promptArg.replace(/"/g,'\\"')}"`;

exec(cmd, { shell }, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${stderr || err.message}`);
    process.exit(1);
  }
  console.log(stdout);
});

