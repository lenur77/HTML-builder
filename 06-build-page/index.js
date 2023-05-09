const FS = require('fs');
const fs = require('fs/promises');
const path = require('path');

const componentsPath = path.resolve(__dirname, 'components');
const stylesPath = path.resolve(__dirname, 'styles');
const assetsPath = path.resolve(__dirname, 'assets');
const templatePath = path.resolve(__dirname, 'template.html');
const distPath = path.resolve(__dirname, 'project-dist');
const distAssetsPath = path.resolve(__dirname, 'project-dist', 'assets');

async function createHtml(source, target) {
  try {
    fs.mkdir(source, { recursive: true }, err => {
      if (err) throw err;
    });

    const templateHtml = await fs.readFile(templatePath);
    const htmlComponents = await fs.readdir(target, {
      withFileTypes: true,
    });
    let htmlTag = templateHtml.toString();
    let currentPart = '';
    for (const component of htmlComponents) {
      if (component.isFile() && path.extname(component.name) === '.html') {
        currentPart = await fs.readFile(__dirname + '/components/' + `${component.name}`);
        htmlTag = htmlTag.replace(`{{${component.name.slice(0, -5)}}}`, currentPart.toString());
      }
    }

    fs.writeFile(__dirname + '/project-dist/index.html', htmlTag);
  } catch (err) {
    console.log(err);
  }
}

function copyDir(source, target) {
  FS.mkdir(target, { recursive: true }, err => {
    if (err) throw err;
    /**Чтение содержимого папки files */
    FS.readdir(source, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        const sourcePath = path.resolve(source, file.name);
        const targetPath = path.resolve(target, file.name);

        /** Получение информации о файле (это папка или файл)*/
        FS.stat(sourcePath, (err, stats) => {
          if (err) throw err;
          if (stats.isDirectory()) {
            /**Создание папки в папке files-copy, если она есть */
            copyDir(sourcePath, targetPath);
          } else {
            /**Копирование файлов из папки files в папку files-copy */
            FS.copyFile(sourcePath, targetPath, err => {
              if (err) throw err;
            });
          }
        });
      });
    });
  });
}

function mergeStyles(source, target) {
  FS.mkdir(target, { recursive: true }, err => {
    if (err) throw err;
  });
  FS.readdir(source, (err, files) => {
    if (err) throw err;
    function readMergedFiles(files, source, extname) {
      const Promises = files
        .filter(file => path.extname(file) === extname)
        .map(file => {
          return new Promise((resolve, reject) => {
            FS.readFile(path.resolve(source, file), (err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve(data);
              }
            });  
          });
        });
        

      Promise.all(Promises).then(cssArr => {
        FS.writeFile(path.resolve(target, 'style.css'),    cssArr.join('\n'), err => {
          if (err) throw err;
        });
      });
    }
    readMergedFiles(files, stylesPath, '.css');
  });
}
createHtml(distPath, componentsPath);
copyDir(assetsPath, distAssetsPath);
mergeStyles(stylesPath, distPath);