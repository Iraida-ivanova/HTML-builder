const path = require('path');
const fs = require('fs');

(async function (dir) {
  const filesCopyPath = path.join(__dirname, 'files-copy');
  await fs.promises.mkdir(filesCopyPath, {recursive: true});
  await clearDirectory(filesCopyPath);
  try {
    const files = await fs.promises.readdir(dir);
    for (const file of files) {
      await fs.promises.copyFile(path.join(dir, file), path.join(__dirname, 'files-copy', `${file}`));
    }
  } catch (err) {
    console.error(err);
  }
})(path.join(__dirname, 'files'));

async function clearDirectory(pathToDir) {
  const files = await fs.promises.readdir(pathToDir, {withFileTypes: true});
  if (files.length === 0) {
    fs.rmdir(pathToDir, err => {
      if(err) throw err;
    });
  }
  for (const file of files) {
    if (file.isFile()) {
      fs.unlink(path.join(pathToDir, file.name), err => {
        if (err) throw err;
      });
    } else {
      await clearDirectory(path.join(pathToDir, file.name));
    }
  }
}