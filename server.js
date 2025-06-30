const { exec } = require("child_process");

process.stdin.setEncoding("utf8");

let input = "";
process.stdin.on("data", chunk => input += chunk);
process.stdin.on("end", () => {
  const command = `gemini -p "${input.replace(/"/g, '\"').trim()}"`;

  exec(command, { shell: "/bin/bash" }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${stderr}`);
      process.stdout.write(`Error: ${stderr}`);
    } else {
      process.stdout.write(stdout);
    }
  });
});
