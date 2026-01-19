import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useProduct } from "../../MainContext/MainContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  formatPriceWithCurrency,
  calculateItemTotal,
} from "../../utils/priceFormatter";
import scss from "./Motorcycle_equipment.module.scss";

import {
  FiFilter,
  FiX,
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiEye,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaTimes,
  FaHeart as SolidHeart,
} from "react-icons/fa";

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

const Motorcycle_equipment = () => {
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
  const initialized = useRef(false);

  const [query, setQuery] = useState("");
  const [inStock, setInStock] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedMaterials, setSelectedMaterials] = useState(new Set());
  const [selectedSizes, setSelectedSizes] = useState(new Set());
  const [selectedProtection, setSelectedProtection] = useState(new Set());
  const [selectedSeasons, setSelectedSeasons] = useState(new Set());

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    categories: false,
    brands: false,
    materials: false,
    sizes: false,
    types: false,
    seasons: false,
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [currentPriceRange, setCurrentPriceRange] = useState({
    min: 0,
    max: 100000,
  });

  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const [sortBy, setSortBy] = useState("default");

  const [notifications, setNotifications] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const EquipmentCategories = useMemo(
    () => [
      "Куртки",
      "Штаны",
      "Ботинки",
      "Перчатки",
      "Чехлы",
      "Защита",
      "Комплекты",
      "Термобелье",
      "Дождевики",
      "Сумки",
      "Аксессуары",
    ],
    [],
  );

  const EquipmentTypes = useMemo(
    () => [
      "Спортивная",
      "Туристическая",
      "Классическая",
      "Внедорожная",
      "Городская",
      "Эндуро",
      "Кросс",
      "Приключенческая",
    ],
    [],
  );

  const EquipmentBrands = useMemo(
    () => [
      "Alpinestars",
      "Dainese",
      "Rev'It",
      "Icon",
      "Joe Rocket",
      "Spidi",
      "Furygan",
      "Komine",
      "Rukka",
      "BMW",
      "Klim",
      "TCX",
      "Sidi",
      "Gaerne",
    ],
    [],
  );

  const EquipmentMaterials = useMemo(
    () => [
      "Кожа",
      "Текстиль",
      "Кордура",
      "Арамид",
      "Карбон",
      "Мембрана",
      "Сетка",
      "Экокожа",
    ],
    [],
  );

  const EquipmentSizes = useMemo(
    () => ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Универсальный"],
    [],
  );

  const ProtectionLevels = useMemo(
    () => [
      "CE Уровень 1",
      "CE Уровень 2",
      "CE EN 1621-1",
      "CE EN 1621-2",
      "CE EN 13595",
      "Аэрогель",
      "Силикон",
    ],
    [],
  );

  const Seasons = useMemo(
    () => ["Лето", "Зима", "Демисезон", "Всесезонная"],
    [],
  );

  const SortOptions = useMemo(
    () => [
      { value: "default", label: t("equipment_sort_default") },
      { value: "price-asc", label: t("equipment_sort_price_asc") },
      { value: "price-desc", label: t("equipment_sort_price_desc") },
      { value: "discount", label: t("equipment_sort_discount") },
      { value: "rating", label: t("equipment_sort_rating") },
      { value: "new", label: t("equipment_sort_new") },
      { value: "popular", label: t("equipment_sort_popular") },
    ],
    [t],
  );

  useEffect(() => {
    if (!initialized.current) {
      getProducts();
      readFavorit();
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorit")) || [];
    const favoriteSet = new Set(storedFavorites.map((item) => item.id));
    setFavorites(favoriteSet);
  }, [favorit]);

  useEffect(() => {
    if (!products) return;

    const equipmentProducts = products.filter(
      (p) => p.category === "Мотоэкипировка",
    );

    if (equipmentProducts.length > 0) {
      const prices = equipmentProducts
        .map((p) => parseFloat(p.price) || 0)
        .filter((p) => p > 0);

      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices) / 100) * 100;
        const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100;
        setPriceRange({ min: minPrice, max: maxPrice });
        setCurrentPriceRange({ min: minPrice, max: maxPrice });
      }

      const uniqueBrands = new Set();
      const uniqueCategories = new Set();
      const uniqueTypes = new Set();
      const uniqueMaterials = new Set();
      const uniqueSizes = new Set();
      const uniqueSeasons = new Set();

      equipmentProducts.forEach((product) => {
        if (product.brand) uniqueBrands.add(product.brand);

        if (product.equipmentCategory) {
          uniqueCategories.add(product.equipmentCategory);
        } else if (
          product.category === "Мотоэкипировка" &&
          product.subcategory
        ) {
          uniqueCategories.add(product.subcategory);
        }

        if (product.type) uniqueTypes.add(product.type);

        if (product.material) uniqueMaterials.add(product.material);

        if (product.size) uniqueSizes.add(product.size);

        if (product.season) uniqueSeasons.add(product.season);
      });

      setAvailableBrands(Array.from(uniqueBrands).sort());
      setAvailableCategories(Array.from(uniqueCategories).sort());
      setAvailableTypes(Array.from(uniqueTypes).sort());
      setAvailableMaterials(Array.from(uniqueMaterials).sort());
      setAvailableSizes(Array.from(uniqueSizes).sort());
    }
  }, [products]);

  const showNotification = useCallback((message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const isInFavorites = useCallback(
    (productId) => {
      return favorites.has(productId);
    },
    [favorites],
  );

  const toggleCategory = useCallback((category) => {
    setSelectedCategories((prev) => {
      const copy = new Set(prev);
      if (copy.has(category)) copy.delete(category);
      else copy.add(category);
      return copy;
    });
  }, []);

  const toggleType = useCallback((type) => {
    setSelectedTypes((prev) => {
      const copy = new Set(prev);
      if (copy.has(type)) copy.delete(type);
      else copy.add(type);
      return copy;
    });
  }, []);

  const toggleBrand = useCallback((brand) => {
    setSelectedBrands((prev) => {
      const copy = new Set(prev);
      if (copy.has(brand)) copy.delete(brand);
      else copy.add(brand);
      return copy;
    });
  }, []);

  const toggleMaterial = useCallback((material) => {
    setSelectedMaterials((prev) => {
      const copy = new Set(prev);
      if (copy.has(material)) copy.delete(material);
      else copy.add(material);
      return copy;
    });
  }, []);

  const toggleSize = useCallback((size) => {
    setSelectedSizes((prev) => {
      const copy = new Set(prev);
      if (copy.has(size)) copy.delete(size);
      else copy.add(size);
      return copy;
    });
  }, []);

  const toggleSeason = useCallback((season) => {
    setSelectedSeasons((prev) => {
      const copy = new Set(prev);
      if (copy.has(season)) copy.delete(season);
      else copy.add(season);
      return copy;
    });
  }, []);

  const toggleFilterSection = useCallback((section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setQuery("");
    setInStock(false);
    setDiscountOnly(false);
    setSelectedCategories(new Set());
    setSelectedTypes(new Set());
    setSelectedBrands(new Set());
    setSelectedMaterials(new Set());
    setSelectedSizes(new Set());
    setSelectedProtection(new Set());
    setSelectedSeasons(new Set());
    setCurrentPriceRange(priceRange);
    setCurrentPage(1);
    showNotification(t("equipment_notifications_filters_cleared"), "info");
  }, [priceRange, showNotification, t]);

  const clearFilter = useCallback((filterName) => {
    switch (filterName) {
      case "categories":
        setSelectedCategories(new Set());
        break;
      case "types":
        setSelectedTypes(new Set());
        break;
      case "brands":
        setSelectedBrands(new Set());
        break;
      case "materials":
        setSelectedMaterials(new Set());
        break;
      case "sizes":
        setSelectedSizes(new Set());
        break;
      case "seasons":
        setSelectedSeasons(new Set());
        break;
      default:
        break;
    }
    setCurrentPage(1);
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];

    let filteredProducts = products.filter((product) => {
      const isEquipment = product.category === "Мотоэкипировка";

      if (!isEquipment) return false;
      const searchQuery = query.trim().toLowerCase();
      if (searchQuery) {
        const name = (product.name || product.title || "").toLowerCase();
        const desc = (product.description || "").toLowerCase();
        const brand = (product.brand || "").toLowerCase();

        if (
          !name.includes(searchQuery) &&
          !desc.includes(searchQuery) &&
          !brand.includes(searchQuery)
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

      if (selectedCategories.size > 0) {
        const equipmentCategory = product.equipmentCategory || "";
        if (!selectedCategories.has(equipmentCategory)) return false;
      }

      if (selectedTypes.size > 0) {
        const type = product.type || "";
        if (!selectedTypes.has(type)) return false;
      }

      if (selectedBrands.size > 0) {
        const brand = product.brand || "";
        if (!selectedBrands.has(brand)) return false;
      }

      if (selectedMaterials.size > 0) {
        const material = product.material || "";
        if (!selectedMaterials.has(material)) return false;
      }

      if (selectedSizes.size > 0) {
        const size = product.size || "";
        if (!selectedSizes.has(size)) return false;
      }

      if (selectedSeasons.size > 0) {
        const season = product.season || "";
        if (!selectedSeasons.has(season)) return false;
      }

      return true;
    });

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
        case "new":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "popular":
          return (b.countInStock || 0) - (a.countInStock || 0);
        default:
          return 0;
      }
    });

    return filteredProducts;
  }, [
    products,
    query,
    inStock,
    discountOnly,
    currentPriceRange,
    selectedCategories,
    selectedTypes,
    selectedBrands,
    selectedMaterials,
    selectedSizes,
    selectedSeasons,
    sortBy,
  ]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleAddToCart = useCallback(
    (product) => {
      const productToAdd = {
        ...product,
        quantity: 1,
        addedAt: new Date().toISOString(),
      };
      addOrder(productToAdd);
      showNotification(
        t("equipment_notifications_added_to_cart", {
          name: product.name || product.title || t("equipment_equipment"),
        }),
        "success",
      );
    },
    [addOrder, showNotification, t],
  );

  const handleAddToFavorites = useCallback(
    (product) => {
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
          t("equipment_notifications_removed_from_favorites", {
            name: product.name || product.title || t("equipment_equipment"),
          }),
          "info",
        );
      } else {
        addFavorit(product);
        const newFavoriteSet = new Set(favorites);
        newFavoriteSet.add(product.id);
        setFavorites(newFavoriteSet);
        showNotification(
          t("equipment_notifications_added_to_favorites", {
            name: product.name || product.title || t("equipment_equipment"),
          }),
          "success",
        );
      }
    },
    [addFavorit, isInFavorites, readFavorit, showNotification, t],
  );

  const generatePageNumbers = useCallback(() => {
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
  }, [currentPage, totalPages]);

  const renderActiveFilters = useCallback(() => {
    const activeFilters = [];

    if (selectedCategories.size > 0) {
      activeFilters.push(
        <span key="categories" className={scss.activeFilter}>
          {t("equipment_active_filters_categories")}:{" "}
          {Array.from(selectedCategories).join(", ")}
          <button
            onClick={() => clearFilter("categories")}
            aria-label={t("equipment_aria_labels_remove_filter")}
          >
            <FiX size={14} />
          </button>
        </span>,
      );
    }

    if (selectedTypes.size > 0) {
      activeFilters.push(
        <span key="types" className={scss.activeFilter}>
          {t("equipment_active_filters_types")}:{" "}
          {Array.from(selectedTypes).join(", ")}
          <button
            onClick={() => clearFilter("types")}
            aria-label={t("equipment_aria_labels_remove_filter")}
          >
            <FiX size={14} />
          </button>
        </span>,
      );
    }

    if (selectedBrands.size > 0) {
      activeFilters.push(
        <span key="brands" className={scss.activeFilter}>
          {t("equipment_active_filters_brands")}:{" "}
          {Array.from(selectedBrands).join(", ")}
          <button
            onClick={() => clearFilter("brands")}
            aria-label={t("equipment_aria_labels_remove_filter")}
          >
            <FiX size={14} />
          </button>
        </span>,
      );
    }

    if (discountOnly) {
      activeFilters.push(
        <span key="discount" className={scss.activeFilter}>
          {t("equipment_active_filters_discount_only")}
          <button
            onClick={() => setDiscountOnly(false)}
            aria-label={t("equipment_aria_labels_remove_filter")}
          >
            <FiX size={14} />
          </button>
        </span>,
      );
    }

    if (inStock) {
      activeFilters.push(
        <span key="stock" className={scss.activeFilter}>
          <FaCheck style={{ marginRight: 4 }} />{" "}
          {t("equipment_active_filters_in_stock")}
          <button
            onClick={() => setInStock(false)}
            aria-label={t("equipment_aria_labels_remove_filter")}
          >
            <FiX size={14} />
          </button>
        </span>,
      );
    }

    if (selectedSeasons.size > 0) {
      activeFilters.push(
        <span key="seasons" className={scss.activeFilter}>
          {t("equipment_active_filters_seasons")}:{" "}
          {Array.from(selectedSeasons).join(", ")}
          <button
            onClick={() => clearFilter("seasons")}
            aria-label={t("equipment_aria_labels_remove_filter")}
          >
            <FiX size={14} />
          </button>
        </span>,
      );
    }

    if (selectedSizes.size > 0) {
      activeFilters.push(
        <span key="sizes" className={scss.activeFilter}>
          {t("equipment_active_filters_sizes")}:{" "}
          {Array.from(selectedSizes).join(", ")}
          <button
            onClick={() => clearFilter("sizes")}
            aria-label={t("equipment_aria_labels_remove_filter")}
          >
            <FiX size={14} />
          </button>
        </span>,
      );
    }

    if (
      currentPriceRange.min > priceRange.min ||
      currentPriceRange.max < priceRange.max
    ) {
      activeFilters.push(
        <span key="price" className={scss.activeFilter}>
          {t("equipment_active_filters_price")}:{" "}
          {currentPriceRange.min.toLocaleString()} -{" "}
          {currentPriceRange.max.toLocaleString()} {t("common_currency")}
          <button
            onClick={() => setCurrentPriceRange(priceRange)}
            aria-label={t("equipment_aria_labels_remove_filter")}
          >
            <FiX size={14} />
          </button>
        </span>,
      );
    }

    return activeFilters;
  }, [
    selectedCategories,
    selectedTypes,
    selectedBrands,
    selectedSeasons,
    selectedSizes,
    discountOnly,
    inStock,
    currentPriceRange,
    priceRange,
    clearFilter,
    t,
  ]);

  const renderFilterSection = useCallback(
    (title, items, selectedItems, toggleFn, expandedKey, showLimit = 5) => {
      const isExpanded = expandedFilters[expandedKey];
      const displayItems = isExpanded ? items : items.slice(0, showLimit);
      const hasMore = items.length > showLimit;

      return (
        <div className={scss.filterSection}>
          <div className={scss.filterHeader}>
            <h4
              onClick={() => toggleFilterSection(expandedKey)}
              className={scss.filterTitle}
            >
              {title}
              {hasMore && (
                <span className={scss.expandIcon}>
                  {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </span>
              )}
            </h4>
            {selectedItems.size > 0 && (
              <button
                className={scss.clearFilter}
                onClick={() => clearFilter(expandedKey)}
                aria-label={t("equipment_aria_labels_clear_filter", { title })}
              >
                ×
              </button>
            )}
          </div>
          <div className={scss.checkboxGroup}>
            {displayItems.map((item) => (
              <label key={item} className={scss.customCheck}>
                <input
                  type="checkbox"
                  checked={selectedItems.has(item)}
                  onChange={() => toggleFn(item)}
                />
                <span className={scss.checkboxText}>{item}</span>
              </label>
            ))}
          </div>
          {hasMore && !isExpanded && (
            <button
              className={scss.showMore}
              onClick={() => toggleFilterSection(expandedKey)}
            >
              {t("equipment_show_more")} {items.length - showLimit}
            </button>
          )}
        </div>
      );
    },
    [expandedFilters, toggleFilterSection, clearFilter, t],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    query,
    inStock,
    discountOnly,
    selectedCategories,
    selectedTypes,
    selectedBrands,
    selectedMaterials,
    selectedSizes,
    selectedSeasons,
    currentPriceRange,
    sortBy,
  ]);

  return (
    <div className={`${scss.categoryPage} ${scss.equipmentPage}`}>
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
          <h1>{t("equipment_page_title")}</h1>
          <p>{t("equipment_page_description")}</p>
        </div>

        <div className={scss.equipmentInner}>
          <button
            className={scss.mobileFilterBtn}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <FiFilter /> {t("equipment_filters")}{" "}
            {filtered.length > 0 && `(${filtered.length})`}
          </button>

          <aside
            className={`${scss.sidebar} ${
              showMobileFilters ? scss.sidebarOpen : ""
            }`}
          >
            <div className={scss.filterBlock}>
              <div className={scss.filterHeader}>
                <h3>
                  <FiFilter style={{ marginRight: 8 }} />
                  {t("equipment_filters")}
                </h3>
                <div className={scss.filterActions}>
                  <button className={scss.clearAll} onClick={clearAllFilters}>
                    {t("equipment_clear_all_filters")}
                  </button>
                  <button
                    className={scss.closeMobileFilters}
                    onClick={() => setShowMobileFilters(false)}
                    aria-label={t("equipment_aria_labels_close_filters")}
                  >
                    <FiX />
                  </button>
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.searchBox}>
                  <FiSearch className={scss.searchIcon} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("equipment_search_placeholder")}
                    className={scss.searchInput}
                  />
                  {query && (
                    <button
                      className={scss.clearSearch}
                      onClick={() => setQuery("")}
                      aria-label={t("equipment_aria_labels_clear_search")}
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </div>

              <div className={scss.filterSection}>
                <h4>{t("equipment_basic_filters")}</h4>
                <div className={scss.checkboxGroup}>
                  <label className={scss.customCheck}>
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={() => setInStock(!inStock)}
                    />
                    <span className={scss.checkboxText}>
                      <FaCheck className={scss.checkIcon} />{" "}
                      {t("equipment_in_stock")}
                    </span>
                  </label>
                  <label className={scss.customCheck}>
                    <input
                      type="checkbox"
                      checked={discountOnly}
                      onChange={() => setDiscountOnly(!discountOnly)}
                    />
                    <span className={scss.checkboxText}>
                      {t("equipment_discount_only")}
                    </span>
                  </label>
                </div>
              </div>

              <div className={scss.filterSection}>
                <h4>
                  {t("equipment_price_range")}: {t("common_currency")}
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
                      className={scss.priceInput}
                    />
                    <span className={scss.priceSeparator}>-</span>
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
                      className={scss.priceInput}
                    />
                  </div>
                  <div className={scss.rangeSliders}>
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
                  <div className={scss.priceLabels}>
                    <span>
                      {currentPriceRange.min.toLocaleString()}{" "}
                      {t("common_currency")}
                    </span>
                    <span>
                      {currentPriceRange.max.toLocaleString()}{" "}
                      {t("common_currency")}
                    </span>
                  </div>
                </div>
              </div>

              {renderFilterSection(
                t("equipment_categories_title"),
                availableCategories.length > 0
                  ? availableCategories
                  : EquipmentCategories,
                selectedCategories,
                toggleCategory,
                "categories",
              )}

              {renderFilterSection(
                t("equipment_types_title"),
                availableTypes.length > 0 ? availableTypes : EquipmentTypes,
                selectedTypes,
                toggleType,
                "types",
              )}

              {renderFilterSection(
                t("equipment_brands"),
                availableBrands.length > 0 ? availableBrands : EquipmentBrands,
                selectedBrands,
                toggleBrand,
                "brands",
              )}

              {renderFilterSection(
                t("equipment_materials_title"),
                availableMaterials.length > 0
                  ? availableMaterials
                  : EquipmentMaterials,
                selectedMaterials,
                toggleMaterial,
                "materials",
              )}

              {renderFilterSection(
                t("equipment_sizes_title"),
                availableSizes.length > 0 ? availableSizes : EquipmentSizes,
                selectedSizes,
                toggleSize,
                "sizes",
              )}
            </div>
          </aside>

          <main className={scss.main}>
            <div className={scss.controls}>
              <div className={scss.resultsInfo}>
                <div className={scss.resultsCount}>
                  <strong>{filtered.length}</strong> <br />{" "}
                  {t("equipment_products_found")}
                </div>

                {renderActiveFilters().length > 0 && (
                  <div className={scss.activeFilters}>
                    <span className={scss.activeFiltersLabel}>
                      {t("equipment_active_filters_label")}:
                    </span>
                    <div className={scss.activeFiltersList}>
                      {renderActiveFilters()}
                    </div>
                  </div>
                )}
              </div>
              <div className={scss.sort}>
                <label className={scss.sortLabel}>
                  <span>{t("equipment_sort_label")}:</span>
                  <div className={scss.selectWrapper}>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={scss.sortSelect}
                    >
                      {SortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className={scss.selectArrow} />
                  </div>
                </label>
              </div>
            </div>

            {loading ? (
              <div className={scss.loading}>
                <div className={scss.spinner}></div>
                <p>{t("equipment_loading")}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className={scss.noResults}>
                <div className={scss.noResultsIcon}>
                  <FiFilter size={48} />
                </div>
                <h3>{t("equipment_no_results_title")}</h3>
                <p>{t("equipment_no_results_description")}</p>
                <button
                  className={scss.resetFiltersBtn}
                  onClick={clearAllFilters}
                >
                  {t("equipment_no_results_reset_filters")}
                </button>
              </div>
            ) : (
              <>
                <div className={scss.productsGrid}>
                  {currentItems.map((product) => {
                    const hasDiscount =
                      product.discount && product.discount > 0;
                    const finalPrice = hasDiscount
                      ? calculateItemTotal(product.price, product.discount)
                      : product.price;
                    const isNew =
                      product.createdAt &&
                      new Date() - new Date(product.createdAt) <
                        30 * 24 * 60 * 60 * 1000;
                    const isFavorite = isInFavorites(product.id);

                    return (
                      <div key={product.id} className={scss.productCard}>
                        <div className={scss.cardImage}>
                          <Link to={`/product/${product.id}`}>
                            <img
                              src={product.image || "/placeholder.jpg"}
                              alt={product.name || t("equipment_equipment")}
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = "/placeholder.jpg";
                              }}
                            />
                          </Link>
                          <div className={scss.imageOverlay}>
                            <button
                              className={`${scss.favoriteBtn} ${scss.iconBtn} ${
                                isFavorite ? scss.favoriteActive : ""
                              }`}
                              onClick={() => handleAddToFavorites(product)}
                              title={
                                isFavorite
                                  ? t("equipment_aria_labels_in_favorites")
                                  : t("equipment_aria_labels_add_to_favorites")
                              }
                            >
                              {isFavorite ? (
                                <SolidHeart className={scss.favoriteIcon} />
                              ) : (
                                <img
                                  src="./src/assets/icons/Wishlist (1).svg"
                                  alt={t(
                                    "equipment_aria_labels_add_to_favorites",
                                  )}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentElement.innerHTML =
                                      "<FiHeart />";
                                  }}
                                />
                              )}
                            </button>
                            {hasDiscount && (
                              <div className={scss.discountBadge}>
                                {product.discount}%
                              </div>
                            )}
                            {isNew && (
                              <div className={scss.newBadge}>
                                {t("equipment_new_badge")}
                              </div>
                            )}
                          </div>
                          {!product.inStock && (
                            <div className={scss.outOfStock}>
                              {t("equipment_out_of_stock")}
                            </div>
                          )}
                        </div>
                        <div className={scss.cardContent}>
                          <div className={scss.cardHeader}>
                            <div className={scss.brand}>{product.brand}</div>
                            {product.protectionLevel && (
                              <div className={scss.certifications}>
                                <span
                                  className={`${scss.certificationBadge} ${scss.dot}`}
                                >
                                  {product.protectionLevel}
                                </span>
                              </div>
                            )}
                          </div>
                          <h3 className={scss.title}>
                            <Link to={`/product/${product.id}`}>
                              {product.name || t("equipment_equipment")}
                            </Link>
                          </h3>
                          <div className={scss.details}>
                            {product.equipmentCategory && (
                              <span className={scss.detailItem}>
                                {product.equipmentCategory}
                              </span>
                            )}
                            {product.type && (
                              <span className={scss.detailItem}>
                                {product.type}
                              </span>
                            )}
                            {product.material && (
                              <span className={scss.detailItem}>
                                {t("equipment_material")}: {product.material}
                              </span>
                            )}
                            {product.size && (
                              <span className={scss.detailItem}>
                                {t("equipment_size")}: {product.size}
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
                              {t("equipment_add_to_cart")}
                            </button>
                            <Link to={`/product/${product.id}`}>
                              <button className={scss.detailsBtn}>
                                {t("equipment_details")}
                              </button>
                            </Link>
                          </div>
                          {product.countInStock > 0 &&
                            product.countInStock < 10 && (
                              <div className={scss.stockWarning}>
                                {t("equipment_remaining_stock", {
                                  count: product.countInStock,
                                })}
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className={scss.pagination}>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className={scss.paginationBtn}
                      aria-label={t("equipment_aria_labels_previous_page")}
                    >
                      ← {t("equipment_pagination_back")}
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
                      aria-label={t("equipment_aria_labels_next_page")}
                    >
                      {t("equipment_pagination_next")} →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Motorcycle_equipment;
