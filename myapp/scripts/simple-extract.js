const fs = require("fs");
const path = require("path");

console.log("🔍 Поиск текстов для перевода...");

// Рекурсивно ищем все файлы
function findFiles(dir, files = []) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!["node_modules", ".git"].includes(file)) {
        findFiles(fullPath, files);
      }
    } else if (/\.(js|jsx)$/.test(file)) {
      files.push(fullPath);
    }
  });
  return files;
}

// Основная функция
const srcFiles = findFiles(path.join(__dirname, "..", "src"));
const allTexts = new Set();

srcFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");

  // Ищем текст в кавычках
  const matches = content.match(/"([^"\n]{3,50})"/g) || [];
  matches.forEach((match) => {
    const text = match.slice(1, -1);
    // Фильтруем
    if (text && /[а-яА-Яa-zA-Z]/.test(text) && !/\d{4}/.test(text)) {
      allTexts.add(text);
    }
  });

  // Ищем в одинарных кавычках
  const singleMatches = content.match(/'([^'\n]{3,50})'/g) || [];
  singleMatches.forEach((match) => {
    const text = match.slice(1, -1);
    if (text && /[а-яА-Яa-zA-Z]/.test(text)) {
      allTexts.add(text);
    }
  });
});

// Создаем переводы
const translations = {};
Array.from(allTexts)
  .sort()
  .forEach((text, i) => {
    translations[`text_${i + 1}`] = text;
  });

// Создаем директории
const outputDir = path.join(__dirname, "..", "src", "i18n", "locales");
["en", "ru", "ky"].forEach((lang) => {
  fs.mkdirSync(path.join(outputDir, lang), { recursive: true });
});

// Сохраняем
fs.writeFileSync(
  path.join(outputDir, "ru", "translation.json"),
  JSON.stringify({ translation: translations }, null, 2),
);

console.log(`✅ Найдено ${allTexts.size} текстов`);
console.log(`📁 Сохранено в ${outputDir}`);
