/**Импорт всех требуемых модулей */
const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, 'styles');
const targetDir = path.resolve(__dirname, 'project-dist', 'bundle.css');

function mergeStyles(source, target) {
  /**Чтение содержимого папки styles*/
  fs.readdir(source, (err, files) => {
    if (err) throw err;
    
    /**Проверка является ли объект файлом и имеет ли файл нужное расширение */

    function readMergedFiles(files, source, extname) {
      const Promises = files
        .filter(file => path.extname(file) === extname)
        .map(file => {
          return new Promise((resolve, reject) => {
            /** Чтение файла стилей */
            fs.readFile(path.resolve(source, file), (err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve(data);
              }
            });
          });
        });

      /**Запись прочитанных данных в массив */
      Promise.all(Promises).then(cssArr => {
        /**Запись массива стилей в файл bundle.css */
        fs.writeFile(path.resolve(target), cssArr.join('\n'), err => {
          if (err) throw err;
        });
      });
    }
    readMergedFiles(files, sourceDir, '.css');
  });
}

mergeStyles(sourceDir, targetDir);

