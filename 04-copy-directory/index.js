const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

(async function (dir) {
  const filesCopyPath = path.join(__dirname, 'files-copy');
  await fsPromises.mkdir((filesCopyPath), {recursive: true});
  try {
    const files = await fsPromises.readdir(dir);
    const filesCopy = await fsPromises.readdir(filesCopyPath);
    for (const fileCopy of filesCopy) {
      fs.unlink(path.join(filesCopyPath, fileCopy), err => {
        if (err) throw err;
      });
    }
    for (const file of files) {
      await fsPromises.copyFile(path.join(dir, file), path.join(__dirname, 'files-copy', `${file}`));
    }
  } catch (err) {
    console.error(err);
  }
})(path.join(__dirname, 'files'));
