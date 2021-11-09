const { stderr } = process;
const path = require("path");
const fs = require("fs");
const { constants } = fs;

const folderPath = path.join(__dirname, "project-dist");
const indexPath = path.join(folderPath, 'index.html');
const templatePath = path.join(__dirname, 'template.html');
const assetsPath = path.join(__dirname, 'assets');
const newAssetsPath = path.join(folderPath, 'assets');
const stylePath = path.join(folderPath, "style.css");
const srcStylePath = path.join(__dirname, "styles");

// create folder 'project-dist'
fs.mkdir(folderPath, { recursive: true }, (error) => {
  if (error) stderr.write(`Error fs.mkdir() code: ${error}`);
});

// create index.html
// fill tagArr by tags from components
let tagArr = [];
const template = fs.createReadStream(templatePath, 'utf-8');
const index = fs.createWriteStream(indexPath);

fs.readdir(path.join(__dirname, "components"), { withFileTypes: true }, (error, files) => {
  if (error) {
    stderr.write(`Error fs.readdir() code: ${error}`);
  } else {
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === ".html") {
        tagArr.push(`{{${path.parse(path.join(__dirname, "components", file.name)).name}}}`);
      }
    });
  }
});

// fs.access(indexPath, constants.F_OK, (error) => {
//   if (!error)
//     fs.unlink(indexPath, (error) => {
//       if (error) stderr.write(`Error fs.unlink() code: ${error}`);
//     });
// });

template.on('data', chunk => {
  let data = chunk.toString();

  tagArr.forEach((tag, ind) => {
    if (data.indexOf(tag) > -1) {
      let correctTag = tag.replace('{{', '').replace('}}', '');

      let readComp = fs.createReadStream(path.join(__dirname, "components", correctTag + ".html"), 'utf-8');
      readComp.on('data', html => {
        data = data.replace(tag, html);
        if (ind === tagArr.length - 1) {// write file on the last tag
          index.write(data);
        }
      });
    }

  });

});
template.on('error', error => stderr.write(`Error template.on() code: ${error}`));

// copy assets
fs.mkdir(newAssetsPath, { recursive: true}, error => {
  if (error) stderr.write(`Error fs.mkdir() code: ${error}`);
});

fs.readdir(newAssetsPath, { withFileTypes: true }, (error, folders) => {
  if (error) {
    stderr.write(`Error fs.readdir() code: ${error}`);
  } else {
    folders.forEach((fold) => {
      let newFoldPath = path.join(newAssetsPath, fold.name);

      fs.mkdir(newFoldPath, { recursive: true}, error => {
        if (error) stderr.write(`Error fs.mkdir() code: ${error}`);
      });

      fs.readdir(newFoldPath, { withFileTypes: true }, (error, files) => {
        if (error) {
          stderr.write(`Error fs.readdir() code: ${error}`);
        } else {
          files.forEach((file) => {
            let newFilePath = path.join(newFoldPath, file.name);
      
            fs.unlink(newFilePath, error => {
              if (error) stderr.write(`Error fs.unlink() code: ${error}`);
            });
          });
        }
      });

    });
  }
});

fs.readdir(assetsPath, { withFileTypes: true }, (error, folders) => {
  if (error) {
    stderr.write(`Error fs.readdir() code: ${error}`);
  } else {
    folders.forEach((fold) => {
      let foldPath = path.join(assetsPath, fold.name);
      let newFoldPath = path.join(newAssetsPath, fold.name);

      fs.mkdir(newFoldPath, { recursive: true}, error => {
        if (error) stderr.write(`Error fs.mkdir() code: ${error}`);
      });

      fs.readdir(foldPath, { withFileTypes: true }, (error, files) => {
        if (error) {
          stderr.write(`Error fs.readdir() code: ${error}`);
        } else {
          files.forEach((file) => {
            let filePath = path.join(foldPath, file.name);
            let newFilePath = path.join(newFoldPath, file.name);
      
            fs.copyFile(filePath, newFilePath, error => {
              if (error) stderr.write(`Error fs.copyFile() code: ${error}`);
            });
          });
        }
      });

    });
  }
});

// create style.css
fs.access(stylePath, constants.F_OK, (error) => {
  if (!error)
    fs.unlink(stylePath, (error) => {
      if (error) stderr.write(`Error fs.unlink() code: ${error}`);
    });
});

fs.readdir(srcStylePath, { withFileTypes: true }, (error, files) => {
  if (error) {
    stderr.write(`Error fs.readdir() code: ${error}`);
  } else {

    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === ".css") {

        fs.readFile(path.join(srcStylePath, file.name), "utf-8", (error, data) => {
          if (error) {
            stderr.write(`Error fs.readFile() code: ${error}`);
          } else {

            fs.appendFile(stylePath, data, (error) => {
              if (error) stderr.write(`Error fs.appendFile() code: ${error}`);
            });

          }
        });

      }
    });

  }
});
