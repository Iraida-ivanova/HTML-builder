const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;
const readline = require('readline');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Введите текст\n');

const rl = readline.createInterface({ input: stdin, output: output });

rl.on('line', data => {
  if(data === 'exit') {
    rl.close();
  } else {
    output.write(`${data}\n`);
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  stdout.write('До свидания! Удачи в изучении Node.js!');
});
