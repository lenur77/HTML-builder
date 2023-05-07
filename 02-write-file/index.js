/**Импорт всех требуемых модулей. */
const fs = require('fs');
const path = require('path');
const readline = require("readline");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fileName = path.resolve(__dirname, 'order.txt');
/**Создание потока записи в текстовый файл */
function writeToFile(data) {
  fs.appendFile(fileName, data, err => {
    if (err) throw err;
    const fileNameToMsg = path.basename(fileName, 'txt');
    console.log(`${data} пожелания внесены в  ${fileNameToMsg}`);
    waitForInput();
  });
}
/**Вывод в консоль приветственного сообщения.  Ожидание ввода текста пользователем, с дальнейшей */
function waitForInput() {
  rl.question('Приветствую тебя, падаван! Можешь оставить свое пожелание или введи exit, чтобы выйти:\n ', inputData => {
  /**проверкa ввода на наличие ключевого слова exit*/
    if (inputData.toLowerCase() === "exit") {
      /**Реализация прощального сообщения при остановке процесса */
      console.log("Да пребудет с тобой Сила");
      process.exit(0);
    } else {
      /**Запись текста в файл */
      writeToFile(`${inputData}\n`);
    }
  });
}
/**Ожидание дальнейшего ввода */
fs.writeFile(fileName, '', err => {
  if (err) throw err;
  waitForInput();
});

