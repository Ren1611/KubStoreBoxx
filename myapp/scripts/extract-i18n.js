const fs = require("fs");
const path = require("path");

const SOURCE_DIR = path.join(__dirname, "..", "src");
const OUTPUT_DIR = path.join(__dirname, "..", "src", "i18n", "locales");
const EXCLUDED_DIRS = ["node_modules", ".git", "dist", "build", "__tests__"];
const FILE_EXTENSIONS = [".jsx", ".js", ".tsx", ".ts"];

const PATTERNS = {
  JSX_TEXT: />[^<>]*?[а-яА-ЯёЁa-zA-Z][^<>]*?</g,

  ATTR_TEXT:
    /(?:placeholder|title|alt|aria-label|label|button|header|footer|description|message|text|value|name)=["']([^"']+?)["']/g,

  T_FUNCTION: /(?:t|translate)\s*\(\s*["']([^"']+?)["']/g,

  STRING_TEXT: /["']([а-яА-ЯёЁa-zA-Z][^"']{1,50})["']/g,

  BUTTON_TEXT: /<button[^>]*>([^<]+)<\/button>/g,
  HEADER_TEXT: /<(h1|h2|h3|h4|h5|h6)[^>]*>([^<]+)<\/\1>/g,
  PARAGRAPH_TEXT: /<p[^>]*>([^<]+)<\/p>/g,
};

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
          console.log(`  Ошибка доступа к ${fullPath}: ${err.message}`);
        }
      });
    } catch (err) {
      console.log(`  Ошибка чтения директории ${currentDir}: ${err.message}`);
    }
  }

  walk(dir);
  return files;
}

function extractFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const texts = new Set();

    Object.values(PATTERNS).forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        let text = match[1] || match[0];

        if (typeof text === "string") {
          text = text
            .replace(/<[^>]+>/g, "")
            .replace(/&[a-z]+;/g, "")
            .replace(/>/g, "")
            .replace(/</g, "")
            .trim();

          if (isValidText(text)) {
            texts.add(text);
          }
        }
      }
    });

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
    console.log(` Ошибка чтения файла ${filePath}: ${err.message}`);
    return [];
  }
}

function isValidText(text) {
  if (!text || text.length < 2) return false;

  const hasLetters = /[а-яА-ЯёЁa-zA-Z]/.test(text);
  if (!hasLetters) return false;

  const EXCLUDED_PATTERNS = [
    /^\d+$/,
    /^[A-Z_]+$/,
    /^[a-z]+\.[a-z]+$/,
    /^http/,
    /^www\./,
    /^\.\//,
    /^[\{\}]/,
    /^\$/,
    /^@/,
    /className|style|id|src=|href=|onClick|onChange/,
    /useState|useEffect|import|export|return/,
    /margin|padding|width|height|color/,
  ];

  return !EXCLUDED_PATTERNS.some((pattern) => pattern.test(text));
}

function createKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join("_")
    .replace(/[^a-zа-яё0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, 50);
}

async function main() {
  console.log(" Начинаю поиск текстов для перевода...\n");

  ["en", "ru", "ky"].forEach((lang) => {
    const langDir = path.join(OUTPUT_DIR, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
  });

  const files = getAllFiles(SOURCE_DIR);
  console.log(`📁 Найдено файлов: ${files.length}\n`);

  const allTextsMap = new Map();
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

  const sortedKeys = Array.from(allTextsMap.keys()).sort();
  const translations = {};
  sortedKeys.forEach((key) => {
    translations[key] = allTextsMap.get(key);
  });

  console.log(`\n📊 Всего уникальных текстов: ${sortedKeys.length}\n`);

  const ruData = { translation: translations };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "ru", "translation.json"),
    JSON.stringify(ruData, null, 2),
    "utf8",
  );

  const enData = { translation: {} };
  sortedKeys.forEach((key) => {
    enData.translation[key] = `[EN: ${allTextsMap.get(key)}]`;
  });

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "en", "translation.json"),
    JSON.stringify(enData, null, 2),
    "utf8",
  );

  const kyData = { translation: {} };
  sortedKeys.forEach((key) => {
    kyData.translation[key] = `[KY: ${allTextsMap.get(key)}]`;
  });

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "ky", "translation.json"),
    JSON.stringify(kyData, null, 2),
    "utf8",
  );

  const csvContent = ["Ключ,Русский,Английский,Кыргызский"];
  sortedKeys.forEach((key) => {
    csvContent.push(`"${key}","${allTextsMap.get(key)}","",""`);
  });

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "translations.csv"),
    csvContent.join("\n"),
    "utf8",
  );

  console.log(" Готово! Созданы файлы:");
  console.log(`   📂 ${path.join(OUTPUT_DIR, "ru", "translation.json")}`);
  console.log(`   📂 ${path.join(OUTPUT_DIR, "en", "translation.json")}`);
  console.log(`   📂 ${path.join(OUTPUT_DIR, "ky", "translation.json")}`);
  console.log(`   📂 ${path.join(OUTPUT_DIR, "translations.csv")}`);

  console.log("\n🔑 Примеры найденных текстов:");
  sortedKeys.slice(0, 15).forEach((key, i) => {
    console.log(`   ${i + 1}. ${key} → "${allTextsMap.get(key)}"`);
  });

  console.log("\n Топ файлов по количеству текстов:");
  const sortedFiles = Object.entries(fileTextsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  sortedFiles.forEach(([file, count]) => {
    console.log(`   ${count} текстов → ${file}`);
  });

  console.log("\n Дальнейшие действия:");
  console.log(
    "   1. Отредактируйте файлы переводов (en/translation.json, ky/translation.json)",
  );
  console.log(
    "   2. Или используйте CSV файл для перевода в Google Sheets/Excel",
  );
  console.log("   3. После перевода скопируйте данные обратно в JSON файлы");
  console.log("   4. Обновите компоненты, чтобы использовать ключи i18n");
}

main().catch(console.error);
