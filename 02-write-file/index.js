const { stdin, stdout, stderr } = process;
const path = require("path");
const filePath = path.join(__dirname, "text.txt");
const fs = require("fs");
const stream = fs.createWriteStream(filePath, { flags: "a" });

stdout.write("Hello, username! Type your text here:\n");

stdin.on("data", (data) => {
  let text = data.toString();
  if (text.indexOf("exit") > -1) process.exit();
  else stream.write(text);
});
process.on("exit", (code) => {
  if (!code) {
    stdout.write("Good bye");
  } else {
    stderr.write(`Error code: ${code}`);
  }
});
process.on('SIGINT', () => process.exit());