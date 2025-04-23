const fs = require('fs');
const path = require('path');

// Создаем директории, если они не существуют
if (!fs.existsSync('.github')) {
  fs.mkdirSync('.github');
}
if (!fs.existsSync('.github/workflows')) {
  fs.mkdirSync('.github/workflows', { recursive: true });
}

// Копируем файлы
fs.copyFileSync('public/404.html', '404.html');
fs.copyFileSync('dist/.nojekyll', '.nojekyll');
fs.copyFileSync('.github/workflows/deploy.yml', '.github/workflows/deploy.yml');

console.log('GitHub Pages files copied successfully!'); 