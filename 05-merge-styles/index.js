const { stderr } = process;
const path = require("path");
const fs = require("fs");
const { constants } = fs;

const fileName = "bundle.css";
const destPath = path.join(__dirname, "project-dist", fileName);
const srcPath = path.join(__dirname, "styles");

fs.access(destPath, constants.F_OK, (error) => {
  if (!error)
    fs.unlink(destPath, (error) => {
      if (error) stderr.write(`Error fs.unlink() code: ${error}`);
    });
});

fs.readdir(srcPath, { withFileTypes: true }, (error, files) => {
  if (error) {
    stderr.write(`Error fs.readdir() code: ${error}`);
  } else {
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === ".css") {
        fs.readFile(path.join(srcPath, file.name), "utf-8", (error, data) => {
          if (error) {
            stderr.write(`Error fs.readFile() code: ${error}`);
          } else {
            fs.appendFile(destPath, data, (error) => {
              if (error) stderr.write(`Error fs.appendFile() code: ${error}`);
            });
          }
        });
      }
    });
  }
});
