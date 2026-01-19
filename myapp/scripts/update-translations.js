import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, "..", "src");
const LOCALES_DIR = path.join(__dirname, "..", "src", "i18n", "locales");
const EXCLUDED_DIRS = ["node_modules", ".git", "dist", "build", "i18n"];
const FILE_EXTENSIONS = [".jsx", ".js", ".tsx", ".ts"];

const PATTERNS = [
  /<[^>]+?>([^<>]{2,100}?)<\/[^>]+?>/g,

  /(placeholder|title|alt|aria-label|label|button|header|description)=["']([^"']{2,100}?)["']/g,

  /(?:t|translate|i18n\.t)\s*\(\s*["']([^"']{2,100}?)["']/g,

  /<Trans[A-Za-z]*\s*(?:[^>]*)?>([^<]{2,100}?)<\/Trans[A-Za-z]*>/g,

  /["']([а-яА-ЯёЁa-zA-Z][^"']{1,50})["']/g,
];

function readExistingTranslations() {
  const translations = {
    ru: {},
    en: {},
    ky: {},
  };

  try {
    const ruPath = path.join(LOCALES_DIR, "ru", "translation.json");
    if (fs.existsSync(ruPath)) {
      const data = JSON.parse(fs.readFileSync(ruPath, "utf8"));
      translations.ru = data.translation || data;
    }
  } catch (e) {
    console.log("❌ Ошибка чтения ru файла:", e.message);
  }

  try {
    const enPath = path.join(LOCALES_DIR, "en", "translation.json");
    if (fs.existsSync(enPath)) {
      const data = JSON.parse(fs.readFileSync(enPath, "utf8"));
      translations.en = data.translation || data;
    }
  } catch (e) {
    console.log("❌ Ошибка чтения en файла:", e.message);
  }

  try {
    const kyPath = path.join(LOCALES_DIR, "ky", "translation.json");
    if (fs.existsSync(kyPath)) {
      const data = JSON.parse(fs.readFileSync(kyPath, "utf8"));
      translations.ky = data.translation || data;
    }
  } catch (e) {
    console.log("❌ Ошибка чтения ky файла:", e.message);
  }

  return translations;
}

function getAllFiles(dir) {
  const files = [];

  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) return;

    const items = fs.readdirSync(currentDir);

    items.forEach((item) => {
      const fullPath = path.join(currentDir, item);

      try {
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const dirName = path.basename(fullPath);
          if (!EXCLUDED_DIRS.includes(dirName) && !dirName.startsWith(".")) {
            walk(fullPath);
          }
        } else if (FILE_EXTENSIONS.some((ext) => fullPath.endsWith(ext))) {
          files.push(fullPath);
        }
      } catch (err) {}
    });
  }

  walk(dir);
  return files;
}

function extractTextsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const texts = new Set();

    const cleanContent = content
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");

    PATTERNS.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(cleanContent)) !== null) {
        let text = match[1] || match[2];

        if (text) {
          text = text
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim();

          if (isValidText(text)) {
            texts.add(text);
          }
        }
      }
    });

    return Array.from(texts);
  } catch (err) {
    console.log(`⚠️  Ошибка чтения ${filePath}:`, err.message);
    return [];
  }
}

function isValidText(text) {
  if (!text || text.length < 2 || text.length > 100) return false;

  if (!/[а-яА-ЯёЁa-zA-Z]/.test(text)) return false;

  const EXCLUDED = [
    /^\d+$/,
    /^[A-Z_]{3,}$/,
    /^[a-z]+\.[a-z]+$/,
    /^http/,
    /\.(css|scss|js|jsx|ts|tsx|json)$/,
    /^[\.\/\\]/,
    /^[\{\}\$]/,
    /^use[A-Z]/,
    /^on[A-Z]/,
    /className|style|id|src|href|target|rel/,
    /margin|padding|width|height|color|background/,
    /import|export|return|const|let|var|function/,
  ];

  return !EXCLUDED.some((pattern) => pattern.test(text));
}

function createKey(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zа-яё0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 4)
    .join("_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, 40);
}

function findNewTexts(existingTranslations, newTexts) {
  const existingValues = new Set(Object.values(existingTranslations.ru));
  const newUniqueTexts = new Set();

  newTexts.forEach((text) => {
    if (!existingValues.has(text)) {
      newUniqueTexts.add(text);
    }
  });

  return Array.from(newUniqueTexts);
}

async function main() {
  console.log("🔄 Обновление файлов переводов...\n");

  const existing = readExistingTranslations();
  console.log(`📊 Существующие переводы:`);
  console.log(`   Русский: ${Object.keys(existing.ru).length} ключей`);
  console.log(`   Английский: ${Object.keys(existing.en).length} ключей`);
  console.log(`   Кыргызский: ${Object.keys(existing.ky).length} ключей\n`);

  const files = getAllFiles(SOURCE_DIR);
  console.log(`🔍 Сканирую ${files.length} файлов...\n`);

  const allTexts = new Set();

  files.forEach((file, index) => {
    const texts = extractTextsFromFile(file);

    if (texts.length > 0) {
      texts.forEach((text) => allTexts.add(text));
    }

    if ((index + 1) % 20 === 0 || index === files.length - 1) {
      process.stdout.write(
        `   Обработано: ${index + 1}/${files.length} файлов\r`,
      );
    }
  });

  console.log(`\n📝 Найдено уникальных текстов: ${allTexts.size}\n`);

  const newTexts = findNewTexts(existing, Array.from(allTexts));
  console.log(`🎯 Новых текстов для перевода: ${newTexts.length}\n`);

  if (newTexts.length === 0) {
    console.log("✅ Все тексты уже есть в переводах!");
    return;
  }

  const updated = { ...existing };
  let addedCount = 0;

  newTexts.forEach((text) => {
    const key = createKey(text);

    let finalKey = key;
    let counter = 1;
    while (updated.ru[finalKey]) {
      finalKey = `${key}_${counter}`;
      counter++;
    }

    updated.ru[finalKey] = text;
    updated.en[finalKey] = `[EN: ${text}]`;
    updated.ky[finalKey] = `[KY: ${text}]`;
    addedCount++;
  });

  const sortedRu = {};
  const sortedEn = {};
  const sortedKy = {};

  Object.keys(updated.ru)
    .sort()
    .forEach((key) => {
      sortedRu[key] = updated.ru[key];
      sortedEn[key] = updated.en[key] || `[EN: ${updated.ru[key]}]`;
      sortedKy[key] = updated.ky[key] || `[KY: ${updated.ru[key]}]`;
    });

  try {
    ["ru", "en", "ky"].forEach((lang) => {
      const langDir = path.join(LOCALES_DIR, lang);
      if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
      }
    });

    fs.writeFileSync(
      path.join(LOCALES_DIR, "ru", "translation.json"),
      JSON.stringify({ translation: sortedRu }, null, 2),
      "utf8",
    );

    fs.writeFileSync(
      path.join(LOCALES_DIR, "en", "translation.json"),
      JSON.stringify({ translation: sortedEn }, null, 2),
      "utf8",
    );

    fs.writeFileSync(
      path.join(LOCALES_DIR, "ky", "translation.json"),
      JSON.stringify({ translation: sortedKy }, null, 2),
      "utf8",
    );

    const newTranslations = {};
    newTexts.forEach((text) => {
      const key = createKey(text);
      newTranslations[key] = text;
    });

    fs.writeFileSync(
      path.join(LOCALES_DIR, "new_translations.json"),
      JSON.stringify(newTranslations, null, 2),
      "utf8",
    );

    console.log("✅ Файлы успешно обновлены!");
    console.log(`\n📈 Добавлено новых ключей: ${addedCount}`);
    console.log(`📊 Теперь всего ключей: ${Object.keys(sortedRu).length}`);

    console.log("\n📁 Обновленные файлы:");
    console.log(`   📂 ${path.join(LOCALES_DIR, "ru", "translation.json")}`);
    console.log(`   📂 ${path.join(LOCALES_DIR, "en", "translation.json")}`);
    console.log(`   📂 ${path.join(LOCALES_DIR, "ky", "translation.json")}`);
    console.log(`   📂 ${path.join(LOCALES_DIR, "new_translations.json")}`);

    if (newTexts.length > 0) {
      console.log("\n📝 Примеры новых текстов:");
      newTexts.slice(0, 10).forEach((text, i) => {
        const key = createKey(text);
        console.log(`   ${i + 1}. ${key} → "${text}"`);
      });
    }

    console.log("\n🎯 Что делать дальше:");
    console.log(
      "   1. Откройте файлы en/translation.json и ky/translation.json",
    );
    console.log("   2. Найдите тексты с метками [EN: ...] и [KY: ...]");
    console.log("   3. Замените их на правильные переводы");
  } catch (error) {
    console.error("❌ Ошибка сохранения файлов:", error.message);
  }
}

main().catch(console.error);
