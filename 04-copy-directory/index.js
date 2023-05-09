const fs = require('fs/promises');
const path = require('path');

const sourceDir = path.resolve(__dirname, 'files');
const targetDir = path.resolve(__dirname, 'files-copy');

async function deleteFolder(dirPath) {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      const currentPath = path.resolve(dirPath, file.name);
      if (file.isDirectory()) {
        await deleteFolder(currentPath);
      } else {
        await fs.unlink(currentPath);
      }
    }
    await fs.rmdir(dirPath);
  } catch (error) {
      throw error;
  }
}

async function copyDir(source, target) {
  fs.mkdir(target, { recursive: true });

  /**Чтение содержимого папки files */
  try {
    const files = await fs.readdir(source, { withFileTypes: true });
    for (const file of files) {
      const sourcePath = path.resolve(source, file.name);
      const targetPath = path.resolve(target, file.name);
      /** Получение информации о файле (это папка или файл)*/
      if (file.isDirectory()) {
        /**Создание папки в папке files-copy, если она есть */
        copyDir(sourcePath, targetPath);
      } else {
        /**Копирование файлов из папки files в папку files-copy */
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  } catch (error) {
      throw error;
  }
}

async function main() {
  await deleteFolder(targetDir);
  await copyDir(sourceDir, targetDir);
}

main().catch(error => {
  console.error('Error:', error);
});
