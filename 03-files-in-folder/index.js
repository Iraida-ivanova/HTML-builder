const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

(async function getFiles(dir) {
  try {
    const files = await fsPromises.readdir(dir);
    for (const file of files) {
      fs.stat(path.join(dir, file), (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {
          console.log(file + ' - ' + path.extname(file).slice(1) + ' - ' + stats.size + ' b');
        }
      })
    }
  } catch (err) {
    console.error(err);
  }
})(path.join(__dirname, 'secret-folder'));
