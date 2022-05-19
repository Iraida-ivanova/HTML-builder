const path = require('path');
const fs = require('fs');

(async function(pathToDir) {
  try {
    const ws = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'))
    const files = await fs.promises.readdir(pathToDir, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()){
        if (path.extname(file.name) === '.css') {
          let data = [];
          const rs = fs.createReadStream(path.join(pathToDir, file.name), 'utf-8');
          rs.on('data', chunk => data.push(chunk));
          rs.on('end', () => ws.write(...data));
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
)(path.join(__dirname, 'styles'));

