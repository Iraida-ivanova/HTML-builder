const path = require('path');
const fs = require('fs');

(async function () {
  const projectPath = path.join(__dirname, 'project-dist');
  const pathToStyles = path.join(__dirname, 'styles');
  const copiedFolder = 'assets';
  const dirname = __dirname;
  await fs.promises.rm(projectPath, {force: true, recursive: true});
  await fs.promises.mkdir(projectPath, {recursive: true});
  await copyAssets(projectPath, dirname, copiedFolder);
  await writeIndexHtml(projectPath);
  await writeStyleCss(projectPath, pathToStyles);
})();

async function copyAssets(to, dirname, copiedFolder) {
  const from = path.join(dirname, copiedFolder);
  const filesCopyPath = path.join(to, copiedFolder);

  await fs.promises.mkdir(filesCopyPath, {recursive: true});
  try {
    const files = await fs.promises.readdir(from, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        await fs.promises.copyFile(path.join(from, file.name), path.join(filesCopyPath, file.name));
      }
      else {
        // console.log(file.name);
        await copyAssets(filesCopyPath, from, file.name);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
async function writeStyleCss(projectPath, pathToStyles) {
  try {
    const ws = fs.createWriteStream(path.join(projectPath, 'style.css'));
    const files = await fs.promises.readdir(pathToStyles, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()){
        if (path.extname(file.name) === '.css') {
          let data = [];
          const rs = fs.createReadStream(path.join(pathToStyles, file.name), 'utf-8');
          rs.on('data', chunk => data.push(chunk));
          rs.on('end', () => ws.write(...data));
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
async function writeIndexHtml(projectPath) {
  let template = '';
  const rs = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

  const ws = fs.createWriteStream(path.join(projectPath, 'index.html'));

  rs.on('data', chunk => template += chunk);
  rs.on('end', () => {
    const re = /{{(\w+)}}/g;
    const templateExpressions = [...template.matchAll(re)];

    for (let i = 0; i < templateExpressions.length; i++) {
      const rsOfComponentFile = fs.createReadStream(path.join(__dirname, 'components', `${templateExpressions[i][1]}.html`), 'utf-8');
      let data = '';
      rsOfComponentFile.on('data', (chunk) => data += chunk);
      rsOfComponentFile.on('end', () => {
        template = template.replace(`${templateExpressions[i][0]}`, data);
        if (i === templateExpressions.length - 1) {
          ws.write(template);
        }
      });
    }
  });
}

