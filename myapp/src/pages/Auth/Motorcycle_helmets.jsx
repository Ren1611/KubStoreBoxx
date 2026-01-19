import React, { useEffect, useState } from "react";
import { useProduct } from "../../MainContext/MainContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  formatPriceWithCurrency,
  calculateItemTotal,
} from "../../utils/priceFormatter";
import scss from "./Motorcycle_helmets.module.scss";

const HelmetTypes = [
  "Интегральный (Full Face)",
  "Интегральный",
  "Открытый (Open Face)",
  "Открытый",
  "Модульный (Flip-up)",
  "Модульный",
  "Кроссовый (Motocross)",
  "Кроссовый",
  "Двойного назначения (Dual Sport)",
  "Двойного назначения",
  "Спортивный (Race)",
  "Спортивный",
  "Туристический (Tour)",
  "Туристический",
  "Классический (Classic)",
  "Классический",
  "Кастом (Custom)",
  "Карбоновый",
];

const HelmetCertifications = [
  "ECE 22/05",
  "ECE 22/06",
  "DOT",
  "SHARP",
  "SNELL",
  "FIM",
  "JIS",
  "ACU Gold",
  "AS/NZS",
  "SHARP 4*",
  "SHARP 5*",
  "SNELL M2020",
];

const VisorTypes = [
  "Прозрачный",
  "Тонированный",
  "Зеркальный",
  "Фотохромный",
  "Желтый",
  "Голубой",
  "Дымчатый",
  "Радужный",
  "С защитой от царапин",
  "Антизапотевающий",
];

const HelmetSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Универсальный"];

const HelmetMaterials = [
  "Поликарбонат",
  "Стекловолокно",
  "Карбон",
  "Композит",
  "ABS пластик",
  "Углепластик",
  "Кевлар",
  "Арамид",
  "Титановый сплав",
];

const Motorcycle_helmets = () => {
  const { getProducts, products, loading, addOrder, addFavorit } = useProduct();
  const { t } = useTranslation();

  // Основные фильтры
  const [query, setQuery] = useState("");
  const [inStock, setInStock] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);

  // Фильтры для шлемов
  const [selectedHelmetTypes, setSelectedHelmetTypes] = useState(new Set());
  const [selectedCertifications, setSelectedCertifications] = useState(
    new Set(),
  );
  const [selectedVisorTypes, setSelectedVisorTypes] = useState(new Set());
  const [selectedSizes, setSelectedSizes] = useState(new Set());
  const [selectedMaterials, setSelectedMaterials] = useState(new Set());

  // Ценовой диапазон
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [currentPriceRange, setCurrentPriceRange] = useState({
    min: 0,
    max: 100000,
  });

  // Динамические данные из продуктов
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableCertifications, setAvailableCertifications] = useState([]);
  const [availableVisorTypes, setAvailableVisorTypes] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);

  const [selectedBrands, setSelectedBrands] = useState(new Set());

  // Фильтрованные продукты
  const [filtered, setFiltered] = useState([]);

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Сортировка
  const [sortBy, setSortBy] = useState("default");

  // Уведомления
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // 'cart' или 'favorite'
  });

  // Получение продуктов
  useEffect(() => {
    getProducts();
  }, []);

  // Извлечение данных из продуктов для фильтров
  useEffect(() => {
    if (!products) return;

    // Находим товары категории "Мотошлемы"
    const helmetProducts = products.filter((p) => p.category === "Мотошлемы");

    console.log("Всего шлемов:", helmetProducts.length);

    if (helmetProducts.length > 0) {
      // Находим цены только для шлемов
      const prices = helmetProducts
        .map((p) => parseFloat(p.price) || 0)
        .filter((p) => p > 0);

      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices) / 1000) * 1000;
        const maxPrice = Math.ceil(Math.max(...prices) / 1000) * 1000;
        setPriceRange({ min: minPrice, max: maxPrice });
        setCurrentPriceRange({ min: minPrice, max: maxPrice });
      }

      // Извлекаем уникальные значения для фильтров
      const uniqueBrands = new Set();
      const uniqueTypes = new Set();
      const uniqueCertifications = new Set();
      const uniqueVisorTypes = new Set();
      const uniqueSizes = new Set();
      const uniqueMaterials = new Set();

      helmetProducts.forEach((product) => {
        // Бренды
        if (product.brand) uniqueBrands.add(product.brand);

        // Типы шлемов
        if (product.helmetType) {
          uniqueTypes.add(product.helmetType);
        } else if (product.type) {
          uniqueTypes.add(product.type);
        }

        // Сертификации
        if (product.certification)
          uniqueCertifications.add(product.certification);

        // Типы визоров
        if (product.visorType) uniqueVisorTypes.add(product.visorType);

        // Размеры
        if (product.size) uniqueSizes.add(product.size);

        // Материалы
        if (product.material) uniqueMaterials.add(product.material);
      });

      console.log("Найденные бренды шлемов:", Array.from(uniqueBrands));
      console.log("Найденные типы шлемов:", Array.from(uniqueTypes));
      console.log("Найденные размеры:", Array.from(uniqueSizes));

      // Сортируем и устанавливаем значения
      setAvailableBrands(Array.from(uniqueBrands).sort());
      setAvailableTypes(Array.from(uniqueTypes).sort());
      setAvailableCertifications(Array.from(uniqueCertifications).sort());
      setAvailableVisorTypes(Array.from(uniqueVisorTypes).sort());
      setAvailableSizes(Array.from(uniqueSizes).sort());
      setAvailableMaterials(Array.from(uniqueMaterials).sort());
    }
  }, [products]);

  // Функции для переключения фильтров
  const toggleHelmetType = (type) => {
    const copy = new Set(selectedHelmetTypes);
    if (copy.has(type)) copy.delete(type);
    else copy.add(type);
    setSelectedHelmetTypes(copy);
  };

  const toggleCertification = (cert) => {
    const copy = new Set(selectedCertifications);
    if (copy.has(cert)) copy.delete(cert);
    else copy.add(cert);
    setSelectedCertifications(copy);
  };

  const toggleVisorType = (type) => {
    const copy = new Set(selectedVisorTypes);
    if (copy.has(type)) copy.delete(type);
    else copy.add(type);
    setSelectedVisorTypes(copy);
  };

  const toggleSize = (size) => {
    const copy = new Set(selectedSizes);
    if (copy.has(size)) copy.delete(size);
    else copy.add(size);
    setSelectedSizes(copy);
  };

  const toggleMaterial = (material) => {
    const copy = new Set(selectedMaterials);
    if (copy.has(material)) copy.delete(material);
    else copy.add(material);
    setSelectedMaterials(copy);
  };

  const toggleBrand = (brand) => {
    const copy = new Set(selectedBrands);
    if (copy.has(brand)) copy.delete(brand);
    else copy.add(brand);
    setSelectedBrands(copy);
  };

  // Очистка всех фильтров
  const clearAllFilters = () => {
    setQuery("");
    setInStock(false);
    setDiscountOnly(false);
    setSelectedHelmetTypes(new Set());
    setSelectedCertifications(new Set());
    setSelectedVisorTypes(new Set());
    setSelectedSizes(new Set());
    setSelectedMaterials(new Set());
    setSelectedBrands(new Set());
    setCurrentPriceRange(priceRange);
    setCurrentPage(1);
  };

  // Очистка конкретного фильтра
  const clearFilter = (filterName) => {
    switch (filterName) {
      case "helmetTypes":
        setSelectedHelmetTypes(new Set());
        break;
      case "certifications":
        setSelectedCertifications(new Set());
        break;
      case "visorTypes":
        setSelectedVisorTypes(new Set());
        break;
      case "sizes":
        setSelectedSizes(new Set());
        break;
      case "materials":
        setSelectedMaterials(new Set());
        break;
      case "brands":
        setSelectedBrands(new Set());
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  // Показать уведомление
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    });

    // Автоматически скрыть через 3 секунды
    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "",
      });
    }, 3000);
  };

  // Обработчики для действий
  const handleAddToCart = (product) => {
    const productToAdd = {
      ...product,
      quantity: 1,
      addedAt: new Date().toISOString(),
    };

    try {
      addOrder(productToAdd);
      showNotification(
        t("motorcycle_helmets_added_cart", {
          name: product.name || product.title || t("motorcycle_helmets_helmet"),
        }),
        "cart",
      );
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
      showNotification(t("motorcycle_helmets_add_cart_error"), "error");
    }
  };

  const handleAddToFavorites = (product) => {
    try {
      addFavorit(product);
      showNotification(
        t("motorcycle_helmets_added_favorites", {
          name: product.name || product.title || t("motorcycle_helmets_helmet"),
        }),
        "favorite",
      );
    } catch (error) {
      console.error("Ошибка при добавлении в избранное:", error);
      showNotification(t("motorcycle_helmets_add_favorites_error"), "error");
    }
  };

  // Применение фильтрации
  useEffect(() => {
    if (!products) return;

    let filteredProducts = products.filter((product) => {
      // Проверяем, относится ли продукт к шлемам ПО КАТЕГОРИИ
      const isHelmet = product.category === "Мотошлемы";

      if (!isHelmet) return false;

      // Фильтр по поиску
      const searchQuery = query.trim().toLowerCase();
      if (searchQuery) {
        const title = (product.name || product.title || "").toLowerCase();
        const desc = (product.description || "").toLowerCase();
        const brand = (product.brand || "").toLowerCase();
        const type = (product.helmetType || "").toLowerCase();

        if (
          !title.includes(searchQuery) &&
          !desc.includes(searchQuery) &&
          !brand.includes(searchQuery) &&
          !type.includes(searchQuery)
        ) {
          return false;
        }
      }

      // Фильтр по наличию
      if (inStock && !product.inStock) return false;

      // Фильтр по скидке
      if (discountOnly && (!product.discount || product.discount <= 0))
        return false;

      // Фильтр по цене
      const price = parseFloat(product.price) || 0;
      if (price < currentPriceRange.min || price > currentPriceRange.max) {
        return false;
      }

      // Фильтр по типам шлемов
      if (selectedHelmetTypes.size > 0) {
        const helmetType = product.helmetType || "";
        if (helmetType === "" || !selectedHelmetTypes.has(helmetType)) {
          return false;
        }
      }

      // Фильтр по брендам
      if (selectedBrands.size > 0) {
        const brand = product.brand || "";
        if (brand === "" || !selectedBrands.has(brand)) {
          return false;
        }
      }

      // Фильтр по сертификациям
      if (selectedCertifications.size > 0) {
        const certification = product.certification || "";
        if (
          certification === "" ||
          !selectedCertifications.has(certification)
        ) {
          return false;
        }
      }

      // Фильтр по типам визоров
      if (selectedVisorTypes.size > 0) {
        const visorType = product.visorType || "";
        if (visorType === "" || !selectedVisorTypes.has(visorType)) {
          return false;
        }
      }

      // Фильтр по размерам
      if (selectedSizes.size > 0) {
        const size = product.size || "";
        if (size === "" || !selectedSizes.has(size)) {
          return false;
        }
      }

      // Фильтр по материалам
      if (selectedMaterials.size > 0) {
        const material = product.material || "";
        if (material === "" || !selectedMaterials.has(material)) {
          return false;
        }
      }

      return true;
    });

    console.log("Фильтрованные шлемы:", filteredProducts.length);
    console.log("Выбранные бренды:", Array.from(selectedBrands));
    console.log("Выбранные типы:", Array.from(selectedHelmetTypes));

    // Сортировка
    filteredProducts.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case "price-desc":
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case "discount":
          return (b.discount || 0) - (a.discount || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFiltered(filteredProducts);
    setCurrentPage(1);
  }, [
    products,
    query,
    inStock,
    discountOnly,
    selectedHelmetTypes,
    selectedCertifications,
    selectedVisorTypes,
    selectedSizes,
    selectedMaterials,
    selectedBrands,
    currentPriceRange,
    sortBy,
  ]);

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Генерация номеров страниц (показываем только 5 страниц)
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = Math.min(totalPages, maxVisiblePages);
      }

      if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // Рендер активных фильтров
  const renderActiveFilters = () => {
    const activeFilters = [];

    if (selectedHelmetTypes.size > 0) {
      activeFilters.push(
        <span key="helmetTypes" className={scss.activeFilter}>
          {t("motorcycle_helmets_types")}:{" "}
          {Array.from(selectedHelmetTypes).join(", ")}
          <button onClick={() => clearFilter("helmetTypes")}>×</button>
        </span>,
      );
    }

    if (selectedBrands.size > 0) {
      activeFilters.push(
        <span key="brands" className={scss.activeFilter}>
          {t("motorcycle_helmets_brands")}:{" "}
          {Array.from(selectedBrands).join(", ")}
          <button onClick={() => clearFilter("brands")}>×</button>
        </span>,
      );
    }

    if (selectedSizes.size > 0) {
      activeFilters.push(
        <span key="sizes" className={scss.activeFilter}>
          {t("motorcycle_helmets_sizes")}:{" "}
          {Array.from(selectedSizes).join(", ")}
          <button onClick={() => clearFilter("sizes")}>×</button>
        </span>,
      );
    }

    if (selectedCertifications.size > 0) {
      activeFilters.push(
        <span key="certifications" className={scss.activeFilter}>
          {t("motorcycle_helmets_certifications")}:{" "}
          {Array.from(selectedCertifications).join(", ")}
          <button onClick={() => clearFilter("certifications")}>×</button>
        </span>,
      );
    }

    if (discountOnly) {
      activeFilters.push(
        <span key="discount" className={scss.activeFilter}>
          {t("motorcycle_helmets_only_discount")}
          <button onClick={() => setDiscountOnly(false)}>×</button>
        </span>,
      );
    }

    if (inStock) {
      activeFilters.push(
        <span key="stock" className={scss.activeFilter}>
          {t("motorcycle_helmets_stock")}
          <button onClick={() => setInStock(false)}>×</button>
        </span>,
      );
    }

    if (
      currentPriceRange.min > priceRange.min ||
      currentPriceRange.max < priceRange.max
    ) {
      activeFilters.push(
        <span key="price" className={scss.activeFilter}>
          {t("motorcycle_helmets_price")}: {currentPriceRange.min}{" "}
          {t("motorcycle_helmets_currency")} - {currentPriceRange.max}{" "}
          {t("motorcycle_helmets_currency")}
          <button onClick={() => setCurrentPriceRange(priceRange)}>×</button>
        </span>,
      );
    }

    return activeFilters;
  };

  return (
    <div className={`${scss.categoryPage} ${scss.helmetsPage}`}>
      {/* Компонент уведомления */}
      {notification.show && (
        <div className={`${scss.notification} ${scss[notification.type]}`}>
          <div className={scss.notificationContent}>
            {notification.type === "cart" && (
              <div className={scss.notificationIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
            )}
            {notification.type === "favorite" && (
              <div className={scss.notificationIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
            )}
            <div className={scss.notificationText}>{notification.message}</div>
            <button
              className={scss.notificationClose}
              onClick={() =>
                setNotification({ show: false, message: "", type: "" })
              }
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="container">
        <div className={scss.pageHeader}>
          <h1>{t("motorcycle_helmets_page_title")}</h1>
          <p>{t("motorcycle_helmets_page_description")}</p>
        </div>

        <div className={scss.helmetsInner}>
          <aside className={scss.sidebar}>
            <div className={scss.filterBlock}>
              <div className={scss.filterHeader}>
                <h3>{t("motorcycle_helmets_filters")}</h3>
                <button className={scss.clearAll} onClick={clearAllFilters}>
                  {t("motorcycle_helmets_clear_all")}
                </button>
              </div>

              {/* Поиск */}
              <div className={scss.filterSection}>
                <label className={scss.filterLabel}>
                  <span>{t("motorcycle_helmets_search_name")}</span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("motorcycle_helmets_search_placeholder")}
                  />
                </label>
              </div>

              {/* Базовые фильтры */}
              <div className={scss.filterSection}>
                <h4>{t("motorcycle_helmets_basic_filters")}</h4>
                <div className={scss.checkboxGroup}>
                  <label className={scss.customCheck}>
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={() => setInStock(!inStock)}
                    />
                    <span>{t("motorcycle_helmets_stock")}</span>
                  </label>
                  <label className={scss.customCheck}>
                    <input
                      type="checkbox"
                      checked={discountOnly}
                      onChange={() => setDiscountOnly(!discountOnly)}
                    />
                    <span>{t("motorcycle_helmets_only_discount")}</span>
                  </label>
                </div>
              </div>

              {/* Ценовой диапазон */}
              <div className={scss.filterSection}>
                <h4>
                  {t("motorcycle_helmets_price_range")}:{" "}
                  {t("motorcycle_helmets_currency")}
                </h4>
                <div className={scss.priceRange}>
                  <div className={scss.priceInputs}>
                    <input
                      type="number"
                      value={currentPriceRange.min}
                      onChange={(e) =>
                        setCurrentPriceRange({
                          ...currentPriceRange,
                          min: parseInt(e.target.value) || 0,
                        })
                      }
                      min={priceRange.min}
                      max={priceRange.max}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={currentPriceRange.max}
                      onChange={(e) =>
                        setCurrentPriceRange({
                          ...currentPriceRange,
                          max: parseInt(e.target.value) || priceRange.max,
                        })
                      }
                      min={priceRange.min}
                      max={priceRange.max}
                    />
                  </div>
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={currentPriceRange.max}
                    onChange={(e) =>
                      setCurrentPriceRange({
                        ...currentPriceRange,
                        max: parseInt(e.target.value),
                      })
                    }
                    className={scss.rangeSlider}
                  />
                </div>
              </div>

              {/* Типы шлемов */}
              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_helmets_helmet_types")}</h4>
                  {selectedHelmetTypes.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("helmetTypes")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableTypes.length > 0
                    ? availableTypes.map((type) => (
                        <label key={type} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedHelmetTypes.has(type)}
                            onChange={() => toggleHelmetType(type)}
                          />
                          <span>{type}</span>
                        </label>
                      ))
                    : HelmetTypes.map((type) => (
                        <label key={type} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedHelmetTypes.has(type)}
                            onChange={() => toggleHelmetType(type)}
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                </div>
              </div>

              {/* Бренды */}
              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_helmets_brands")}</h4>
                  {selectedBrands.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("brands")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableBrands.length > 0
                    ? availableBrands.map((brand) => (
                        <label key={brand} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedBrands.has(brand)}
                            onChange={() => toggleBrand(brand)}
                          />
                          <span>{brand}</span>
                        </label>
                      ))
                    : HelmetTypes.slice(0, 10).map((brand) => (
                        <label key={brand} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedBrands.has(brand)}
                            onChange={() => toggleBrand(brand)}
                          />
                          <span>{brand}</span>
                        </label>
                      ))}
                </div>
              </div>

              {/* Размеры */}
              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_helmets_sizes")}</h4>
                  {selectedSizes.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("sizes")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableSizes.length > 0
                    ? availableSizes.map((size) => (
                        <label key={size} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedSizes.has(size)}
                            onChange={() => toggleSize(size)}
                          />
                          <span>{size}</span>
                        </label>
                      ))
                    : HelmetSizes.map((size) => (
                        <label key={size} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedSizes.has(size)}
                            onChange={() => toggleSize(size)}
                          />
                          <span>{size}</span>
                        </label>
                      ))}
                </div>
              </div>

              {/* Сертификации */}
              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_helmets_certifications")}</h4>
                  {selectedCertifications.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("certifications")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableCertifications.length > 0
                    ? availableCertifications.map((cert) => (
                        <label key={cert} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedCertifications.has(cert)}
                            onChange={() => toggleCertification(cert)}
                          />
                          <span>{cert}</span>
                        </label>
                      ))
                    : HelmetCertifications.map((cert) => (
                        <label key={cert} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedCertifications.has(cert)}
                            onChange={() => toggleCertification(cert)}
                          />
                          <span>{cert}</span>
                        </label>
                      ))}
                </div>
              </div>

              {/* Материалы */}
              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_helmets_materials")}</h4>
                  {selectedMaterials.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("materials")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableMaterials.length > 0
                    ? availableMaterials.map((material) => (
                        <label key={material} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedMaterials.has(material)}
                            onChange={() => toggleMaterial(material)}
                          />
                          <span>{material}</span>
                        </label>
                      ))
                    : HelmetMaterials.map((material) => (
                        <label key={material} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedMaterials.has(material)}
                            onChange={() => toggleMaterial(material)}
                          />
                          <span>{material}</span>
                        </label>
                      ))}
                </div>
              </div>
            </div>
          </aside>

          <main className={scss.main}>
            <div className={scss.controls}>
              <div className={scss.resultsInfo}>
                <strong>{filtered.length}</strong>{" "}
                {t("motorcycle_helmets_products_found")}
                {renderActiveFilters().length > 0 && (
                  <div className={scss.activeFilters}>
                    <span>{t("motorcycle_helmets_filters")}:</span>
                    {renderActiveFilters().map((filter, index) => (
                      <React.Fragment key={index}>
                        {filter}
                        {index < renderActiveFilters().length - 1 && " "}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
              <div className={scss.sort}>
                <label>
                  {t("motorcycle_helmets_sort")}:
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">
                      {t("motorcycle_helmets_sort_default")}
                    </option>
                    <option value="price-asc">
                      {t("motorcycle_helmets_sort_price")}
                    </option>
                    <option value="price-desc">
                      {t("motorcycle_helmets_sort_price_1")}
                    </option>
                    <option value="discount">
                      {t("motorcycle_helmets_sort_discount")}
                    </option>
                    <option value="rating">
                      {t("motorcycle_helmets_sort_rating")}
                    </option>
                  </select>
                </label>
              </div>
            </div>

            <div className={scss.productsGrid}>
              {loading ? (
                <div className={scss.loading}>
                  {t("motorcycle_helmets_loading_helmets")}
                </div>
              ) : currentItems.length === 0 ? (
                <div className={scss.noResults}>
                  <h3>{t("motorcycle_helmets_results_title")}</h3>
                  <p>{t("motorcycle_helmets_results_description")}</p>
                  <button onClick={clearAllFilters}>
                    {t("motorcycle_helmets_reset_all")}
                  </button>
                </div>
              ) : (
                currentItems.map((product, index) => {
                  const hasDiscount = product.discount && product.discount > 0;
                  const finalPrice = hasDiscount
                    ? calculateItemTotal(product.price, product.discount)
                    : product.price;

                  return (
                    <div key={product.id || index} className={scss.productCard}>
                      <div className={scss.cardImage}>
                        <img
                          src={product.image || "placeholder.jpg"}
                          alt={
                            product.name ||
                            product.title ||
                            t("motorcycle_helmets_helmet")
                          }
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60";
                          }}
                        />
                        <button
                          className={scss.favoriteBtn}
                          onClick={() => handleAddToFavorites(product)}
                          aria-label={t("motorcycle_helmets_add_favorites")}
                        >
                          <img
                            src="./src/assets/icons/Wishlist (1).svg"
                            alt={t("motorcycle_helmets_add_favorites")}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </button>
                        {hasDiscount && (
                          <div className={scss.discountBadge}>
                            -{product.discount}%
                          </div>
                        )}
                        {product.inStock === false && (
                          <div className={scss.outOfStock}>
                            {t("motorcycle_helmets_out_stock")}
                          </div>
                        )}
                      </div>
                      <div className={scss.cardContent}>
                        <div className={scss.cardHeader}>
                          <div className={scss.brand}>{product.brand}</div>
                          {product.certification && (
                            <div className={scss.certification}>
                              {product.certification}
                            </div>
                          )}
                        </div>
                        <h3 className={scss.title}>
                          {product.name ||
                            product.title ||
                            t("motorcycle_helmets_helmet")}
                        </h3>
                        <div className={scss.details}>
                          {product.helmetType && (
                            <span className={scss.detailItem}>
                              {product.helmetType}
                            </span>
                          )}
                          {product.size && (
                            <span className={scss.detailItem}>
                              {t("motorcycle_helmets_size")}: {product.size}
                            </span>
                          )}
                          {product.material && (
                            <span className={scss.detailItem}>
                              {t("motorcycle_helmets_material")}:{" "}
                              {product.material}
                            </span>
                          )}
                          {product.visorType && (
                            <span className={scss.detailItem}>
                              {t("motorcycle_helmets_visor")}:{" "}
                              {product.visorType}
                            </span>
                          )}
                        </div>
                        <div className={scss.priceSection}>
                          <div className={scss.currentPrice}>
                            {formatPriceWithCurrency(finalPrice)}
                          </div>
                          {hasDiscount && (
                            <div className={scss.oldPrice}>
                              {formatPriceWithCurrency(product.price)}
                            </div>
                          )}
                        </div>
                        <div className={scss.cardActions}>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={scss.addToCart}
                            disabled={!product.inStock}
                          >
                            {t("motorcycle_helmets_add_cart")}
                          </button>
                          <Link to={`/product/${product.id}`}>
                            <button className={scss.detailsBtn}>
                              {t("motorcycle_helmets_details")}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className={scss.pagination}>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className={scss.paginationBtn}
                >
                  {t("motorcycle_helmets_back")}
                </button>

                <div className={scss.pageNumbers}>
                  {currentPage > 3 && totalPages > 5 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className={scss.pageBtn}
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className={scss.pageDots}>...</span>
                      )}
                    </>
                  )}

                  {generatePageNumbers().map((number) => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`${scss.pageBtn} ${
                        currentPage === number ? scss.active : ""
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className={scss.pageDots}>...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={scss.pageBtn}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={scss.paginationBtn}
                >
                  {t("motorcycle_helmets_next")}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Motorcycle_helmets;
