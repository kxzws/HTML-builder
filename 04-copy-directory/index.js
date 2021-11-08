const { stderr } = process;
const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, 'files');
const newFolderPath = path.join(__dirname, 'files-copy');

fs.mkdir(newFolderPath, { recursive: true}, error => {
  if (error) stderr.write(`Error fs.mkdir() code: ${error}`);
});

fs.readdir(newFolderPath, { withFileTypes: true }, (error, files) => {
  if (error) {
    stderr.write(`Error fs.readdir() code: ${error}`);
  } else {
    files.forEach((file) => {
        let newFilePath = path.join(newFolderPath, file.name);
        
        fs.unlink(newFilePath, error => {
          if (error) stderr.write(`Error fs.unlink() code: ${error}`);
        });
    });
  }
});

fs.readdir(folderPath, { withFileTypes: true }, (error, files) => {
  if (error) {
    stderr.write(`Error fs.readdir() code: ${error}`);
  } else {
    files.forEach((file) => {
        let filePath = path.join(folderPath, file.name);
        let newFilePath = path.join(newFolderPath, file.name);
        
        fs.copyFile(filePath, newFilePath, error => {
          if (error) stderr.write(`Error fs.copyFile() code: ${error}`);
        });
    });
  }
});
