/**
 * Преобразует цену в число, очищая от лишних символов
 * @param {any} price - Цена в любом формате
 * @returns {number} - Числовое значение цены
 */
export const formatPrice = (price) => {
  // Если цена уже число, возвращаем его
  if (typeof price === "number" && !isNaN(price)) {
    return Math.round(price * 100) / 100; // Округляем до 2 знаков
  }

  // Если цена не определена, возвращаем 0
  if (price === null || price === undefined || price === "") {
    return 0;
  }

  // Если это строка
  if (typeof price === "string") {
    // Удаляем все символы кроме цифр, точек, запятых и минуса
    let cleaned = price.replace(/[^\d.,-]/g, "");

    // Удаляем все символы кроме последней точки или запятой
    const hasComma = cleaned.includes(",");
    const hasDot = cleaned.includes(".");

    if (hasComma && hasDot) {
      // Если есть и точка и запятая, оставляем последний разделитель
      const lastSeparator = Math.max(
        cleaned.lastIndexOf(","),
        cleaned.lastIndexOf(".")
      );
      cleaned =
        cleaned.substring(0, lastSeparator).replace(/[.,]/g, "") +
        cleaned.substring(lastSeparator);
    }

    // Заменяем запятую на точку
    cleaned = cleaned.replace(",", ".");

    // Удаляем лишние точки (оставляем только первую)
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    // Парсим в число
    const parsed = parseFloat(cleaned);

    // Если парсинг удался, возвращаем число, иначе 0
    return !isNaN(parsed) ? Math.round(parsed * 100) / 100 : 0;
  }

  // Пытаемся преобразовать в число
  const parsed = parseFloat(price);
  return !isNaN(parsed) ? Math.round(parsed * 100) / 100 : 0;
};

/**
 * Форматирует цену для отображения
 * @param {any} price - Цена
 * @returns {string} - Отформатированная цена
 */
export const formatPriceDisplay = (price) => {
  const numPrice = formatPrice(price);
  return numPrice.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * Рассчитывает цену со скидкой
 * @param {any} price - Исходная цена
 * @param {any} discount - Скидка в процентах
 * @returns {number} - Цена со скидкой
 */
export const calculateItemTotal = (price, discount) => {
  const numPrice = formatPrice(price);
  const numDiscount = formatPrice(discount);

  if (numDiscount > 0 && numDiscount <= 100) {
    return Math.round(numPrice * (1 - numDiscount / 100) * 100) / 100;
  }

  return numPrice;
};

/**
 * Форматирует цену с валютой для отображения
 * @param {any} price - Цена
 * @param {string} currency - Валюта (по умолчанию "сом")
 * @returns {string} - "25 000 сом"
 */
export const formatPriceWithCurrency = (price, currency = "сом") => {
  const formatted = formatPriceDisplay(price);
  return `${formatted} ${currency}`;
};
