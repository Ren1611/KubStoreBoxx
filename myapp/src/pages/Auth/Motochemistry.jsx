import React, { useEffect, useState } from "react";
import { useProduct } from "../../MainContext/MainContext";
import { Link } from "react-router-dom";
import {
  formatPriceWithCurrency,
  calculateItemTotal,
} from "../../utils/priceFormatter";
import scss from "./Motochemistry.module.scss";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaTimes,
  FaShoppingCart,
  FaHeart,
  FaCheck,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

// Компонент уведомления
const Notification = React.memo(({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className={scss.notificationIconSuccess} />;
      case "info":
        return <FaInfoCircle className={scss.notificationIconInfo} />;
      default:
        return <FaInfoCircle className={scss.notificationIconDefault} />;
    }
  };

  return (
    <div className={`${scss.notification} ${scss[`notification${type}`]}`}>
      {getIcon()}
      <span className={scss.notificationMessage}>{message}</span>
      <button className={scss.notificationClose} onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
});

Notification.displayName = "Notification";

const Motochemistry = () => {
  const { t } = useTranslation();

  const {
    getProducts,
    products,
    loading,
    addOrder,
    addFavorit,
    favorit,
    readFavorit,
  } = useProduct();

  // Основные фильтры
  const [query, setQuery] = useState("");
  const [inStock, setInStock] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);

  // Фильтры для химии
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedViscosity, setSelectedViscosity] = useState(new Set());
  const [selectedSpecifications, setSelectedSpecifications] = useState(
    new Set(),
  );
  const [selectedBrakeFluids, setSelectedBrakeFluids] = useState(new Set());
  const [selectedChainLubes, setSelectedChainLubes] = useState(new Set());
  const [selectedCleaners, setSelectedCleaners] = useState(new Set());
  const [selectedPolishes, setSelectedPolishes] = useState(new Set());
  const [selectedVolumes, setSelectedVolumes] = useState(new Set());
  const [selectedPurposes, setSelectedPurposes] = useState(new Set());

  // Ценовой диапазон
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [currentPriceRange, setCurrentPriceRange] = useState({
    min: 0,
    max: 50000,
  });

  // Динамические данные из продуктов
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableViscosity, setAvailableViscosity] = useState([]);
  const [availableSpecifications, setAvailableSpecifications] = useState([]);
  const [availableBrakeFluids, setAvailableBrakeFluids] = useState([]);
  const [availableChainLubes, setAvailableChainLubes] = useState([]);
  const [availableCleaners, setAvailableCleaners] = useState([]);
  const [availablePolishes, setAvailablePolishes] = useState([]);
  const [availableVolumes, setAvailableVolumes] = useState([]);
  const [availablePurposes, setAvailablePurposes] = useState([]);

  // Фильтрованные продукты
  const [filtered, setFiltered] = useState([]);

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Сортировка
  const [sortBy, setSortBy] = useState("default");

  // Уведомления
  const [notifications, setNotifications] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  // Получение продуктов
  useEffect(() => {
    getProducts();
    readFavorit();
  }, []);

  // Загрузка избранного из localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorit")) || [];
    const favoriteSet = new Set(storedFavorites.map((item) => item.id));
    setFavorites(favoriteSet);
  }, [favorit]);

  // Извлечение данных из продуктов для фильтров
  useEffect(() => {
    if (!products) return;

    // Находим товары категории "Мотохимия"
    const chemistryProducts = products.filter(
      (p) => p.category === "Мотохимия",
    );

    console.log("Всего химии:", chemistryProducts.length);

    if (chemistryProducts.length > 0) {
      // Находим цены только для химии
      const prices = chemistryProducts
        .map((p) => parseFloat(p.price) || 0)
        .filter((p) => p > 0);

      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices) / 100) * 100;
        const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100;
        setPriceRange({ min: minPrice, max: maxPrice });
        setCurrentPriceRange({ min: minPrice, max: maxPrice });
      }

      // Извлекаем уникальные значения для фильтров
      const uniqueBrands = new Set();
      const uniqueTypes = new Set();
      const uniqueViscosity = new Set();
      const uniqueSpecifications = new Set();
      const uniqueBrakeFluids = new Set();
      const uniqueChainLubes = new Set();
      const uniqueCleaners = new Set();
      const uniquePolishes = new Set();
      const uniqueVolumes = new Set();
      const uniquePurposes = new Set();

      chemistryProducts.forEach((product) => {
        // Бренды
        if (product.brand) uniqueBrands.add(product.brand);

        // Типы химии
        if (product.chemistryType) uniqueTypes.add(product.chemistryType);

        // Вязкость
        if (product.viscosity) uniqueViscosity.add(product.viscosity);

        // Спецификации
        if (product.specification)
          uniqueSpecifications.add(product.specification);

        // Тормозная жидкость
        if (product.brakeFluidType)
          uniqueBrakeFluids.add(product.brakeFluidType);

        // Цепная смазка
        if (product.chainLubeType) uniqueChainLubes.add(product.chainLubeType);

        // Очистители
        if (product.cleanerType) uniqueCleaners.add(product.cleanerType);

        // Полироли
        if (product.polishType) uniquePolishes.add(product.polishType);

        // Объем
        if (product.volume) uniqueVolumes.add(product.volume);

        // Назначение
        if (product.purpose) uniquePurposes.add(product.purpose);
      });

      console.log("Найденные бренды химии:", Array.from(uniqueBrands));
      console.log("Найденные типы химии:", Array.from(uniqueTypes));
      console.log("Найденные объемы:", Array.from(uniqueVolumes));

      // Сортируем и устанавливаем значения
      setAvailableBrands(Array.from(uniqueBrands).sort());
      setAvailableTypes(Array.from(uniqueTypes).sort());
      setAvailableViscosity(Array.from(uniqueViscosity).sort());
      setAvailableSpecifications(Array.from(uniqueSpecifications).sort());
      setAvailableBrakeFluids(Array.from(uniqueBrakeFluids).sort());
      setAvailableChainLubes(Array.from(uniqueChainLubes).sort());
      setAvailableCleaners(Array.from(uniqueCleaners).sort());
      setAvailablePolishes(Array.from(uniquePolishes).sort());
      setAvailableVolumes(Array.from(uniqueVolumes).sort());
      setAvailablePurposes(Array.from(uniquePurposes).sort());
    }
  }, [products]);

  // Обработчики уведомлений
  const showNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  // Функции для переключения фильтров
  const toggleType = (type) => {
    const copy = new Set(selectedTypes);
    if (copy.has(type)) copy.delete(type);
    else copy.add(type);
    setSelectedTypes(copy);
  };

  const toggleBrand = (brand) => {
    const copy = new Set(selectedBrands);
    if (copy.has(brand)) copy.delete(brand);
    else copy.add(brand);
    setSelectedBrands(copy);
  };

  const toggleViscosity = (viscosity) => {
    const copy = new Set(selectedViscosity);
    if (copy.has(viscosity)) copy.delete(viscosity);
    else copy.add(viscosity);
    setSelectedViscosity(copy);
  };

  const toggleSpecification = (spec) => {
    const copy = new Set(selectedSpecifications);
    if (copy.has(spec)) copy.delete(spec);
    else copy.add(spec);
    setSelectedSpecifications(copy);
  };

  const toggleBrakeFluid = (type) => {
    const copy = new Set(selectedBrakeFluids);
    if (copy.has(type)) copy.delete(type);
    else copy.add(type);
    setSelectedBrakeFluids(copy);
  };

  const toggleChainLube = (type) => {
    const copy = new Set(selectedChainLubes);
    if (copy.has(type)) copy.delete(type);
    else copy.add(type);
    setSelectedChainLubes(copy);
  };

  const toggleCleaner = (type) => {
    const copy = new Set(selectedCleaners);
    if (copy.has(type)) copy.delete(type);
    else copy.add(type);
    setSelectedCleaners(copy);
  };

  const togglePolish = (type) => {
    const copy = new Set(selectedPolishes);
    if (copy.has(type)) copy.delete(type);
    else copy.add(type);
    setSelectedPolishes(copy);
  };

  const toggleVolume = (volume) => {
    const copy = new Set(selectedVolumes);
    if (copy.has(volume)) copy.delete(volume);
    else copy.add(volume);
    setSelectedVolumes(copy);
  };

  const togglePurpose = (purpose) => {
    const copy = new Set(selectedPurposes);
    if (copy.has(purpose)) copy.delete(purpose);
    else copy.add(purpose);
    setSelectedPurposes(copy);
  };

  // Очистка всех фильтров
  const clearAllFilters = () => {
    setQuery("");
    setInStock(false);
    setDiscountOnly(false);
    setSelectedTypes(new Set());
    setSelectedBrands(new Set());
    setSelectedViscosity(new Set());
    setSelectedSpecifications(new Set());
    setSelectedBrakeFluids(new Set());
    setSelectedChainLubes(new Set());
    setSelectedCleaners(new Set());
    setSelectedPolishes(new Set());
    setSelectedVolumes(new Set());
    setSelectedPurposes(new Set());
    setCurrentPriceRange(priceRange);
    setCurrentPage(1);
    showNotification(t("motochemistry_notifications_filters_cleared"), "info");
  };

  // Очистка конкретного фильтра
  const clearFilter = (filterName) => {
    switch (filterName) {
      case "types":
        setSelectedTypes(new Set());
        break;
      case "brands":
        setSelectedBrands(new Set());
        break;
      case "viscosity":
        setSelectedViscosity(new Set());
        break;
      case "specifications":
        setSelectedSpecifications(new Set());
        break;
      case "brakeFluids":
        setSelectedBrakeFluids(new Set());
        break;
      case "chainLubes":
        setSelectedChainLubes(new Set());
        break;
      case "cleaners":
        setSelectedCleaners(new Set());
        break;
      case "polishes":
        setSelectedPolishes(new Set());
        break;
      case "volumes":
        setSelectedVolumes(new Set());
        break;
      case "purposes":
        setSelectedPurposes(new Set());
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  // Проверка, находится ли товар в избранном
  const isInFavorites = (productId) => {
    return favorites.has(productId);
  };

  // Применение фильтрации
  useEffect(() => {
    if (!products) return;

    let filteredProducts = products.filter((product) => {
      // Проверяем, относится ли продукт к химии
      const isChemistry = product.category === "Мотохимия";

      if (!isChemistry) return false;

      // Фильтр по поиску
      const searchQuery = query.trim().toLowerCase();
      if (searchQuery) {
        const title = (product.name || product.title || "").toLowerCase();
        const desc = (product.description || "").toLowerCase();
        const brand = (product.brand || "").toLowerCase();
        const type = (product.chemistryType || "").toLowerCase();

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

      // Фильтр по типам химии
      if (selectedTypes.size > 0) {
        const chemistryType = product.chemistryType || "";
        if (chemistryType === "" || !selectedTypes.has(chemistryType)) {
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

      // Фильтр по вязкости
      if (selectedViscosity.size > 0) {
        const viscosity = product.viscosity || "";
        if (viscosity === "" || !selectedViscosity.has(viscosity)) {
          return false;
        }
      }

      // Фильтр по спецификациям
      if (selectedSpecifications.size > 0) {
        const specification = product.specification || "";
        if (
          specification === "" ||
          !selectedSpecifications.has(specification)
        ) {
          return false;
        }
      }

      // Фильтр по тормозной жидкости
      if (selectedBrakeFluids.size > 0) {
        const brakeFluidType = product.brakeFluidType || "";
        if (brakeFluidType === "" || !selectedBrakeFluids.has(brakeFluidType)) {
          return false;
        }
      }

      // Фильтр по цепной смазке
      if (selectedChainLubes.size > 0) {
        const chainLubeType = product.chainLubeType || "";
        if (chainLubeType === "" || !selectedChainLubes.has(chainLubeType)) {
          return false;
        }
      }

      // Фильтр по очистителям
      if (selectedCleaners.size > 0) {
        const cleanerType = product.cleanerType || "";
        if (cleanerType === "" || !selectedCleaners.has(cleanerType)) {
          return false;
        }
      }

      // Фильтр по полиролям
      if (selectedPolishes.size > 0) {
        const polishType = product.polishType || "";
        if (polishType === "" || !selectedPolishes.has(polishType)) {
          return false;
        }
      }

      // Фильтр по объему
      if (selectedVolumes.size > 0) {
        const volume = product.volume || "";
        if (volume === "" || !selectedVolumes.has(volume)) {
          return false;
        }
      }

      // Фильтр по назначению
      if (selectedPurposes.size > 0) {
        const purpose = product.purpose || "";
        if (purpose === "" || !selectedPurposes.has(purpose)) {
          return false;
        }
      }

      return true;
    });

    console.log("Фильтрованная химия:", filteredProducts.length);

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
        case "popularity":
          return (b.popularity || 0) - (a.popularity || 0);
        case "volume":
          const volumeA = parseFloat(a.volume) || 0;
          const volumeB = parseFloat(b.volume) || 0;
          return volumeB - volumeA;
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
    selectedTypes,
    selectedBrands,
    selectedViscosity,
    selectedSpecifications,
    selectedBrakeFluids,
    selectedChainLubes,
    selectedCleaners,
    selectedPolishes,
    selectedVolumes,
    selectedPurposes,
    currentPriceRange,
    sortBy,
  ]);

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Обработчики для действий
  const handleAddToCart = (product) => {
    const productToAdd = {
      ...product,
      quantity: 1,
      addedAt: new Date().toISOString(),
    };
    addOrder(productToAdd);
    showNotification(
      t("motochemistry_notifications_added_to_cart", {
        name: product.name || product.title || t("motochemistry_product_title"),
      }),
      "success",
    );
  };

  const handleAddToFavorites = (product) => {
    if (isInFavorites(product.id)) {
      // Если товар уже в избранном, удаляем его
      const favorites = JSON.parse(localStorage.getItem("favorit")) || [];
      const updatedFavorites = favorites.filter(
        (item) => item.id !== product.id,
      );
      localStorage.setItem("favorit", JSON.stringify(updatedFavorites));
      const newFavoriteSet = new Set(favorites);
      newFavoriteSet.delete(product.id);
      setFavorites(newFavoriteSet);
      readFavorit();
      showNotification(
        t("motochemistry_notifications_favorites_removed"),
        "info",
      );
    } else {
      addFavorit(product);
      const newFavoriteSet = new Set(favorites);
      newFavoriteSet.add(product.id);
      setFavorites(newFavoriteSet);
      showNotification(
        t("motochemistry_notifications_favorites_added"),
        "success",
      );
    }
  };

  // Генерация номеров страниц
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

    if (selectedTypes.size > 0) {
      activeFilters.push(
        <span key="types" className={scss.activeFilter}>
          {t("motochemistry_filters_chemistry_type")}:{" "}
          {Array.from(selectedTypes).join(", ")}
          <button onClick={() => clearFilter("types")}>×</button>
        </span>,
      );
    }

    if (selectedBrands.size > 0) {
      activeFilters.push(
        <span key="brands" className={scss.activeFilter}>
          {t("motochemistry_filters_brand")}:{" "}
          {Array.from(selectedBrands).join(", ")}
          <button onClick={() => clearFilter("brands")}>×</button>
        </span>,
      );
    }

    if (selectedViscosity.size > 0) {
      activeFilters.push(
        <span key="viscosity" className={scss.activeFilter}>
          {t("motochemistry_filters_viscosity")}:{" "}
          {Array.from(selectedViscosity).join(", ")}
          <button onClick={() => clearFilter("viscosity")}>×</button>
        </span>,
      );
    }

    if (selectedVolumes.size > 0) {
      activeFilters.push(
        <span key="volumes" className={scss.activeFilter}>
          {t("motochemistry_filters_volume")}:{" "}
          {Array.from(selectedVolumes).join(", ")}
          <button onClick={() => clearFilter("volumes")}>×</button>
        </span>,
      );
    }

    if (selectedPurposes.size > 0) {
      activeFilters.push(
        <span key="purposes" className={scss.activeFilter}>
          {t("motochemistry_filters_purpose")}:{" "}
          {Array.from(selectedPurposes).join(", ")}
          <button onClick={() => clearFilter("purposes")}>×</button>
        </span>,
      );
    }

    if (discountOnly) {
      activeFilters.push(
        <span key="discount" className={scss.activeFilter}>
          {t("motochemistry_filters_with_discount")}
          <button onClick={() => setDiscountOnly(false)}>×</button>
        </span>,
      );
    }

    if (inStock) {
      activeFilters.push(
        <span key="stock" className={scss.activeFilter}>
          <FaCheck style={{ marginRight: 4 }} />
          {t("motochemistry_filters_in_stock")}
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
          {t("motochemistry_product_price")}: {currentPriceRange.min} -{" "}
          {currentPriceRange.max} {t("common_currency")}
          <button onClick={() => setCurrentPriceRange(priceRange)}>×</button>
        </span>,
      );
    }

    return activeFilters;
  };

  return (
    <div className={`${scss.categoryPage} ${scss.chemistryPage}`}>
      {/* Уведомления */}
      <div className={scss.notificationsContainer}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <div className="container">
        <div className={scss.pageHeader}>
          <h1>{t("motochemistry_title")}</h1>
          <p>{t("motochemistry_description")}</p>
        </div>

        <div className={scss.chemistryInner}>
          <aside className={scss.sidebar}>
            <div className={scss.filterBlock}>
              <div className={scss.filterHeader}>
                <h3>{t("motochemistry_filters_title")}</h3>
                <button className={scss.clearAll} onClick={clearAllFilters}>
                  {t("motochemistry_actions_clear_all")}
                </button>
              </div>

              {/* Поиск */}
              <div className={scss.filterSection}>
                <label className={scss.filterLabel}>
                  <span>{t("motochemistry_filters_search_placeholder")}</span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("motochemistry_filters_search_placeholder")}
                  />
                </label>
              </div>

              {/* Базовые фильтры */}
              <div className={scss.filterSection}>
                <h4>{t("motochemistry_filters_title")}</h4>
                <div className={scss.checkboxGroup}>
                  <label className={scss.customCheck}>
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={() => setInStock(!inStock)}
                    />
                    <span>{t("motochemistry_filters_in_stock")}</span>
                  </label>
                  <label className={scss.customCheck}>
                    <input
                      type="checkbox"
                      checked={discountOnly}
                      onChange={() => setDiscountOnly(!discountOnly)}
                    />
                    <span>{t("motochemistry_filters_with_discount")}</span>
                  </label>
                </div>
              </div>

              {/* Ценовой диапазон */}
              <div className={scss.filterSection}>
                <h4>
                  {t("motochemistry_filters_price_range")}:{" "}
                  {t("common_currency")}
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

              {/* Типы химии */}
              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motochemistry_filters_chemistry_type")}</h4>
                  {selectedTypes.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("types")}
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
                            checked={selectedTypes.has(type)}
                            onChange={() => toggleType(type)}
                          />
                          <span>{type}</span>
                        </label>
                      ))
                    : []}
                </div>
              </div>

              {/* Бренды */}
              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motochemistry_filters_brand")}</h4>
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
                    : []}
                </div>
              </div>

              {/* Назначение */}
              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motochemistry_filters_purpose")}</h4>
                  {selectedPurposes.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("purposes")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availablePurposes.length > 0
                    ? availablePurposes.map((purpose) => (
                        <label key={purpose} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedPurposes.has(purpose)}
                            onChange={() => togglePurpose(purpose)}
                          />
                          <span>{purpose}</span>
                        </label>
                      ))
                    : []}
                </div>
              </div>

              {/* Вязкость масла */}
              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motochemistry_filters_viscosity")}</h4>
                  {selectedViscosity.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("viscosity")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableViscosity.length > 0
                    ? availableViscosity.map((viscosity) => (
                        <label key={viscosity} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedViscosity.has(viscosity)}
                            onChange={() => toggleViscosity(viscosity)}
                          />
                          <span>{viscosity}</span>
                        </label>
                      ))
                    : []}
                </div>
              </div>

              {/* Спецификации */}
              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motochemistry_filters_specifications")}</h4>
                  {selectedSpecifications.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("specifications")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableSpecifications.length > 0
                    ? availableSpecifications.map((spec) => (
                        <label key={spec} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedSpecifications.has(spec)}
                            onChange={() => toggleSpecification(spec)}
                          />
                          <span>{spec}</span>
                        </label>
                      ))
                    : []}
                </div>
              </div>

              {/* Объемы */}
              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motochemistry_filters_volume")}</h4>
                  {selectedVolumes.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("volumes")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableVolumes.length > 0
                    ? availableVolumes.map((volume) => (
                        <label key={volume} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedVolumes.has(volume)}
                            onChange={() => toggleVolume(volume)}
                          />
                          <span>{volume}</span>
                        </label>
                      ))
                    : []}
                </div>
              </div>
            </div>
          </aside>

          <main className={scss.main}>
            <div className={scss.controls}>
              <div className={scss.resultsInfo}>
                <strong>{filtered.length}</strong>{" "}
                {t("motochemistry_results_found")}
                {renderActiveFilters().length > 0 && (
                  <div className={scss.activeFilters}>
                    <span>{t("motochemistry_filters_applied_filters")}:</span>
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
                  {t("motochemistry_sort_options_default")}:
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">
                      {t("motochemistry_sort_options_default_option")}
                    </option>
                    <option value="price-asc">
                      {t("motochemistry_sort_options_price_asc")}
                    </option>
                    <option value="price-desc">
                      {t("motochemistry_sort_options_price_desc")}
                    </option>
                    <option value="discount">
                      {t("motochemistry_sort_options_discount_desc")}
                    </option>
                    <option value="rating">
                      {t("motochemistry_sort_options_rating_desc")}
                    </option>
                    <option value="popularity">
                      {t("motochemistry_sort_options_popularity")}
                    </option>
                    <option value="volume">
                      {t("motochemistry_sort_options_volume")}
                    </option>
                  </select>
                </label>
              </div>
            </div>

            <div className={scss.productsGrid}>
              {loading ? (
                <div className={scss.loading}>
                  {t("motochemistry_results_loading")}
                </div>
              ) : currentItems.length === 0 ? (
                <div className={scss.noResults}>
                  <h3>{t("motochemistry_results_no_results_title")}</h3>
                  <p>{t("motochemistry_results_no_results_description")}</p>
                  <button onClick={clearAllFilters}>
                    {t("motochemistry_actions_clear_all")}
                  </button>
                </div>
              ) : (
                currentItems.map((product, index) => {
                  const hasDiscount = product.discount && product.discount > 0;
                  const finalPrice = hasDiscount
                    ? calculateItemTotal(product.price, product.discount)
                    : product.price;
                  const isFavorite = isInFavorites(product.id);

                  return (
                    <div key={product.id || index} className={scss.productCard}>
                      <div className={scss.cardImage}>
                        <img
                          src={product.image || "placeholder.jpg"}
                          alt={
                            product.name ||
                            product.title ||
                            t("motochemistry_product_title")
                          }
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60";
                          }}
                        />
                        <button
                          className={`${scss.favoriteBtn} ${
                            isFavorite ? scss.favoriteActive : ""
                          }`}
                          onClick={() => handleAddToFavorites(product)}
                          title={
                            isFavorite
                              ? t("motochemistry_actions_in_favorites")
                              : t("motochemistry_actions_add_to_favorites")
                          }
                        >
                          {isFavorite ? (
                            <FaHeart className={scss.favoriteIcon} />
                          ) : (
                            <img
                              src="./src/assets/icons/Wishlist (1).svg"
                              alt={t("motochemistry_actions_add_to_favorites")}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.innerHTML =
                                  "<FaHeart />";
                              }}
                            />
                          )}
                        </button>
                        {hasDiscount && (
                          <div className={scss.discountBadge}>
                            -{product.discount}%
                          </div>
                        )}
                        {product.inStock === false && (
                          <div className={scss.outOfStock}>
                            {t("motochemistry_product_out_of_stock")}
                          </div>
                        )}
                      </div>
                      <div className={scss.cardContent}>
                        <div className={scss.cardHeader}>
                          <div className={scss.brand}>{product.brand}</div>
                          {product.chemistryType && (
                            <div className={scss.type}>
                              {product.chemistryType}
                            </div>
                          )}
                        </div>
                        <h3 className={scss.title}>
                          {product.name ||
                            product.title ||
                            t("motochemistry_product_title")}
                        </h3>
                        <div className={scss.details}>
                          {product.volume && (
                            <span className={scss.detailItem}>
                              {t("motochemistry_product_volume")}:{" "}
                              {product.volume}
                            </span>
                          )}
                          {product.viscosity && (
                            <span className={scss.detailItem}>
                              {t("motochemistry_product_viscosity")}:{" "}
                              {product.viscosity}
                            </span>
                          )}
                          {product.specification && (
                            <span className={scss.detailItem}>
                              {t("motochemistry_product_specification")}:{" "}
                              {product.specification}
                            </span>
                          )}
                          {product.purpose && (
                            <span className={scss.detailItem}>
                              {t("motochemistry_product_purpose")}:{" "}
                              {product.purpose}
                            </span>
                          )}
                        </div>
                        <div className={scss.priceSection}>
                          <div className={scss.currentPrice}>
                            {formatPriceWithCurrency(finalPrice, "сом")}
                          </div>
                          {hasDiscount && (
                            <div className={scss.oldPrice}>
                              {formatPriceWithCurrency(product.price, "сом")}
                            </div>
                          )}
                        </div>
                        <div className={scss.cardActions}>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={scss.addToCart}
                            disabled={!product.inStock}
                          >
                            {t("motochemistry_actions_add_to_cart")}
                          </button>
                          <Link to={`/product/${product.id}`}>
                            <button className={scss.detailsBtn}>
                              {t("motochemistry_actions_view_details")}
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
                  {t("motochemistry_pagination_prev")}
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
                  {t("motochemistry_pagination_next")}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Motochemistry;
