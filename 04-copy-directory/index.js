/**Импорт всех требуемых модулей */
const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, 'files');
const targetDir = path.resolve(__dirname, 'files-copy');
/**Создание папки files-copy в случае если она ещё не существует */
function copyDir(source, target) {
  fs.mkdir(target, { recursive: true }, (err) => {
    if (err) throw err;
    /**Чтение содержимого папки files */
    fs.readdir(source, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        const sourcePath = path.resolve(source, file.name);
        const targetPath = path.resolve(target, file.name);
       
        /** Получение информации о файле (это папка или файл)*/
        fs.stat(sourcePath, (err, stats) => {
          if (err) throw err;
          if (stats.isDirectory()) {
            /**Создание папки в папке files-copy, если она есть */
            copyDir(sourcePath, targetPath);
          } else {
            /**Копирование файлов из папки files в папку files-copy */
            fs.copyFile(sourcePath, targetPath, err => {
              if (err) throw err;
            });
          }
        });
      });
    });
  });
}

copyDir(sourceDir, targetDir);
