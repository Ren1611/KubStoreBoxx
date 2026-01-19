/**
 * Скрипт для добавления 100 товаров в MockAPI
 * API: https://695c65b779f2f34749d414ce.mockapi.io/Kub
 */

// Данные для генерации товаров
const categories = [
  "Мотошлемы",
  "Мотоэкипировка",
  "Моторасходники и З/Ч",
  "Моторезина",
  "Тюнинг и Аксессуары",
  "Мотохимия",
  "Уцененные товары",
  "Зимняя экипировка",
];

const brands = {
  Мотошлемы: [
    "AGV",
    "SHOEI",
    "ARAI",
    "HJC",
    "SHARK",
    "NOLAN",
    "BELL",
    "LS2",
    "Caberg",
    "MT",
    "Icon",
    "Scorpion",
    "KBC",
    "Vega",
    "KYT",
    "Nexx",
    "Shoei",
    "Arai",
    "Bell",
  ],
  Мотоэкипировка: [
    "Alpinestars",
    "Dainese",
    "REV'IT!",
    "IXS",
    "RST",
    "SPIDI",
    "FURYGAN",
    "BERIK",
    "Joe Rocket",
    "Klim",
    "Icon",
    "Komine",
    "Rukka",
    "BMW",
    "TCX",
    "Sidi",
    "Gaerne",
    "Held",
    "Wayne Rainey",
    "Richa",
    "Macna",
    "Segura",
    "RS Taichi",
    "Five",
  ],
  "Моторасходники и З/Ч": [
    "NGK",
    "DENSO",
    "BOSCH",
    "BREMBO",
    "EBC",
    "GALFER",
    "K&N",
    "DNA",
    "RK",
    "DID",
    "AFAM",
    "JT",
    "MITSUBOSHI",
    "YAMAHA",
    "HONDA",
    "KAWASAKI",
    "SUZUKI",
    "BMW",
    "DUCATI",
    "TRIUMPH",
    "APRILIA",
    "KTM",
    "MOTUL",
    "LIQUI MOLY",
    "CASTROL",
    "All Balls",
    "ProX",
    "Wiseco",
    "Vertex",
    "Hot Cams",
    "Barnett",
    "Hinson",
  ],
  Моторезина: [
    "Michelin",
    "Pirelli",
    "Bridgestone",
    "Dunlop",
    "Metzeler",
    "Continental",
    "Avon",
    "Heidenau",
    "Shinko",
    "Kenda",
    "Maxxis",
    "IRC",
    "Sava",
    "Mitas",
    "Cheng Shin",
    "Vee Rubber",
    "Giti",
    "Hankook",
    "Goodyear",
    "Firestone",
  ],
  "Тюнинг и Аксессуары": [
    "Puig",
    "Ermax",
    "GIVI",
    "SW-MOTECH",
    "Barkbusters",
    "Rizoma",
    "Yoshimura",
    "Akrapovič",
    "LeoVince",
    "Two Brothers",
    "Dynojet",
    "Power Commander",
    "EBC",
    "Öhlins",
    "Brembo",
    "Pirelli",
    "Michelin",
    "Motul",
    "Liqui Moly",
    "SP Connect",
    "Quad Lock",
    "Ram Mounts",
    "GPR",
    "Scott",
    "Renthal",
    "Pro Taper",
    "ASV",
  ],
  Мотохимия: [
    "MOTUL",
    "Liqui Moly",
    "CASTROL",
    "Shell",
    "Mobil 1",
    "TOTAL",
    "ELF",
    "REPSOL",
    "MAXIMA",
    "Bel-Ray",
    "Putoline",
    "Silkolene",
    "Bardahl",
    "Würth",
    "3M",
    "Sonax",
    "Muc-Off",
    "WD-40",
    "Finish Line",
    "Rock Oil",
    "IPONE",
    "Kreem",
  ],
  "Уцененные товары": [
    "AGV",
    "Alpinestars",
    "Dainese",
    "SHOEI",
    "MICHELIN",
    "Pirelli",
    "REV'IT!",
    "IXS",
    "GIVI",
    "Puig",
    "Brembo",
    "Öhlins",
    "Yoshimura",
    "Akrapovič",
  ],
  "Зимняя экипировка": [
    "GERBING",
    "DAINESE",
    "REV'IT!",
    "HELD",
    "TOURMASTER",
    "FIRSTGEAR",
    "Klim",
    "Alpinestars",
    "Rukka",
    "Spada",
    "Macna",
    "Richa",
    "IXS",
    "RST",
  ],
};

// Данные для спецификаций
const helmetTypes = [
  "Интегральный",
  "Модулярный",
  "Открытый",
  "Кроссовый",
  "Спортивный",
];
const helmetSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const helmetMaterials = ["Поликарбонат", "Карбон", "Стекловолокно", "Композит"];
const helmetCertifications = [
  "ECE 22/05",
  "ECE 22/06",
  "DOT",
  "SHARP 4*",
  "SHARP 5*",
];

const equipmentTypes = ["Куртка", "Брюки", "Перчатки", "Ботинки", "Комбинезон"];
const equipmentSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const equipmentMaterials = ["Кожа", "Текстиль", "Кордура", "Смешанный"];
const protectionLevels = ["CE Level 1", "CE Level 2", "EN 1621-1", "EN 1621-2"];

const partTypes = {
  Двигатель: ["Поршни", "Кольца", "Коленвал", "Клапаны", "Распредвал"],
  Трансмиссия: ["Цепь", "Звезды", "Сцепление", "Коробка передач"],
  Тормоза: ["Колодки", "Диски", "Суппорты", "Шланги"],
  Подвеска: ["Амортизаторы", "Пружины", "Рычаги", "Сайлентблоки"],
  Электрика: ["Аккумулятор", "Генератор", "Стартер", "Катушка зажигания"],
};

const tireSizes = [
  "120/70-17",
  "180/55-17",
  "190/50-17",
  "110/80-19",
  "90/90-21",
];
const tireTypes = [
  "Спортивная",
  "Туристическая",
  "Эндуро",
  "Внедорожная",
  "Городская",
];
const tireSeasons = ["Лето", "Всесезон", "Зима"];

const chemistryTypes = [
  "Моторное масло",
  "Тормозная жидкость",
  "Цепная смазка",
  "Очиститель",
  "Полироль",
];
const viscosities = ["5W-30", "5W-40", "10W-40", "15W-50", "20W-50"];

const tuningTypes = [
  "Ветровики",
  "Подножки",
  "Защита",
  "Фонари",
  "Декоративные элементы",
];
const tuningMaterials = ["Алюминий", "Сталь", "Карбон", "Пластик"];

const winterTypes = ["Термобелье", "Подшлемник", "Перчатки", "Куртка", "Штаны"];
const temperatureRanges = [
  "-5°C до +5°C",
  "-10°C до 0°C",
  "-15°C до -5°C",
  "-20°C и ниже",
];

// Вспомогательные функции
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPrice(category) {
  switch (category) {
    case "Мотошлемы":
      return getRandomNumber(5000, 35000);
    case "Мотоэкипировка":
      return getRandomNumber(3000, 25000);
    case "Моторасходники и З/Ч":
      return getRandomNumber(500, 15000);
    case "Моторезина":
      return getRandomNumber(8000, 35000);
    case "Тюнинг и Аксессуары":
      return getRandomNumber(1000, 20000);
    case "Мотохимия":
      return getRandomNumber(500, 8000);
    case "Уцененные товары":
      return getRandomNumber(2000, 15000);
    case "Зимняя экипировка":
      return getRandomNumber(4000, 20000);
    default:
      return getRandomNumber(1000, 20000);
  }
}

function generateImages() {
  const baseImages = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1549317661-bd32b8e6d5b1?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600904290456-e2858196d43f?w=600&auto=format&fit=crop",
  ];

  // Возвращаем 2-3 случайных изображения
  const count = getRandomNumber(2, 3);
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push(baseImages[Math.floor(Math.random() * baseImages.length)]);
  }
  return images;
}

function generateSpecifications(category, brand) {
  const specs = {};

  switch (category) {
    case "Мотошлемы":
      specs.type = getRandomItem(helmetTypes);
      specs.size = getRandomItem(helmetSizes);
      specs.material = getRandomItem(helmetMaterials);
      specs.certification = getRandomItem(helmetCertifications);
      specs.weight = `${getRandomNumber(1200, 1600)}g`;
      specs.visor = getRandomItem([
        "Прозрачный",
        "Дымчатый",
        "Зеркальный",
        "Желтый",
      ]);
      specs.pinlock = getRandomItem([true, false]);
      break;

    case "Мотоэкипировка":
      specs.type = getRandomItem(equipmentTypes);
      specs.size = getRandomItem(equipmentSizes);
      specs.material = getRandomItem(equipmentMaterials);
      specs.protectionLevel = getRandomItem(protectionLevels);
      specs.season = getRandomItem(["Лето", "Демисезон", "Всесезон"]);
      specs.waterproof = getRandomItem([true, false]);
      specs.armor = getRandomItem([
        "Плечи/локти",
        "Плечи/локти/колени",
        "Плечи/локти/колени/спина",
      ]);
      break;

    case "Моторасходники и З/Ч":
      const partCategory = getRandomItem(Object.keys(partTypes));
      specs.category = partCategory;
      specs.type = getRandomItem(partTypes[partCategory]);
      specs.material = getRandomItem([
        "Сталь",
        "Алюминий",
        "Пластик",
        "Резина",
        "Керамика",
      ]);
      specs.compatibility = getRandomItem([
        "Универсальный",
        "Honda/Yamaha/Kawasaki/Suzuki",
        "BMW",
        "Ducati",
        "KTM",
      ]);
      specs.condition = getRandomItem([
        "Новый",
        "Оригинал",
        "Аналог",
        "Контрактный",
      ]);
      break;

    case "Моторезина":
      specs.size = getRandomItem(tireSizes);
      specs.type = getRandomItem(tireTypes);
      specs.season = getRandomItem(tireSeasons);
      specs.speedIndex = getRandomItem(["H", "V", "W", "Y"]);
      specs.loadIndex = getRandomItem(["58", "62", "66", "71", "75"]);
      specs.treadDepth = `${getRandomNumber(6, 10)}мм`;
      specs.compatibility = getRandomItem([
        "Спортивные",
        "Туристические",
        "Круизеры",
        "Эндуро",
      ]);
      break;

    case "Тюнинг и Аксессуары":
      specs.type = getRandomItem(tuningTypes);
      specs.material = getRandomItem(tuningMaterials);
      specs.color = getRandomItem(["Черный", "Серебристый", "Хром", "Цветной"]);
      specs.compatibility = getRandomItem([
        "Универсальный",
        "Спорт",
        "Круизер",
        "Эндуро",
        "Скутер",
      ]);
      specs.installation = getRandomItem([
        "Болтовое",
        "Сварка",
        "Клей",
        "Зажимы",
      ]);
      break;

    case "Мотохимия":
      specs.type = getRandomItem(chemistryTypes);
      specs.volume = getRandomItem(["250мл", "500мл", "1л", "4л", "5л"]);
      if (specs.type === "Моторное масло") {
        specs.viscosity = getRandomItem(viscosities);
        specs.specification = getRandomItem([
          "JASO MA",
          "JASO MA2",
          "API SN",
          "ACEA A3/B4",
        ]);
      }
      specs.composition = getRandomItem([
        "Синтетика",
        "Полусинтетика",
        "Минеральное",
        "Биоразлагаемое",
      ]);
      specs.season = getRandomItem(["Всесезон", "Лето", "Зима"]);
      break;

    case "Уцененные товары":
      // Копируем спецификации из случайной основной категории
      const originalCategory = getRandomItem([
        "Мотошлемы",
        "Мотоэкипировка",
        "Моторезина",
        "Тюнинг и Аксессуары",
      ]);
      Object.assign(specs, generateSpecifications(originalCategory, brand));
      specs.reason = getRandomItem([
        "Упаковка",
        "Выставочный",
        "Остаток",
        "Модель прошлого года",
      ]);
      specs.condition = getRandomItem([
        "Как новый",
        "Незначительные следы",
        "Потертости",
      ]);
      break;

    case "Зимняя экипировка":
      specs.type = getRandomItem(winterTypes);
      specs.temperatureRange = getRandomItem(temperatureRanges);
      specs.material = getRandomItem([
        "Мембрана",
        "Флис",
        "Термоткань",
        "Водоотталкивающая",
      ]);
      specs.heating = getRandomItem(["С подогревом", "Без подогрева"]);
      specs.size = getRandomItem(["S", "M", "L", "XL"]);
      specs.waterproof = getRandomItem([true, false]);
      break;
  }

  return specs;
}

function generateProduct(id) {
  const category = getRandomItem(categories);
  const brand = getRandomItem(brands[category]);
  const price = getRandomPrice(category);

  // Генерируем скидку (20% товаров со скидкой)
  const hasDiscount = Math.random() < 0.2;
  const discount = hasDiscount ? getRandomNumber(5, 30) : 0;
  const oldPrice = hasDiscount
    ? Math.round(price * (1 + discount / 100))
    : null;

  // Генерируем SKU
  const sku = `SKU-${category.substring(0, 3).toUpperCase()}-${id.toString().padStart(6, "0")}-${Date.now().toString(36)}`;

  // Генерируем рейтинг
  const rating = parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)); // 3.5-5.0

  // Генерируем дату
  const year = 2024;
  const month = String(getRandomNumber(1, 12)).padStart(2, "0");
  const day = String(getRandomNumber(1, 28)).padStart(2, "0");
  const createdAt = `${year}-${month}-${day}T${String(getRandomNumber(10, 23)).padStart(2, "0")}:${String(getRandomNumber(0, 59)).padStart(2, "0")}:${String(getRandomNumber(0, 59)).padStart(2, "0")}.000Z`;

  // Генерируем теги
  const tags = [];
  if (hasDiscount) tags.push("акция");
  if (rating > 4.5) tags.push("популярный");
  if (category === "Уцененные товары") tags.push("уценка");
  if (category === "Новинки") tags.push("новинка");
  if (Math.random() > 0.7) tags.push("бестселлер");

  // Генерируем характеристики
  const specifications = generateSpecifications(category, brand);

  // Формируем название товара
  const modelNumbers = [
    "Pro",
    "Racing",
    "Sport",
    "Tour",
    "Street",
    "Adventure",
    "GP",
    "EVO",
  ];
  const modelNumber = getRandomItem(modelNumbers);
  const version = getRandomNumber(1, 5);

  const name = `${brand} ${
    category === "Мотошлемы"
      ? "Шлем"
      : category === "Мотоэкипировка"
        ? "Экипировка"
        : category === "Моторасходники и З/Ч"
          ? "Запчасть"
          : category === "Моторезина"
            ? "Шина"
            : category === "Тюнинг и Аксессуары"
              ? "Аксессуар"
              : category === "Мотохимия"
                ? "Химия"
                : category === "Уцененная экипировка"
                  ? "Уценка"
                  : "Экипировка"
  } ${modelNumber} ${version}`;

  // Формируем описание
  const descriptions = {
    Мотошлемы: `Профессиональный мотошлем ${brand} ${modelNumber} ${version} обеспечивает максимальную защиту и комфорт. Сертификация: ${specifications.certification}. Материал: ${specifications.material}.`,
    Мотоэкипировка: `Качественная экипировка ${brand} для безопасной езды. Защита: ${specifications.protectionLevel}. Материал: ${specifications.material}.`,
    "Моторасходники и З/Ч": `Оригинальная запчасть ${brand} для мотоцикла. Совместимость: ${specifications.compatibility}.`,
    Моторезина: `Шина ${brand} для отличного сцепления и управляемости. Размер: ${specifications.size}. Сезон: ${specifications.season}.`,
    "Тюнинг и Аксессуары": `Аксессуар ${brand} для улучшения внешнего вида и функциональности мотоцикла.`,
    Мотохимия: `Качественная химия ${brand} для ухода и обслуживания мотоцикла.`,
    "Уцененные товары": `Уцененный товар ${brand} в отличном состоянии. Причина уценки: ${specifications.reason}.`,
    "Зимняя экипировка": `Теплая экипировка ${brand} для зимней езды. Диапазон температур: ${specifications.temperatureRange}.`,
  };

  // Формируем финальный продукт
  return {
    id: id.toString(),
    name: name,
    title: `${brand} ${modelNumber} ${version} - ${category}`,
    description: descriptions[category],
    price: price,
    oldPrice: oldPrice,
    discount: discount,
    brand: brand,
    category: category,
    sku: sku,
    images: generateImages(),
    inStock: Math.random() > 0.15, // 85% товаров в наличии
    rating: rating,
    reviews: getRandomNumber(0, 150),
    countInStock: getRandomNumber(0, 50),
    specifications: specifications,
    tags: tags.length > 0 ? tags : [],
    features: [
      "Высокое качество",
      "Надежность",
      "Сертифицировано",
      "Долговечность",
    ],
    createdAt: createdAt,
    updatedAt: createdAt,
    isFeatured: Math.random() > 0.8, // 20% товаров featured
    isActive: true,
    weight: getRandomNumber(500, 5000),
    dimensions: {
      length: getRandomNumber(10, 100),
      width: getRandomNumber(10, 100),
      height: getRandomNumber(10, 100),
    },
    warranty: getRandomNumber(6, 36), // гарантия в месяцах
  };
}

// Основной класс для работы с API
class ProductAPI {
  constructor() {
    this.apiUrl = "https://695c65b779f2f34749d414ce.mockapi.io/Kub";
    this.totalProducts = 100;
    this.batchSize = 5;
    this.delayBetweenRequests = 300; // мс
    this.successCount = 0;
    this.errorCount = 0;
    this.errors = [];
  }

  async addProduct(product, index) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        this.successCount++;
        return { success: true, data: await response.json() };
      } else {
        this.errorCount++;
        const errorText = await response.text();
        this.errors.push({ index, error: errorText });
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
        };
      }
    } catch (error) {
      this.errorCount++;
      this.errors.push({ index, error: error.message });
      return { success: false, error: error.message };
    }
  }

  async addProductsBatch(startIndex, endIndex) {
    console.log(`\n📦 Добавляю товары ${startIndex} - ${endIndex}...`);

    for (let i = startIndex; i <= endIndex; i++) {
      const product = generateProduct(i);

      console.log(`🔄 Товар ${i}: ${product.name} (${product.price} руб)`);

      const result = await this.addProduct(product, i);

      if (result.success) {
        console.log(`✅ Успешно: ${product.name}`);
      } else {
        console.log(`❌ Ошибка: ${result.error}`);
      }

      // Задержка между запросами
      if (i < endIndex) {
        await this.sleep(this.delayBetweenRequests);
      }
    }
  }

  async addAllProducts() {
    console.log("🚀 Начинаю добавление товаров в MockAPI");
    console.log("========================================");
    console.log(`📊 Всего товаров: ${this.totalProducts}`);
    console.log(`⚡ Размер пачки: ${this.batchSize}`);
    console.log(`⏱️  Задержка: ${this.delayBetweenRequests}мс`);
    console.log("========================================\n");

    const startTime = Date.now();

    // Добавляем товары пачками
    const totalBatches = Math.ceil(this.totalProducts / this.batchSize);

    for (let batch = 0; batch < totalBatches; batch++) {
      const startIndex = batch * this.batchSize + 1;
      const endIndex = Math.min(
        (batch + 1) * this.batchSize,
        this.totalProducts,
      );

      console.log(`\n🎯 Пачка ${batch + 1}/${totalBatches}`);
      console.log(`📦 Товары: ${startIndex} - ${endIndex}`);

      await this.addProductsBatch(startIndex, endIndex);

      // Пауза между пачками
      if (batch < totalBatches - 1) {
        console.log(`\n⏸️  Пауза между пачками...`);
        await this.sleep(1000);
      }
    }

    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);

    // Выводим итоги
    console.log("\n" + "=".repeat(50));
    console.log("📊 ИТОГОВАЯ СТАТИСТИКА");
    console.log("=".repeat(50));
    console.log(`✅ Успешно добавлено: ${this.successCount} товаров`);
    console.log(`❌ Ошибок: ${this.errorCount} товаров`);
    console.log(
      `📈 Эффективность: ${((this.successCount / this.totalProducts) * 100).toFixed(1)}%`,
    );
    console.log(`⏱️  Общее время: ${totalTime} секунд`);
    console.log(
      `📦 Средняя скорость: ${(this.totalProducts / totalTime).toFixed(2)} товаров/сек`,
    );

    if (this.errors.length > 0) {
      console.log("\n⚠️  Список ошибок:");
      this.errors.forEach((error) => {
        console.log(`   Товар ${error.index}: ${error.error}`);
      });
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 ПРОЦЕСС ЗАВЕРШЕН!");
    console.log("=".repeat(50));
    console.log(`🌐 API: ${this.apiUrl}`);
    console.log(`🔍 Проверить товары можно по ссылке выше`);

    // Выводим примеры добавленных товаров
    if (this.successCount > 0) {
      console.log("\n🛍️  Примеры добавленных товаров:");
      console.log("1. Мотошлемы - фильтры по типу, размеру, материалу");
      console.log("2. Мотоэкипировка - фильтры по типу, размеру, защите");
      console.log("3. Моторасходники - фильтры по категории, совместимости");
      console.log("4. Моторезина - фильтры по размеру, сезону, типу");
      console.log("5. Тюнинг - фильтры по типу, материалу, совместимости");
      console.log("6. Химия - фильтры по типу, объему, вязкости");
      console.log("7. Уценка - фильтры по причине уценки, состоянию");
      console.log("8. Зима - фильтры по типу, температурному диапазону");
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Метод для быстрой проверки API
  async testAPI() {
    try {
      console.log("🔍 Проверяю соединение с API...");
      const response = await fetch(this.apiUrl);
      if (response.ok) {
        const data = await response.json();
        console.log(
          `✅ API доступен, текущее количество товаров: ${data.length}`,
        );
        return true;
      } else {
        console.log(`⚠️  API недоступен: HTTP ${response.status}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Ошибка подключения: ${error.message}`);
      return false;
    }
  }
}

// Запуск скрипта
async function main() {
  const api = new ProductAPI();

  // Проверяем API перед началом
  const isAPIAvailable = await api.testAPI();

  if (!isAPIAvailable) {
    console.log("⚠️  Продолжаем, несмотря на ошибку подключения...");
  }

  console.log("\n" + "=".repeat(50));
  console.log("НАЧИНАЮ ДОБАВЛЕНИЕ 100 ТОВАРОВ");
  console.log("=".repeat(50));

  // Запускаем добавление товаров
  await api.addAllProducts();
}

// Обработка ошибок при запуске
main().catch((error) => {
  console.error("\n🔥 КРИТИЧЕСКАЯ ОШИБКА:", error);
  console.error("Стек вызовов:", error.stack);
});

// Экспортируем функции для использования в других файлах
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateProduct,
    ProductAPI,
    main,
  };
}
