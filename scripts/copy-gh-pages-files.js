const fs = require('fs');
const path = require('path');

// Создаем директорию .github если её нет
if (!fs.existsSync('.github')) {
  fs.mkdirSync('.github');
}
if (!fs.existsSync('.github/workflows')) {
  fs.mkdirSync('.github/workflows');
}

// Копируем файлы
fs.copyFileSync('dist/index.html', '404.html');
fs.copyFileSync('dist/.nojekyll', '.nojekyll');
fs.copyFileSync('.github/workflows/deploy.yml', '.github/workflows/deploy.yml');

console.log('GitHub Pages files copied successfully!'); 