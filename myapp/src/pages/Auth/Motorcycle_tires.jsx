import React, { useEffect, useState } from "react";
import { useProduct } from "../../MainContext/MainContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  formatPriceWithCurrency,
  calculateItemTotal,
} from "../../utils/priceFormatter";
import scss from "./Motorcycle_tires.module.scss";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaTimes,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";

const Notification = React.memo(({ message, type, onClose, t }) => {
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

const TireTypes = [
  "Спортивная",
  "Туристическая",
  "Эндуро",
  "Кроссовая",
  "Городская",
  "Внедорожная",
  "Двойного назначения",
  "Чопперная",
  "Спорт-туризм",
  "Супермото",
];

// Бренды резины
const TireBrands = [
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
];

const TireSeasons = [
  "Летняя",
  "Всесезонная",
  "Зимняя (шипованная)",
  "Зимняя (нешипованная)",
  "Демисезонная",
];

const TireCompositions = [
  "Мягкая (софт)",
  "Средняя (медиум)",
  "Твердая (хард)",
  "Смешанный состав",
  "Радиальная",
  "Диагональная",
  "Бескамерная",
  "Камерная",
];

const TireTreadPatterns = [
  "Спортивный",
  "Дождевой",
  "Туристический",
  "Внедорожный",
  "Гладкий (слик)",
  "Полуслик",
  "Смешанный",
  "Асимметричный",
  "Направленный",
];

const SpeedIndexes = [
  "J (100 км/ч)",
  "K (110 км/ч)",
  "L (120 км/ч)",
  "M (130 км/ч)",
  "N (140 км/ч)",
  "P (150 км/ч)",
  "Q (160 км/ч)",
  "R (170 км/ч)",
  "S (180 км/ч)",
  "T (190 км/ч)",
  "U (200 км/ч)",
  "H (210 км/ч)",
  "V (240 км/ч)",
  "W (270 км/ч)",
  "Y (300 км/ч)",
];

const LoadIndexes = [
  "35 (121 кг)",
  "42 (150 кг)",
  "46 (160 кг)",
  "51 (195 кг)",
  "55 (218 кг)",
  "58 (236 кг)",
  "62 (265 кг)",
  "66 (300 кг)",
  "71 (345 кг)",
  "75 (387 кг)",
  "80 (450 кг)",
  "85 (515 кг)",
];

const TireSizes = [
  "120/70-17",
  "180/55-17",
  "190/50-17",
  "110/80-19",
  "90/90-21",
  "100/90-18",
  "130/80-17",
  "140/70-17",
  "150/70-17",
  "160/60-17",
  "170/60-17",
  "200/55-17",
  "80/90-21",
  "120/90-18",
  "130/90-16",
  "150/80-16",
  "90/90-10",
  "120/70-15",
  "140/60-13",
];

const Motorcycle_tires = () => {
  const {
    getProducts,
    products,
    loading,
    addOrder,
    addFavorit,
    favorit,
    readFavorit,
  } = useProduct();

  const { t } = useTranslation();

  const [query, setQuery] = useState("");
  const [inStock, setInStock] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedSeasons, setSelectedSeasons] = useState(new Set());
  const [selectedCompositions, setSelectedCompositions] = useState(new Set());
  const [selectedTreadPatterns, setSelectedTreadPatterns] = useState(new Set());
  const [selectedSizes, setSelectedSizes] = useState(new Set());
  const [selectedSpeedIndexes, setSelectedSpeedIndexes] = useState(new Set());
  const [selectedLoadIndexes, setSelectedLoadIndexes] = useState(new Set());

  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [currentPriceRange, setCurrentPriceRange] = useState({
    min: 0,
    max: 200000,
  });

  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [availableCompositions, setAvailableCompositions] = useState([]);
  const [availableTreadPatterns, setAvailableTreadPatterns] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableSpeedIndexes, setAvailableSpeedIndexes] = useState([]);
  const [availableLoadIndexes, setAvailableLoadIndexes] = useState([]);

  const [filtered, setFiltered] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const [sortBy, setSortBy] = useState("default");

  const [notifications, setNotifications] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    getProducts();
    readFavorit();
  }, []);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorit")) || [];
    const favoriteSet = new Set(storedFavorites.map((item) => item.id));
    setFavorites(favoriteSet);
  }, [favorit]);

  useEffect(() => {
    if (!products) return;

    const tireProducts = products.filter((p) => p.category === "Моторезина");

    console.log("Всего резины:", tireProducts.length);

    if (tireProducts.length > 0) {
      const prices = tireProducts
        .map((p) => parseFloat(p.price) || 0)
        .filter((p) => p > 0);

      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices) / 1000) * 1000;
        const maxPrice = Math.ceil(Math.max(...prices) / 1000) * 1000;
        setPriceRange({ min: minPrice, max: maxPrice });
        setCurrentPriceRange({ min: minPrice, max: maxPrice });
      }

      const uniqueBrands = new Set();
      const uniqueTypes = new Set();
      const uniqueSeasons = new Set();
      const uniqueCompositions = new Set();
      const uniqueTreadPatterns = new Set();
      const uniqueSizes = new Set();
      const uniqueSpeedIndexes = new Set();
      const uniqueLoadIndexes = new Set();

      tireProducts.forEach((product) => {
        if (product.brand) uniqueBrands.add(product.brand);

        if (product.tireType) uniqueTypes.add(product.tireType);

        if (product.season) uniqueSeasons.add(product.season);

        if (product.composition) uniqueCompositions.add(product.composition);

        if (product.treadPattern) uniqueTreadPatterns.add(product.treadPattern);

        if (product.tireSize) uniqueSizes.add(product.tireSize);

        if (product.speedIndex) uniqueSpeedIndexes.add(product.speedIndex);

        if (product.loadIndex) uniqueLoadIndexes.add(product.loadIndex);
      });

      console.log("Найденные бренды:", Array.from(uniqueBrands));
      console.log("Найденные типы:", Array.from(uniqueTypes));
      console.log("Найденные размеры:", Array.from(uniqueSizes));

      setAvailableBrands(Array.from(uniqueBrands).sort());
      setAvailableTypes(Array.from(uniqueTypes).sort());
      setAvailableSeasons(Array.from(uniqueSeasons).sort());
      setAvailableCompositions(Array.from(uniqueCompositions).sort());
      setAvailableTreadPatterns(Array.from(uniqueTreadPatterns).sort());
      setAvailableSizes(Array.from(uniqueSizes).sort());
      setAvailableSpeedIndexes(Array.from(uniqueSpeedIndexes).sort());
      setAvailableLoadIndexes(Array.from(uniqueLoadIndexes).sort());
    }
  }, [products]);

  const showNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

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

  const toggleSeason = (season) => {
    const copy = new Set(selectedSeasons);
    if (copy.has(season)) copy.delete(season);
    else copy.add(season);
    setSelectedSeasons(copy);
  };

  const toggleComposition = (composition) => {
    const copy = new Set(selectedCompositions);
    if (copy.has(composition)) copy.delete(composition);
    else copy.add(composition);
    setSelectedCompositions(copy);
  };

  const toggleTreadPattern = (pattern) => {
    const copy = new Set(selectedTreadPatterns);
    if (copy.has(pattern)) copy.delete(pattern);
    else copy.add(pattern);
    setSelectedTreadPatterns(copy);
  };

  const toggleSize = (size) => {
    const copy = new Set(selectedSizes);
    if (copy.has(size)) copy.delete(size);
    else copy.add(size);
    setSelectedSizes(copy);
  };

  const toggleSpeedIndex = (index) => {
    const copy = new Set(selectedSpeedIndexes);
    if (copy.has(index)) copy.delete(index);
    else copy.add(index);
    setSelectedSpeedIndexes(copy);
  };

  const toggleLoadIndex = (index) => {
    const copy = new Set(selectedLoadIndexes);
    if (copy.has(index)) copy.delete(index);
    else copy.add(index);
    setSelectedLoadIndexes(copy);
  };

  const clearAllFilters = () => {
    setQuery("");
    setInStock(false);
    setDiscountOnly(false);
    setSelectedTypes(new Set());
    setSelectedBrands(new Set());
    setSelectedSeasons(new Set());
    setSelectedCompositions(new Set());
    setSelectedTreadPatterns(new Set());
    setSelectedSizes(new Set());
    setSelectedSpeedIndexes(new Set());
    setSelectedLoadIndexes(new Set());
    setCurrentPriceRange(priceRange);
    setCurrentPage(1);
    showNotification(t("motorcycle_tires_filters_cleared"), "info");
  };

  const clearFilter = (filterName) => {
    switch (filterName) {
      case "types":
        setSelectedTypes(new Set());
        break;
      case "brands":
        setSelectedBrands(new Set());
        break;
      case "seasons":
        setSelectedSeasons(new Set());
        break;
      case "compositions":
        setSelectedCompositions(new Set());
        break;
      case "treadPatterns":
        setSelectedTreadPatterns(new Set());
        break;
      case "sizes":
        setSelectedSizes(new Set());
        break;
      case "speedIndexes":
        setSelectedSpeedIndexes(new Set());
        break;
      case "loadIndexes":
        setSelectedLoadIndexes(new Set());
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  const isInFavorites = (productId) => {
    return favorites.has(productId);
  };

  useEffect(() => {
    if (!products) return;

    let filteredProducts = products.filter((product) => {
      const isTire = product.category === "Моторезина";

      if (!isTire) return false;

      const searchQuery = query.trim().toLowerCase();
      if (searchQuery) {
        const title = (product.name || product.title || "").toLowerCase();
        const desc = (product.description || "").toLowerCase();
        const brand = (product.brand || "").toLowerCase();
        const size = (product.tireSize || "").toLowerCase();

        if (
          !title.includes(searchQuery) &&
          !desc.includes(searchQuery) &&
          !brand.includes(searchQuery) &&
          !size.includes(searchQuery)
        ) {
          return false;
        }
      }

      if (inStock && !product.inStock) return false;

      if (discountOnly && (!product.discount || product.discount <= 0))
        return false;

      const price = parseFloat(product.price) || 0;
      if (price < currentPriceRange.min || price > currentPriceRange.max) {
        return false;
      }

      if (selectedTypes.size > 0) {
        const tireType = product.tireType || "";
        if (tireType === "" || !selectedTypes.has(tireType)) {
          return false;
        }
      }

      if (selectedBrands.size > 0) {
        const brand = product.brand || "";
        if (brand === "" || !selectedBrands.has(brand)) {
          return false;
        }
      }

      if (selectedSeasons.size > 0) {
        const season = product.season || "";
        if (season === "" || !selectedSeasons.has(season)) {
          return false;
        }
      }

      if (selectedCompositions.size > 0) {
        const composition = product.composition || "";
        if (composition === "" || !selectedCompositions.has(composition)) {
          return false;
        }
      }

      if (selectedTreadPatterns.size > 0) {
        const treadPattern = product.treadPattern || "";
        if (treadPattern === "" || !selectedTreadPatterns.has(treadPattern)) {
          return false;
        }
      }

      if (selectedSizes.size > 0) {
        const tireSize = product.tireSize || "";
        if (tireSize === "" || !selectedSizes.has(tireSize)) {
          return false;
        }
      }

      if (selectedSpeedIndexes.size > 0) {
        const speedIndex = product.speedIndex || "";
        if (speedIndex === "" || !selectedSpeedIndexes.has(speedIndex)) {
          return false;
        }
      }

      if (selectedLoadIndexes.size > 0) {
        const loadIndex = product.loadIndex || "";
        if (loadIndex === "" || !selectedLoadIndexes.has(loadIndex)) {
          return false;
        }
      }

      return true;
    });

    console.log("Фильтрованная резина:", filteredProducts.length);

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
    selectedSeasons,
    selectedCompositions,
    selectedTreadPatterns,
    selectedSizes,
    selectedSpeedIndexes,
    selectedLoadIndexes,
    currentPriceRange,
    sortBy,
  ]);

  //
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleAddToCart = (product) => {
    const productToAdd = {
      ...product,
      quantity: 1,
      addedAt: new Date().toISOString(),
    };
    addOrder(productToAdd);
    showNotification(
      t("motorcycle_tires_added_cart", {
        name: product.name || product.title || t("motorcycle_tires_product"),
      }),
      "success",
    );
  };

  const handleAddToFavorites = (product) => {
    if (isInFavorites(product.id)) {
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
        t("motorcycle_tires_removed_from", {
          name: product.name || product.title || t("motorcycle_tires_product"),
        }),
        "info",
      );
    } else {
      addFavorit(product);
      const newFavoriteSet = new Set(favorites);
      newFavoriteSet.add(product.id);
      setFavorites(newFavoriteSet);
      showNotification(
        t("motorcycle_tires_added_favorites", {
          name: product.name || product.title || t("motorcycle_tires_product"),
        }),
        "success",
      );
    }
  };

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

  const renderActiveFilters = () => {
    const activeFilters = [];

    if (selectedTypes.size > 0) {
      activeFilters.push(
        <span key="types" className={scss.activeFilter}>
          {t("motorcycle_tires_types")}: {Array.from(selectedTypes).join(", ")}
          <button onClick={() => clearFilter("types")}>×</button>
        </span>,
      );
    }

    if (selectedBrands.size > 0) {
      activeFilters.push(
        <span key="brands" className={scss.activeFilter}>
          {t("motorcycle_tires_brands")}:{" "}
          {Array.from(selectedBrands).join(", ")}
          <button onClick={() => clearFilter("brands")}>×</button>
        </span>,
      );
    }

    if (selectedSizes.size > 0) {
      activeFilters.push(
        <span key="sizes" className={scss.activeFilter}>
          {t("motorcycle_tires_sizes")}: {Array.from(selectedSizes).join(", ")}
          <button onClick={() => clearFilter("sizes")}>×</button>
        </span>,
      );
    }

    if (selectedSeasons.size > 0) {
      activeFilters.push(
        <span key="seasons" className={scss.activeFilter}>
          {t("motorcycle_tires_seasons")}:{" "}
          {Array.from(selectedSeasons).join(", ")}
          <button onClick={() => clearFilter("seasons")}>×</button>
        </span>,
      );
    }

    if (selectedCompositions.size > 0) {
      activeFilters.push(
        <span key="compositions" className={scss.activeFilter}>
          {t("motorcycle_tires_compositions")}:{" "}
          {Array.from(selectedCompositions).join(", ")}
          <button onClick={() => clearFilter("compositions")}>×</button>
        </span>,
      );
    }

    if (discountOnly) {
      activeFilters.push(
        <span key="discount" className={scss.activeFilter}>
          {t("motorcycle_tires_only_discount")}
          <button onClick={() => setDiscountOnly(false)}>×</button>
        </span>,
      );
    }

    if (inStock) {
      activeFilters.push(
        <span key="stock" className={scss.activeFilter}>
          {t("motorcycle_tires_stock")}
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
          {t("motorcycle_tires_price")}: {currentPriceRange.min}{" "}
          {t("motorcycle_tires_currency")} - {currentPriceRange.max}{" "}
          {t("motorcycle_tires_currency")}
          <button onClick={() => setCurrentPriceRange(priceRange)}>×</button>
        </span>,
      );
    }

    return activeFilters;
  };

  return (
    <div className={`${scss.categoryPage} ${scss.tiresPage}`}>
      <div className={scss.notificationsContainer}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
            t={t}
          />
        ))}
      </div>

      <div className="container">
        <div className={scss.pageHeader}>
          <h1>{t("motorcycle_tires_page_title")}</h1>
          <p>{t("motorcycle_tires_page_description")}</p>
        </div>

        <div className={scss.tiresInner}>
          <aside className={scss.sidebar}>
            <div className={scss.filterBlock}>
              <div className={scss.filterHeader}>
                <h3>{t("motorcycle_tires_filters")}</h3>
                <button className={scss.clearAll} onClick={clearAllFilters}>
                  {t("motorcycle_tires_clear_all")}
                </button>
              </div>

              <div className={scss.filterSection}>
                <label className={scss.filterLabel}>
                  <span>{t("motorcycle_tires_search_name")}</span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("motorcycle_tires_search_placeholder")}
                  />
                </label>
              </div>

              <div className={scss.filterSection}>
                <h4>{t("motorcycle_tires_basic_filters")}</h4>
                <div className={scss.checkboxGroup}>
                  <label className={scss.customCheck}>
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={() => setInStock(!inStock)}
                    />
                    <span>{t("motorcycle_tires_stock")}</span>
                  </label>
                  <label className={scss.customCheck}>
                    <input
                      type="checkbox"
                      checked={discountOnly}
                      onChange={() => setDiscountOnly(!discountOnly)}
                    />
                    <span>{t("motorcycle_tires_only_discount")}</span>
                  </label>
                </div>
              </div>

              <div className={scss.filterSection}>
                <h4>
                  {t("motorcycle_tires_price_range")}:{" "}
                  {t("motorcycle_tires_currency")}
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

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_tires_tire_types")}</h4>
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
                    : TireTypes.map((type) => (
                        <label key={type} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedTypes.has(type)}
                            onChange={() => toggleType(type)}
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_tires_brands")}</h4>
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
                    : TireBrands.map((brand) => (
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

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_tires_sizes")}</h4>
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
                    : TireSizes.map((size) => (
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

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_tires_seasonality")}</h4>
                  {selectedSeasons.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("seasons")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableSeasons.length > 0
                    ? availableSeasons.map((season) => (
                        <label key={season} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedSeasons.has(season)}
                            onChange={() => toggleSeason(season)}
                          />
                          <span>{season}</span>
                        </label>
                      ))
                    : TireSeasons.map((season) => (
                        <label key={season} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedSeasons.has(season)}
                            onChange={() => toggleSeason(season)}
                          />
                          <span>{season}</span>
                        </label>
                      ))}
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_tires_tire_composition")}</h4>
                  {selectedCompositions.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("compositions")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableCompositions.length > 0
                    ? availableCompositions.map((composition) => (
                        <label key={composition} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedCompositions.has(composition)}
                            onChange={() => toggleComposition(composition)}
                          />
                          <span>{composition}</span>
                        </label>
                      ))
                    : TireCompositions.map((composition) => (
                        <label key={composition} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedCompositions.has(composition)}
                            onChange={() => toggleComposition(composition)}
                          />
                          <span>{composition}</span>
                        </label>
                      ))}
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_tires_tread_pattern")}</h4>
                  {selectedTreadPatterns.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("treadPatterns")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableTreadPatterns.length > 0
                    ? availableTreadPatterns.map((pattern) => (
                        <label key={pattern} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedTreadPatterns.has(pattern)}
                            onChange={() => toggleTreadPattern(pattern)}
                          />
                          <span>{pattern}</span>
                        </label>
                      ))
                    : TireTreadPatterns.map((pattern) => (
                        <label key={pattern} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedTreadPatterns.has(pattern)}
                            onChange={() => toggleTreadPattern(pattern)}
                          />
                          <span>{pattern}</span>
                        </label>
                      ))}
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_tires_speed_index")}</h4>
                  {selectedSpeedIndexes.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("speedIndexes")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableSpeedIndexes.length > 0
                    ? availableSpeedIndexes.map((index) => (
                        <label key={index} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedSpeedIndexes.has(index)}
                            onChange={() => toggleSpeedIndex(index)}
                          />
                          <span>{index}</span>
                        </label>
                      ))
                    : SpeedIndexes.map((index) => (
                        <label key={index} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedSpeedIndexes.has(index)}
                            onChange={() => toggleSpeedIndex(index)}
                          />
                          <span>{index}</span>
                        </label>
                      ))}
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("motorcycle_tires_load_index")}</h4>
                  {selectedLoadIndexes.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("loadIndexes")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableLoadIndexes.length > 0
                    ? availableLoadIndexes.map((index) => (
                        <label key={index} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedLoadIndexes.has(index)}
                            onChange={() => toggleLoadIndex(index)}
                          />
                          <span>{index}</span>
                        </label>
                      ))
                    : LoadIndexes.map((index) => (
                        <label key={index} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedLoadIndexes.has(index)}
                            onChange={() => toggleLoadIndex(index)}
                          />
                          <span>{index}</span>
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
                {t("motorcycle_tires_products_found")}
                {renderActiveFilters().length > 0 && (
                  <div className={scss.activeFilters}>
                    <span>{t("motorcycle_tires_filters")}:</span>
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
                  {t("motorcycle_tires_sort")}:
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">
                      {t("motorcycle_tires_sort_default")}
                    </option>
                    <option value="price-asc">
                      {t("motorcycle_tires_sort_price")}
                    </option>
                    <option value="price-desc">
                      {t("motorcycle_tires_sort_price_1")}
                    </option>
                    <option value="discount">
                      {t("motorcycle_tires_sort_discount")}
                    </option>
                    <option value="rating">
                      {t("motorcycle_tires_sort_rating")}
                    </option>
                    <option value="popularity">
                      {t("motorcycle_tires_sort_popularity")}
                    </option>
                  </select>
                </label>
              </div>
            </div>

            <div className={scss.productsGrid}>
              {loading ? (
                <div className={scss.loading}>
                  {t("motorcycle_tires_loading_tires")}
                </div>
              ) : currentItems.length === 0 ? (
                <div className={scss.noResults}>
                  <h3>{t("motorcycle_tires_results_title")}</h3>
                  <p>{t("motorcycle_tires_results_description")}</p>
                  <button onClick={clearAllFilters}>
                    {t("motorcycle_tires_reset_all")}
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
                            t("motorcycle_tires_tire")
                          }
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=60";
                          }}
                        />
                        <button
                          className={`${scss.favoriteBtn} ${
                            isFavorite ? scss.favoriteActive : ""
                          }`}
                          onClick={() => handleAddToFavorites(product)}
                          title={
                            isFavorite
                              ? t("motorcycle_tires_favorites")
                              : t("motorcycle_tires_add_favorites")
                          }
                        >
                          {isFavorite ? (
                            <FaHeart className={scss.favoriteIcon} />
                          ) : (
                            <img
                              src="./src/assets/icons/Wishlist (1).svg"
                              alt={t("motorcycle_tires_add_favorites")}
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
                            {t("motorcycle_tires_out_stock")}
                          </div>
                        )}
                      </div>
                      <div className={scss.cardContent}>
                        <div className={scss.cardHeader}>
                          <div className={scss.brand}>{product.brand}</div>
                          {product.tireType && (
                            <div className={scss.type}>{product.tireType}</div>
                          )}
                        </div>
                        <h3 className={scss.title}>
                          {product.name ||
                            product.title ||
                            t("motorcycle_tires_motorcycle_tire")}
                        </h3>
                        <div className={scss.details}>
                          {product.tireSize && (
                            <span className={scss.detailItem}>
                              {t("motorcycle_tires_size")}: {product.tireSize}
                            </span>
                          )}
                          {product.season && (
                            <span className={scss.detailItem}>
                              {t("motorcycle_tires_season")}: {product.season}
                            </span>
                          )}
                          {product.composition && (
                            <span className={scss.detailItem}>
                              {t("motorcycle_tires_composition")}:{" "}
                              {product.composition}
                            </span>
                          )}
                          {product.speedIndex && (
                            <span className={scss.detailItem}>
                              {t("motorcycle_tires_speed")}:{" "}
                              {product.speedIndex}
                            </span>
                          )}
                          {product.loadIndex && (
                            <span className={scss.detailItem}>
                              {t("motorcycle_tires_load")}: {product.loadIndex}
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
                            {t("motorcycle_tires_add_cart")}
                          </button>
                          <Link to={`/product/${product.id}`}>
                            <button className={scss.detailsBtn}>
                              {t("motorcycle_tires_details")}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {totalPages > 1 && (
              <div className={scss.pagination}>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className={scss.paginationBtn}
                >
                  {t("motorcycle_tires_back")}
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
                  {t("motorcycle_tires_next")}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Motorcycle_tires;
