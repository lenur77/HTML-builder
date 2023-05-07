/**Импорт всех требуемых модулей*/
const fs = require('fs');
const path = require('path');
/**Чтение содержимого папки secret-folder */
const sourceDir = path.resolve(__dirname, 'secret-folder');

function filesInfo(source) {
  fs.readdir(source, (err, files) => {
    if (err) throw err;

    console.log('\nИнформация о файлах:');
    files.forEach(file => {
      const filePath = path.resolve(source, file);

      /**  Получение данных о каждом объекте который содержит папка secret-folder*/
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;

        /**Проверка объекта на то, что он является файлом */
        if (stats.isFile()) {
          const fileSizeInKb = (stats.size / 1024).toFixed(2);
          const fileName = path.parse(file).name;
          /**Вывод данных о файле в консоль */
          console.log(`${fileName} - ${path.extname(file).slice(1)} - ${fileSizeInKb}kb`);
        }
      });
    });
  });
}
filesInfo(sourceDir);
