const path = require('path');
const fs = require('fs');

(async function (dir) {
  const filesCopyPath = path.join(__dirname, 'files-copy');
  await fs.promises.rm(filesCopyPath, {force: true, recursive: true});
  await fs.promises.mkdir(filesCopyPath, {recursive: true});
  try {
    const files = await fs.promises.readdir(dir);
    for (const file of files) {
      await fs.promises.copyFile(path.join(dir, file), path.join(__dirname, 'files-copy', file));
    }
  } catch (err) {
    console.error(err);
  }
})(path.join(__dirname, 'files'));
