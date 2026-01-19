/**
 * @param {any} price
 * @returns {number}
 */
export const formatPrice = (price) => {
  if (typeof price === "number" && !isNaN(price)) {
    return Math.round(price * 100) / 100;
  }

  if (price === null || price === undefined || price === "") {
    return 0;
  }

  if (typeof price === "string") {
    let cleaned = price.replace(/[^\d.,-]/g, "");

    const hasComma = cleaned.includes(",");
    const hasDot = cleaned.includes(".");

    if (hasComma && hasDot) {
      const lastSeparator = Math.max(
        cleaned.lastIndexOf(","),
        cleaned.lastIndexOf("."),
      );
      cleaned =
        cleaned.substring(0, lastSeparator).replace(/[.,]/g, "") +
        cleaned.substring(lastSeparator);
    }

    cleaned = cleaned.replace(",", ".");

    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    const parsed = parseFloat(cleaned);

    return !isNaN(parsed) ? Math.round(parsed * 100) / 100 : 0;
  }

  const parsed = parseFloat(price);
  return !isNaN(parsed) ? Math.round(parsed * 100) / 100 : 0;
};

/**

 * @param {any} price 
 * @returns {string} 
 */
export const formatPriceDisplay = (price) => {
  const numPrice = formatPrice(price);
  return numPrice.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * @param {any} price
 * @param {any} discount
 * @returns {number}
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
 * @param {any} price
 * @param {string} currency
 * @returns {string}
 */
export const formatPriceWithCurrency = (price, currency = "сом") => {
  const formatted = formatPriceDisplay(price);
  return `${formatted} ${currency}`;
};
