const { stderr } = process;
const fs = require("fs");
const path = require("path");
const folderPath = path.join(__dirname, "secret-folder");

fs.readdir(folderPath, { withFileTypes: true }, (error, files) => {
  if (error) {
    stderr.write(`Error fs.readdir() code: ${error}`);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        let filePath = path.join(folderPath, file.name);
        fs.stat(filePath, (error, stats) => {
          if (error) {
            stderr.write(`Error fs.stat() code: ${error}`);
          } else {
            console.log(`${path.parse(filePath).name} - ${path.extname(file.name)} - ${stats.size}b`);
          }
        });
      }
    });
  }
  
});
