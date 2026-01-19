const fs = require("fs");
const path = require("path");

// Конфигурация
const SOURCE_DIR = path.join(__dirname, "..", "src");
const OUTPUT_DIR = path.join(__dirname, "..", "src", "i18n", "locales");
const EXCLUDED_DIRS = ["node_modules", ".git", "dist", "build", "__tests__"];
const FILE_EXTENSIONS = [".jsx", ".js", ".tsx", ".ts"];

// Паттерны для поиска текстов
const PATTERNS = {
  // Текст в JSX тегах: <div>текст</div>, <span>текст</span>
  JSX_TEXT: />[^<>]*?[а-яА-ЯёЁa-zA-Z][^<>]*?</g,

  // Атрибуты: placeholder="текст", title="текст", alt="текст"
  ATTR_TEXT:
    /(?:placeholder|title|alt|aria-label|label|button|header|footer|description|message|text|value|name)=["']([^"']+?)["']/g,

  // Функции перевода: t("текст"), translate("текст")
  T_FUNCTION: /(?:t|translate)\s*\(\s*["']([^"']+?)["']/g,

  // Строки с текстом (русские/английские слова)
  STRING_TEXT: /["']([а-яА-ЯёЁa-zA-Z][^"']{1,50})["']/g,

  // Кнопки и заголовки
  BUTTON_TEXT: /<button[^>]*>([^<]+)<\/button>/g,
  HEADER_TEXT: /<(h1|h2|h3|h4|h5|h6)[^>]*>([^<]+)<\/\1>/g,
  PARAGRAPH_TEXT: /<p[^>]*>([^<]+)<\/p>/g,
};

// Рекурсивный поиск всех файлов
function getAllFiles(dir) {
  const files = [];

  function walk(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);

      items.forEach((item) => {
        const fullPath = path.join(currentDir, item);

        try {
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            if (!EXCLUDED_DIRS.includes(item) && !item.startsWith(".")) {
              walk(fullPath);
            }
          } else if (FILE_EXTENSIONS.some((ext) => item.endsWith(ext))) {
            files.push(fullPath);
          }
        } catch (err) {
          console.log(`⚠️  Ошибка доступа к ${fullPath}: ${err.message}`);
        }
      });
    } catch (err) {
      console.log(`⚠️  Ошибка чтения директории ${currentDir}: ${err.message}`);
    }
  }

  walk(dir);
  return files;
}

// Извлечение текстов из файла
function extractFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const texts = new Set();

    // Извлекаем текст разными способами
    Object.values(PATTERNS).forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        let text = match[1] || match[0];

        // Очистка текста
        if (typeof text === "string") {
          // Удаляем теги и лишние символы
          text = text
            .replace(/<[^>]+>/g, "") // удаляем HTML теги
            .replace(/&[a-z]+;/g, "") // удаляем HTML entities
            .replace(/>/g, "") // удаляем оставшиеся >
            .replace(/</g, "") // удаляем оставшиеся <
            .trim();

          // Фильтруем
          if (isValidText(text)) {
            texts.add(text);
          }
        }
      }
    });

    // Также ищем прямой текст в return JSX
    const returnMatch = content.match(
      /return\s*\(\s*<[^>]+>([\s\S]*?)<\/[^>]+>\s*\)/,
    );
    if (returnMatch) {
      const returnText = returnMatch[1].replace(/<[^>]+>/g, "").trim();
      if (isValidText(returnText)) {
        texts.add(returnText);
      }
    }

    return Array.from(texts);
  } catch (err) {
    console.log(`❌ Ошибка чтения файла ${filePath}: ${err.message}`);
    return [];
  }
}

// Проверка валидности текста
function isValidText(text) {
  if (!text || text.length < 2) return false;

  // Проверяем, содержит ли текст буквы (русские или английские)
  const hasLetters = /[а-яА-ЯёЁa-zA-Z]/.test(text);
  if (!hasLetters) return false;

  // Исключаем
  const EXCLUDED_PATTERNS = [
    /^\d+$/, // только цифры
    /^[A-Z_]+$/, // константы в верхнем регистре
    /^[a-z]+\.[a-z]+$/, // имена файлов
    /^http/, // URL
    /^www\./, // URL
    /^\.\//, // пути
    /^[\{\}]/, // шаблонные строки
    /^\$/, // переменные
    /^@/, // декораторы
    /className|style|id|src=|href=|onClick|onChange/, // атрибуты JSX
    /useState|useEffect|import|export|return/, // ключевые слова JS
    /margin|padding|width|height|color/, // CSS свойства
  ];

  return !EXCLUDED_PATTERNS.some((pattern) => pattern.test(text));
}

// Создание ключей для переводов
function createKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 5) // максимум 5 слов
    .join("_")
    .replace(/[^a-zа-яё0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, 50); // ограничиваем длину
}

// Основная функция
async function main() {
  console.log("🔍 Начинаю поиск текстов для перевода...\n");

  // Создаем выходные директории
  ["en", "ru", "ky"].forEach((lang) => {
    const langDir = path.join(OUTPUT_DIR, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
  });

  // Находим все файлы
  const files = getAllFiles(SOURCE_DIR);
  console.log(`📁 Найдено файлов: ${files.length}\n`);

  // Собираем все тексты
  const allTextsMap = new Map(); // key -> original text
  const fileTextsCount = {};

  files.forEach((file, index) => {
    const relativePath = path.relative(process.cwd(), file);
    const texts = extractFromFile(file);

    if (texts.length > 0) {
      fileTextsCount[relativePath] = texts.length;

      texts.forEach((text) => {
        const key = createKey(text);
        if (key && !allTextsMap.has(key)) {
          allTextsMap.set(key, text);
        }
      });

      if (index % 10 === 0 || texts.length > 5) {
        console.log(`  📄 ${relativePath}: ${texts.length} текстов`);
      }
    }
  });

  // Сортируем по ключам
  const sortedKeys = Array.from(allTextsMap.keys()).sort();
  const translations = {};
  sortedKeys.forEach((key) => {
    translations[key] = allTextsMap.get(key);
  });

  console.log(`\n📊 Всего уникальных текстов: ${sortedKeys.length}\n`);

  // Сохраняем русскую версию (оригинал)
  const ruData = { translation: translations };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "ru", "translation.json"),
    JSON.stringify(ruData, null, 2),
    "utf8",
  );

  // Создаем английскую версию (с метками для перевода)
  const enData = { translation: {} };
  sortedKeys.forEach((key) => {
    enData.translation[key] = `[EN: ${allTextsMap.get(key)}]`;
  });

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "en", "translation.json"),
    JSON.stringify(enData, null, 2),
    "utf8",
  );

  // Создаем кыргызскую версию (с метками для перевода)
  const kyData = { translation: {} };
  sortedKeys.forEach((key) => {
    kyData.translation[key] = `[KY: ${allTextsMap.get(key)}]`;
  });

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "ky", "translation.json"),
    JSON.stringify(kyData, null, 2),
    "utf8",
  );

  // Создаем CSV файл для удобного перевода
  const csvContent = ["Ключ,Русский,Английский,Кыргызский"];
  sortedKeys.forEach((key) => {
    csvContent.push(`"${key}","${allTextsMap.get(key)}","",""`);
  });

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "translations.csv"),
    csvContent.join("\n"),
    "utf8",
  );

  // Отчет
  console.log("✅ Готово! Созданы файлы:");
  console.log(`   📂 ${path.join(OUTPUT_DIR, "ru", "translation.json")}`);
  console.log(`   📂 ${path.join(OUTPUT_DIR, "en", "translation.json")}`);
  console.log(`   📂 ${path.join(OUTPUT_DIR, "ky", "translation.json")}`);
  console.log(`   📂 ${path.join(OUTPUT_DIR, "translations.csv")}`);

  console.log("\n🔑 Примеры найденных текстов:");
  sortedKeys.slice(0, 15).forEach((key, i) => {
    console.log(`   ${i + 1}. ${key} → "${allTextsMap.get(key)}"`);
  });

  // Статистика по файлам с наибольшим количеством текстов
  console.log("\n📈 Топ файлов по количеству текстов:");
  const sortedFiles = Object.entries(fileTextsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  sortedFiles.forEach(([file, count]) => {
    console.log(`   ${count} текстов → ${file}`);
  });

  console.log("\n🎯 Дальнейшие действия:");
  console.log(
    "   1. Отредактируйте файлы переводов (en/translation.json, ky/translation.json)",
  );
  console.log(
    "   2. Или используйте CSV файл для перевода в Google Sheets/Excel",
  );
  console.log("   3. После перевода скопируйте данные обратно в JSON файлы");
  console.log("   4. Обновите компоненты, чтобы использовать ключи i18n");
}

// Запуск
main().catch(console.error);
