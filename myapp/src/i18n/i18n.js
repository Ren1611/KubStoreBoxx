import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Базовые переводы для каждого языка
const baseTranslations = {
  en: {
    translation: {
      // Основные переводы, которые всегда нужны
      home_new_collection: "New Collection",
      home_modern_equipment: "Modern Equipment",
      home_discounts_40: "Discounts up to 40%",
      home_view_collection: "View Collection",
      categories_motorcycle_helmets: "Motorcycle Helmets",
      categories_motorcycle_equipment: "Motorcycle Equipment",
      notifications_added_to_cart: "Added to cart {{name}}",
      notifications_added_to_favorites: "Added to favorites",
      notifications_removed_from_favorites: "Removed from favorites",
      home_warranty_1_year: "Warranty 1 Year",
      home_official_warranty: "Official Warranty",
      home_payment_on_delivery: "Payment on Delivery",
      home_cash_or_card: "Cash or Card",
      home_support_24_7: "Support 24/7",
      home_always_available: "Always Available",
      home_bonus_program: "Bonus Program",
      home_cashback_15: "Cashback 15%",
      home_easy_return: "Easy Return",
      home_14_days_return: "14 days return",
      home_why_choose_us: "Why Choose Us",
      home_our_brands: "Our Brands",
      home_popular_categories: "Popular Categories",
      home_all_categories: "All Categories",
      home_best_sellers: "Best Sellers",
      home_view_all: "View All",
      home_new_arrivals: "New Arrivals",
      home_all_new: "All New",
      home_hot_offers: "Hot Offers",
      home_all_discounts: "All Discounts",
      home_details: "Details",
      home_choose_products: "Choose Products",
      home_buy_with_discount: "Buy with Discount",
      home_free_delivery: "Free Delivery",
      home_order_over_3000: "Order over 3000",
      home_fast_delivery: "Fast Delivery",
      home_summer_sales: "Summer Sales",
      home_prepare_sleigh: "Prepare Sleigh",
      home_special_prices: "Special Prices",
      products_add_to_cart: "Add to Cart",
      products_out_of_stock: "Out of Stock",
      home_go_to_slide: "Go to slide {{number}}",
      home_new: "New",
      home_best_seller: "Best Seller",
    },
  },
  ru: {
    translation: {
      home_new_collection: "Новая Коллекция",
      home_modern_equipment: "Современное Оборудование",
      home_discounts_40: "Скидки до 40%",
      home_view_collection: "Посмотреть Коллекцию",
      categories_motorcycle_helmets: "Мотошлемы",
      categories_motorcycle_equipment: "Мотоэкипировка",
      notifications_added_to_cart: "Добавлено в корзину {{name}}",
      notifications_added_to_favorites: "Добавлено в избранное",
      notifications_removed_from_favorites: "Удалено из избранного",
      home_warranty_1_year: "Гарантия 1 Год",
      home_official_warranty: "Официальная Гарантия",
      home_payment_on_delivery: "Оплата при Доставке",
      home_cash_or_card: "Наличные или Карта",
      home_support_24_7: "Поддержка 24/7",
      home_always_available: "Всегда Доступны",
      home_bonus_program: "Бонусная Программа",
      home_cashback_15: "Кэшбэк 15%",
      home_easy_return: "Легкий Возврат",
      home_14_days_return: "Возврат 14 дней",
      home_why_choose_us: "Почему Выбирают Нас",
      home_our_brands: "Наши Бренды",
      home_popular_categories: "Популярные Категории",
      home_all_categories: "Все Категории",
      home_best_sellers: "Бестселлеры",
      home_view_all: "Смотреть Все",
      home_new_arrivals: "Новые Поступления",
      home_all_new: "Все Новинки",
      home_hot_offers: "Горячие Предложения",
      home_all_discounts: "Все Скидки",
      home_details: "Подробнее",
      home_choose_products: "Выбрать Товары",
      home_buy_with_discount: "Купить со Скидкой",
      home_free_delivery: "Бесплатная Доставка",
      home_order_over_3000: "Заказ от 3000",
      home_fast_delivery: "Быстрая Доставка",
      home_summer_sales: "Летние Распродажи",
      home_prepare_sleigh: "Готовь Сани Летом",
      home_special_prices: "Специальные Цены",
      products_add_to_cart: "Добавить в Корзину",
      products_out_of_stock: "Нет в Наличии",
      home_go_to_slide: "Перейти к слайду {{number}}",
      home_new: "Новинка",
      home_best_seller: "Бестселлер",
    },
  },
  ky: {
    translation: {
      home_new_collection: "Жаңы Топтом",
      home_modern_equipment: "Заманбап Жабдуу",
      home_discounts_40: "40% чейин эсептөө",
      home_view_collection: "Топтомду Көрүү",
      categories_motorcycle_helmets: "Мотошлемдер",
      categories_motorcycle_equipment: "Мотоэкипировка",
      notifications_added_to_cart: "Себетке кошулду {{name}}",
      notifications_added_to_favorites: "Сүйүктүүлөргө кошулду",
      notifications_removed_from_favorites: "Сүйүктүүлөрдөн өчүрүлдү",
      home_warranty_1_year: "Кепилдик 1 Жыл",
      home_official_warranty: "Расмий Кепилдик",
      home_payment_on_delivery: "Жеткирүүдө төлөө",
      home_cash_or_card: "Накта же Карта",
      home_support_24_7: "Колдоо 24/7",
      home_always_available: "Ар дайым жеткиликтүү",
      home_bonus_program: "Бонус программасы",
      home_cashback_15: "Кэшбэк 15%",
      home_easy_return: "Оңой кайтаруу",
      home_14_days_return: "14 күнгө кайтаруу",
      home_why_choose_us: "Эмне үчүн бизди тандашат",
      home_our_brands: "Биздин Бренддер",
      home_popular_categories: "Популярдуу Категориялар",
      home_all_categories: "Бардык Категориялар",
      home_best_sellers: "Эң көп сатылгандар",
      home_view_all: "Баарын Көрүү",
      home_new_arrivals: "Жаңы Келгендер",
      home_all_new: "Бардык Жаңылыктар",
      home_hot_offers: "Ысык Сунуштар",
      home_all_discounts: "Бардык Эсептөөлөр",
      home_details: "Кененирээк",
      home_choose_products: "Продукцияларды Тандоо",
      home_buy_with_discount: "Эсептөө менен Сатып алуу",
      home_free_delivery: "Акысыз Жеткирүү",
      home_order_over_3000: "3000ден жогору заказ",
      home_fast_delivery: "Тез Жеткирүү",
      home_summer_sales: "Жайкы Сатылымдар",
      home_prepare_sleigh: "Жайында чыеңе даярда",
      home_special_prices: "Атайын Баа",
      products_add_to_cart: "Себетке кошуу",
      products_out_of_stock: "Камтылып калган жок",
      home_go_to_slide: "Слайдга өтүү {{number}}",
      home_new: "Жаңы",
      home_best_seller: "Эң көп сатылган",
    },
  },
};

// Функция для загрузки JSON переводов
const loadJSONTranslations = async () => {
  try {
    // В продакшене вы можете загружать эти файлы с сервера
    // Для примера, мы будем использовать статические импорты

    // Импортируем JSON файлы (это работает в Vite/Webpack)
    const enTranslations = await import("./locales/en/translation.json");
    const ruTranslations = await import("./locales/ru/translation.json");
    const kyTranslations = await import("./locales/ky/translation.json");

    // Объединяем базовые переводы с JSON переводами
    const resources = {
      en: {
        translation: {
          ...baseTranslations.en.translation,
          ...enTranslations.default,
        },
      },
      ru: {
        translation: {
          ...baseTranslations.ru.translation,
          ...ruTranslations.default,
        },
      },
      ky: {
        translation: {
          ...baseTranslations.ky.translation,
          ...kyTranslations.default,
        },
      },
    };

    return resources;
  } catch (error) {
    console.error("Error loading JSON translations:", error);
    return baseTranslations; // Возвращаем базовые переводы в случае ошибки
  }
};

// Асинхронная инициализация i18next
const initializeI18n = async () => {
  const resources = await loadJSONTranslations();

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "ru",
      lng: "ru", // язык по умолчанию
      debug: process.env.NODE_ENV === "development",
      interpolation: {
        escapeValue: false, // React уже экранирует значения
      },
      nsSeparator: false,
      keySeparator: ".",

      // Настройки детектора языка
      detection: {
        order: ["localStorage", "cookie", "htmlTag", "navigator", "path"],
        caches: ["localStorage", "cookie"],
        lookupLocalStorage: "i18nextLng",
        lookupCookie: "i18next",
      },

      // Настройки React
      react: {
        useSuspense: false,
        bindI18n: "languageChanged loaded",
        bindI18nStore: "added removed",
      },
    });

  return i18n;
};

// Создаем экземпляр i18n и экспортируем его
export const i18nInstance = initializeI18n();

export default i18n;
