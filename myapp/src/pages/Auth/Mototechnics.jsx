import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "../../MainContext/MainContext";
import {
  formatPriceWithCurrency,
  formatPrice,
} from "../../utils/priceFormatter";
import styles from "./Mototechnics.module.scss";
import { useTranslation } from "react-i18next";

import {
  FiFilter,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiHeart,
  FiShoppingCart,
  FiEye,
  FiStar,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiUsers,
  FiTool,
} from "react-icons/fi";
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
        return <FiCheck className={styles.notificationIconSuccess} />;
      case "info":
        return <FiEye className={styles.notificationIconInfo} />;
      default:
        return <FiEye className={styles.notificationIconDefault} />;
    }
  };

  return (
    <div className={`${styles.notification} ${styles[`notification${type}`]}`}>
      {getIcon()}
      <span className={styles.notificationMessage}>{message}</span>
      <button className={styles.notificationClose} onClick={onClose}>
        <FiX />
      </button>
    </div>
  );
});

Notification.displayName = "Notification";

const MotorcycleCatalog = () => {
  const { t } = useTranslation();
  const {
    products,
    getProducts,
    loading,
    error,
    addOrder,
    addFavorit,
    favorit,
    readFavorit,
  } = useProduct();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [sortOption, setSortOption] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [filters, setFilters] = useState({
    brand: "",
    type: "",
    engineVolume: { min: 0, max: 3000 },
    year: { min: 2000, max: new Date().getFullYear() },
    mileage: { min: 0, max: 100000 },
    price: { min: 0, max: 10000000 },
    condition: "all",
    transmission: "",
    inStock: false,
    discount: false,
  });

  const mototechnicsProducts = useMemo(() => {
    return products.filter((product) => product.category === "Мототехника");
  }, [products]);

  const categories = [
    {
      id: "all",
      name: t("mototechnics_categories_all"),
      kubCategory: "all",
      icon: "🏍️",
    },
    {
      id: "superbike",
      name: t("mototechnics_categories_sport"),
      kubCategory: "superbike",
      icon: "⚡",
    },
    {
      id: "cruiser",
      name: t("mototechnics_categories_cruiser"),
      kubCategory: "cruiser",
    },
    {
      id: "naked",
      name: t("mototechnics_categories_naked"),
      kubCategory: "naked",
    },
    {
      id: "touring",
      name: t("mototechnics_categories_touring"),
      kubCategory: "touring",
    },
    {
      id: "custom",
      name: t("mototechnics_categories_custom"),
      kubCategory: "custom",
    },
    {
      id: "sport-touring",
      name: t("mototechnics_categories_sport_touring"),
      kubCategory: "sport-touring",
    },
    {
      id: "classic",
      name: t("mototechnics_categories_classic"),
      kubCategory: "classic",
    },
  ];

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(mototechnicsProducts.map((p) => p.brand))]
      .filter(Boolean)
      .sort();

    return uniqueBrands.slice(0, 25);
  }, [mototechnicsProducts]);

  const popularBrands = useMemo(() => {
    return brands.slice(0, 6);
  }, [brands]);

  const otherBrands = useMemo(() => {
    return brands.slice(6);
  }, [brands]);

  const visibleOtherBrands = useMemo(() => {
    if (showAllBrands) {
      return otherBrands;
    }
    return otherBrands.slice(0, 6);
  }, [otherBrands, showAllBrands]);

  useEffect(() => {
    if (products.length === 0) {
      getProducts();
    }
    readFavorit();
  }, []);

  const showNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  useEffect(() => {
    let count = 0;
    if (filters.brand) count++;
    if (filters.condition !== "all") count++;
    if (filters.inStock) count++;
    if (filters.discount) count++;
    if (filters.price.min > 0 || filters.price.max < 10000000) count++;
    if (filters.year.min > 2000 || filters.year.max < new Date().getFullYear())
      count++;
    if (filters.engineVolume.min > 0 || filters.engineVolume.max < 3000)
      count++;
    if (filters.mileage.min > 0 || filters.mileage.max < 100000) count++;
    if (filters.transmission) count++;
    if (filters.type) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  useEffect(() => {
    let result = [...mototechnicsProducts];

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.kubCategory === selectedCategory,
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(term) ||
          product.brand?.toLowerCase().includes(term) ||
          product.type?.toLowerCase().includes(term),
      );
    }

    if (filters.brand) {
      result = result.filter((product) => product.brand === filters.brand);
    }

    if (filters.type) {
      result = result.filter((product) => product.type === filters.type);
    }

    result = result.filter(
      (product) =>
        (product.engineVolume || 0) >= filters.engineVolume.min &&
        (product.engineVolume || 0) <= filters.engineVolume.max,
    );

    result = result.filter(
      (product) =>
        (product.year || 2000) >= filters.year.min &&
        (product.year || 2000) <= filters.year.max,
    );

    result = result.filter(
      (product) =>
        (product.mileage || 0) >= filters.mileage.min &&
        (product.mileage || 0) <= filters.mileage.max,
    );

    result = result.filter(
      (product) =>
        product.price >= filters.price.min &&
        product.price <= filters.price.max,
    );

    if (filters.condition !== "all") {
      if (filters.condition === "new") {
        result = result.filter((product) => product.isNew === true);
      } else {
        result = result.filter(
          (product) => product.condition === filters.condition,
        );
      }
    }

    if (filters.inStock) {
      result = result.filter((product) => product.inStock === true);
    }

    if (filters.discount) {
      result = result.filter((product) => (product.discount || 0) > 0);
    }

    if (filters.transmission) {
      result = result.filter(
        (product) => product.transmission === filters.transmission,
      );
    }

    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "year-desc":
        result.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case "rating-desc":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "featured":
      default:
        result.sort((a, b) => {
          const aScore =
            (a.isPremium ? 1000 : 0) +
            (a.isLimited ? 500 : 0) +
            (a.isNew ? 300 : 0) +
            (a.discount || 0) * 10;
          const bScore =
            (b.isPremium ? 1000 : 0) +
            (b.isLimited ? 500 : 0) +
            (b.isNew ? 300 : 0) +
            (b.discount || 0) * 10;
          return bScore - aScore;
        });
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [mototechnicsProducts, searchTerm, selectedCategory, filters, sortOption]);

  const isInFavorit = (productId) => {
    return favorit.some((item) => item.id === productId);
  };

  const handleAddToCart = (product) => {
    addOrder({ ...product, quantity: 1 });
    showNotification(
      t("mototechnics_notifications_added_to_cart", {
        name: product.name || t("products_unknown_model"),
      }),
      "success",
    );
  };

  const handleAddToFavorit = (product) => {
    if (!isInFavorit(product.id)) {
      addFavorit(product);
      showNotification(
        t("mototechnics_notifications_added_to_favorites"),
        "success",
      );
    } else {
      showNotification(
        t("mototechnics_notifications_already_in_favorites"),
        "info",
      );
    }
  };

  const clearFilters = () => {
    setFilters({
      brand: "",
      type: "",
      engineVolume: { min: 0, max: 3000 },
      year: { min: 2000, max: new Date().getFullYear() },
      mileage: { min: 0, max: 100000 },
      price: { min: 0, max: 10000000 },
      condition: "all",
      transmission: "",
      inStock: false,
      discount: false,
    });
    setSelectedCategory("all");
    setSearchTerm("");
    setSortOption("featured");
    setShowAllBrands(false);
    showNotification(t("mototechnics_notifications_filters_cleared"), "info");
  };

  const renderStars = (rating) => {
    const numericRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;

    return (
      <div className={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`${styles.star} ${
              star <= fullStars ? styles.filled : ""
            }`}
          />
        ))}
        {hasHalfStar && (
          <FiStar className={`${styles.star} ${styles.halfStar}`} />
        )}
      </div>
    );
  };

  const uniqueTypes = useMemo(() => {
    const types = [...new Set(mototechnicsProducts.map((p) => p.type))].filter(
      Boolean,
    );
    return types.sort();
  }, [mototechnicsProducts]);

  const uniqueTransmissions = useMemo(() => {
    const transmissions = [
      ...new Set(mototechnicsProducts.map((p) => p.transmission)),
    ].filter(Boolean);
    return transmissions.sort();
  }, [mototechnicsProducts]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.loader}>
          <div className={styles.loadingText}>{t("mototechnics_loading")}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <h3>{t("mototechnics_errors_loading")}</h3>
          <p>{error}</p>
          <button onClick={getProducts} className={styles.retryButton}>
            {t("mototechnics_buttons_retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.catalog}>
      <div className={styles.notificationsContainer}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <div className={styles.heroSection}>
        <div className={styles.heroGradient}></div>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <div className={styles.heroBadge}>
                <span>{t("mototechnics_catalog")}</span>
              </div>
              <h1 className={styles.heroTitle}>{t("mototechnics_title")}</h1>
              <p className={styles.heroSubtitle}>
                {t("mototechnics_description", {
                  count: mototechnicsProducts.length,
                })}
              </p>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  {mototechnicsProducts.length}
                </span>
                <span className={styles.statLabel}>
                  {t("mototechnics_stats_models")}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  {mototechnicsProducts.filter((p) => p.isNew).length}
                </span>
                <span className={styles.statLabel}>
                  {t("mototechnics_stats_new")}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{brands.length}</span>
                <span className={styles.statLabel}>
                  {t("mototechnics_stats_brands")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.categoriesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {t("mototechnics_categories_title")}
            </h2>
            <p className={styles.sectionSubtitle}>
              {t("mototechnics_categories_subtitle")}
            </p>
          </div>
          <div className={styles.categoriesGridTwoRows}>
            {categories.slice(0, 4).map((category) => (
              <button
                key={category.id}
                className={`${styles.categoryItemLarge} ${
                  selectedCategory === category.id ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={styles.categoryNameLarge}>{category.name}</div>
              </button>
            ))}
          </div>

          <div className={styles.categoriesGridTwoRows}>
            {categories.slice(4, 8).map((category) => (
              <button
                key={category.id}
                className={`${styles.categoryItemLarge} ${
                  selectedCategory === category.id ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={styles.categoryNameLarge}>{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.controlPanel}>
            <div className={styles.panelLeft}>
              <div className={styles.resultsCount}>
                <span className={styles.countNumber}>
                  {filteredProducts.length}
                </span>
                <span className={styles.countLabel}>
                  {t("mototechnics_found_models")}
                </span>
              </div>
              <button
                className={styles.filterToggle}
                onClick={() => setShowFilterPanel(!showFilterPanel)}
              >
                <FiFilter />
                <span>{t("mototechnics_filters_title")}</span>
                {activeFiltersCount > 0 && (
                  <span className={styles.filterBadge}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
            <div className={styles.panelRight}>
              <div className={styles.searchBox}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder={t("mototechnics_search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.sortContainer}>
                <label className={styles.sortLabel}>
                  {t("mototechnics_sort_label")}:
                </label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="featured">
                    {t("mototechnics_sort_recommended")}
                  </option>
                  <option value="price-desc">
                    {t("mototechnics_sort_price_desc")}
                  </option>
                  <option value="price-asc">
                    {t("mototechnics_sort_price_asc")}
                  </option>
                  <option value="year-desc">
                    {t("mototechnics_sort_new_first")}
                  </option>
                  <option value="rating-desc">
                    {t("mototechnics_sort_rating")}
                  </option>
                </select>
              </div>
            </div>
          </div>

          {showFilterPanel && (
            <div className={styles.filtersPanel}>
              <div className={styles.filtersHeader}>
                <div className={styles.filtersTitle}>
                  <h3>
                    <FiFilter />
                    {t("mototechnics_filters_title")}
                  </h3>
                  <div className={styles.activeResults}>
                    <span className={styles.resultsCountNumber}>
                      {filteredProducts.length}
                    </span>
                    <span className={styles.resultsCountText}>
                      {t("mototechnics_found")}
                    </span>
                  </div>
                </div>
                <button onClick={clearFilters} className={styles.clearFilters}>
                  <FiX />
                  {t("mototechnics_buttons_clear_all")}
                </button>
              </div>

              <div className={styles.filtersGrid}>
                {/* БРЕНД */}
                <div className={styles.filterSection}>
                  <div className={styles.filterSectionHeader}>
                    <span className={styles.sectionNumber}>01</span>
                    <h4 className={styles.sectionTitle}>
                      {t("mototechnics_filters_brand")}
                    </h4>
                  </div>
                  <div className={styles.brandFilter}>
                    <div className={styles.popularBrands}>
                      <button
                        className={`${styles.brandButton} ${
                          !filters.brand ? styles.active : ""
                        }`}
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, brand: "" }))
                        }
                      >
                        {t("mototechnics_filters_all_brands")}
                      </button>
                      {popularBrands.map((brand) => (
                        <button
                          key={brand}
                          className={`${styles.brandButton} ${
                            filters.brand === brand ? styles.active : ""
                          }`}
                          onClick={() =>
                            setFilters((prev) => ({ ...prev, brand }))
                          }
                        >
                          {brand}
                        </button>
                      ))}
                    </div>

                    {otherBrands.length > 0 && (
                      <>
                        <div className={styles.otherBrands}>
                          {visibleOtherBrands.map((brand) => (
                            <button
                              key={brand}
                              className={`${styles.brandButton} ${
                                filters.brand === brand ? styles.active : ""
                              }`}
                              onClick={() =>
                                setFilters((prev) => ({ ...prev, brand }))
                              }
                            >
                              {brand}
                            </button>
                          ))}
                        </div>

                        {otherBrands.length > 6 && (
                          <button
                            className={styles.showMoreBrands}
                            onClick={() => setShowAllBrands(!showAllBrands)}
                          >
                            {showAllBrands ? (
                              <>
                                <FiChevronUp />
                                {t("mototechnics_buttons_hide")}
                              </>
                            ) : (
                              <>
                                <FiChevronDown />
                                {t("mototechnics_buttons_show_more", {
                                  count: otherBrands.length - 6,
                                })}
                              </>
                            )}
                          </button>
                        )}
                      </>
                    )}

                    {brands.length === 0 && (
                      <div className={styles.noBrands}>
                        <p>{t("mototechnics_no_brands")}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.filterSection}>
                  <div className={styles.filterSectionHeader}>
                    <span className={styles.sectionNumber}>02</span>
                    <h4 className={styles.sectionTitle}>
                      {t("mototechnics_filters_price")}
                    </h4>
                  </div>
                  <div className={styles.priceFilter}>
                    <div className={styles.priceRangeDisplay}>
                      <span className={styles.priceMin}>
                        {formatPrice(filters.price.min)} {t("common_currency")}
                      </span>
                      <div className={styles.priceDivider}></div>
                      <span className={styles.priceMax}>
                        {formatPrice(filters.price.max)} {t("common_currency")}
                      </span>
                    </div>
                    <div className={styles.priceSlider}>
                      <div className={styles.priceSliderTrack}></div>
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="100000"
                        value={filters.price.min}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            price: {
                              ...prev.price,
                              min: parseInt(e.target.value),
                            },
                          }))
                        }
                        className={styles.priceMinSlider}
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="100000"
                        value={filters.price.max}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            price: {
                              ...prev.price,
                              max: parseInt(e.target.value),
                            },
                          }))
                        }
                        className={styles.priceMaxSlider}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.filterSection}>
                  <div className={styles.filterSectionHeader}>
                    <span className={styles.sectionNumber}>03</span>
                    <h4 className={styles.sectionTitle}>
                      {t("mototechnics_filters_condition")}
                    </h4>
                  </div>
                  <div className={styles.conditionFilter}>
                    <div className={styles.conditionCards}>
                      {[
                        {
                          value: "all",
                          label: t("mototechnics_conditions_all"),
                          color: "#6366f1",
                        },
                        {
                          value: "new",
                          label: t("mototechnics_conditions_new"),
                          color: "#10b981",
                        },
                        {
                          value: "used",
                          label: t("mototechnics_conditions_used"),
                          color: "#3b82f6",
                        },
                        {
                          value: "restored",
                          label: t("mototechnics_conditions_restored"),
                          color: "#f59e0b",
                        },
                      ].map((condition) => (
                        <button
                          key={condition.value}
                          className={`${styles.conditionCard} ${
                            filters.condition === condition.value
                              ? styles.active
                              : ""
                          }`}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              condition: condition.value,
                            }))
                          }
                        >
                          <span className={styles.conditionLabel}>
                            {condition.label}
                          </span>
                          {filters.condition === condition.value && (
                            <span className={styles.conditionCheck}>
                              <FiCheck />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.filterSection}>
                  <div className={styles.filterSectionHeader}>
                    <span className={styles.sectionNumber}>04</span>
                    <h4 className={styles.sectionTitle}>
                      {t("mototechnics_filters_engine_volume")}
                    </h4>
                  </div>
                  <div className={styles.volumeFilter}>
                    <div className={styles.volumePresets}>
                      {[
                        {
                          label: t("mototechnics_volume_to_250"),
                          min: 0,
                          max: 250,
                        },
                        { label: "250-500", min: 250, max: 500 },
                        { label: "500-750", min: 500, max: 750 },
                        { label: "750-1000", min: 750, max: 1000 },
                        {
                          label: t("mototechnics_volume_1000_plus"),
                          min: 1000,
                          max: 3000,
                        },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          className={`${styles.volumePreset} ${
                            filters.engineVolume.min === preset.min &&
                            filters.engineVolume.max === preset.max
                              ? styles.active
                              : ""
                          }`}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              engineVolume: {
                                min: preset.min,
                                max: preset.max,
                              },
                            }))
                          }
                        >
                          <span className={styles.volumeLabel}>
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.filterSection}>
                  <div className={styles.filterSectionHeader}>
                    <span className={styles.sectionNumber}>05</span>
                    <h4 className={styles.sectionTitle}>
                      {t("mototechnics_filters_year")}
                    </h4>
                  </div>
                  <div className={styles.yearFilter}>
                    <div className={styles.yearRangeDisplay}>
                      <span className={styles.yearMin}>{filters.year.min}</span>
                      <div className={styles.yearDivider}></div>
                      <span className={styles.yearMax}>{filters.year.max}</span>
                    </div>
                    <div className={styles.yearSlider}>
                      <div className={styles.yearSliderTrack}></div>
                      <input
                        type="range"
                        min="2000"
                        max={new Date().getFullYear()}
                        value={filters.year.min}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            year: {
                              ...prev.year,
                              min: parseInt(e.target.value),
                            },
                          }))
                        }
                        className={styles.yearMinSlider}
                      />
                      <input
                        type="range"
                        min="2000"
                        max={new Date().getFullYear()}
                        value={filters.year.max}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            year: {
                              ...prev.year,
                              max: parseInt(e.target.value),
                            },
                          }))
                        }
                        className={styles.yearMaxSlider}
                      />
                    </div>
                  </div>
                </div>
                {uniqueTransmissions.length > 0 && (
                  <div className={styles.filterSection}>
                    <div className={styles.filterSectionHeader}>
                      <span className={styles.sectionNumber}>06</span>
                      <h4 className={styles.sectionTitle}>
                        {t("mototechnics_filters_transmission")}
                      </h4>
                    </div>
                    <div className={styles.transmissionFilter}>
                      <div className={styles.transmissionOptions}>
                        <button
                          className={`${styles.transmissionButton} ${
                            !filters.transmission ? styles.active : ""
                          }`}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              transmission: "",
                            }))
                          }
                        >
                          {t("mototechnics_filters_all_transmissions")}
                        </button>
                        {uniqueTransmissions.map((transmission) => (
                          <button
                            key={transmission}
                            className={`${styles.transmissionButton} ${
                              filters.transmission === transmission
                                ? styles.active
                                : ""
                            }`}
                            onClick={() =>
                              setFilters((prev) => ({ ...prev, transmission }))
                            }
                          >
                            {transmission}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <div className={styles.activeFilters}>
                  <div className={styles.activeFiltersTitle}>
                    <FiFilter />
                    {t("mototechnics_filters_active")}:
                  </div>
                  <div className={styles.activeFiltersList}>
                    {filters.brand && (
                      <span className={styles.activeFilter}>
                        {filters.brand}
                        <button
                          onClick={() =>
                            setFilters((prev) => ({ ...prev, brand: "" }))
                          }
                        >
                          <FiX />
                        </button>
                      </span>
                    )}
                    {filters.type && (
                      <span className={styles.activeFilter}>
                        {filters.type}
                        <button
                          onClick={() =>
                            setFilters((prev) => ({ ...prev, type: "" }))
                          }
                        >
                          <FiX />
                        </button>
                      </span>
                    )}
                    {filters.transmission && (
                      <span className={styles.activeFilter}>
                        {filters.transmission}
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              transmission: "",
                            }))
                          }
                        >
                          <FiX />
                        </button>
                      </span>
                    )}
                    {filters.condition !== "all" && (
                      <span className={styles.activeFilter}>
                        {filters.condition === "new"
                          ? t("mototechnics_conditions_new")
                          : filters.condition === "used"
                            ? t("mototechnics_conditions_used")
                            : t("mototechnics_conditions_restored")}
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              condition: "all",
                            }))
                          }
                        >
                          <FiX />
                        </button>
                      </span>
                    )}
                    {filters.inStock && (
                      <span className={styles.activeFilter}>
                        {t("mototechnics_filters_in_stock")}
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              inStock: false,
                            }))
                          }
                        >
                          <FiX />
                        </button>
                      </span>
                    )}
                    {filters.discount && (
                      <span className={styles.activeFilter}>
                        {t("mototechnics_filters_with_discount")}
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              discount: false,
                            }))
                          }
                        >
                          <FiX />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.filterActions}>
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className={styles.applyFilters}
                >
                  {t("mototechnics_buttons_apply_filters")}
                  <FiArrowRight className={styles.applyIcon} />
                </button>
                <button onClick={clearFilters} className={styles.resetFilters}>
                  {t("mototechnics_buttons_reset_all")}
                </button>
              </div>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsContent}>
                <h3>{t("mototechnics_no_results_title")}</h3>
                <p>{t("mototechnics_no_results_description")}</p>
                <button onClick={clearFilters} className={styles.resetButton}>
                  <FiX />
                  {t("mototechnics_buttons_reset_filters")}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.productsGrid}>
                {currentItems.map((product) => {
                  const isFavorited = isInFavorit(product.id);
                  const hasDiscount = (product.discount || 0) > 0;
                  const discountPrice = hasDiscount
                    ? product.price * (1 - product.discount / 100)
                    : product.price;
                  const isNewProduct = product.isNew === true;

                  return (
                    <div key={product.id} className={styles.productCard}>
                      <div className={styles.productBadges}>
                        {isNewProduct && (
                          <span
                            className={`${styles.badge} ${styles.newBadge}`}
                          >
                            {t("mototechnics_badges_new")}
                          </span>
                        )}
                        {hasDiscount && (
                          <span
                            className={`${styles.badge} ${styles.discountBadge}`}
                          >
                            -{product.discount}%
                          </span>
                        )}
                        {!product.inStock && (
                          <span
                            className={`${styles.badge} ${styles.outStockBadge}`}
                          >
                            {t("mototechnics_badges_on_order")}
                          </span>
                        )}
                      </div>

                      <div className={styles.productImage}>
                        <Link to={`/motorcycle/${product.id}`}>
                          <img
                            src={
                              product.image ||
                              "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80"
                            }
                            alt={product.name}
                            loading="lazy"
                          />
                        </Link>
                        <div className={styles.productActions}>
                          <button
                            className={`${styles.actionButton} ${
                              isFavorited ? styles.favorited : ""
                            }`}
                            onClick={() => handleAddToFavorit(product)}
                            title={
                              isFavorited
                                ? t("mototechnics_actions_in_favorites")
                                : t("mototechnics_actions_add_to_favorites")
                            }
                          >
                            <FiHeart />
                          </button>
                          <button
                            className={styles.actionButton}
                            onClick={() => handleAddToCart(product)}
                            title={t("mototechnics_actions_add_to_cart")}
                          >
                            <FiShoppingCart />
                          </button>
                          <Link
                            to={`/product/${product.id}`}
                            className={styles.actionButton}
                            title={t("mototechnics_actions_details")}
                          >
                            <FiEye />
                          </Link>
                        </div>
                      </div>

                      <div className={styles.productInfo}>
                        <div className={styles.productHeader}>
                          <span className={styles.productBrand}>
                            {product.brand || t("products_unknown_brand")}
                          </span>
                          <span className={styles.productYear}>
                            {product.year || "—"}
                          </span>
                        </div>

                        <h3 className={styles.productName}>
                          <Link to={`/product/${product.id}`}>
                            {product.name || t("products_unknown_model")}
                          </Link>
                        </h3>

                        <div className={styles.productSpecs}>
                          {product.engineVolume && (
                            <div className={styles.specItem}>
                              <div className={styles.specContent}>
                                <span className={styles.specLabel}>
                                  {t("mototechnics_specs_volume")}
                                </span>
                                <span className={styles.specValue}>
                                  {product.engineVolume}{" "}
                                  {t("mototechnics_specs_cc")}
                                </span>
                              </div>
                            </div>
                          )}
                          {product.power && (
                            <div className={styles.specItem}>
                              <div className={styles.specContent}>
                                <span className={styles.specLabel}>
                                  {t("mototechnics_specs_power")}
                                </span>
                                <span className={styles.specValue}>
                                  {product.power} {t("mototechnics_specs_hp")}
                                </span>
                              </div>
                            </div>
                          )}
                          {product.transmission && (
                            <div className={styles.specItem}>
                              <div className={styles.specContent}>
                                <span className={styles.specLabel}>
                                  {t("mototechnics_specs_transmission")}
                                </span>
                                <span className={styles.specValue}>
                                  {product.transmission}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className={styles.productRating}>
                          {renderStars(product.rating || 0)}
                          <span className={styles.ratingNumber}>
                            {(product.rating || 0).toFixed(1)}
                          </span>
                          <span className={styles.reviewsCount}>
                            ({product.reviews || 0})
                          </span>
                        </div>

                        <div className={styles.productPrice}>
                          {hasDiscount ? (
                            <>
                              <span className={styles.currentPrice}>
                                {formatPriceWithCurrency(discountPrice, "сом")}
                              </span>
                              <span className={styles.oldPrice}>
                                {formatPriceWithCurrency(product.price, "сом")}
                              </span>
                              <span className={styles.discountPercent}>
                                -{product.discount}%
                              </span>
                            </>
                          ) : (
                            <span className={styles.currentPrice}>
                              {formatPriceWithCurrency(product.price, "сом")}
                            </span>
                          )}
                        </div>

                        <div className={styles.productFooter}>
                          <button
                            className={styles.buyButton}
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                          >
                            {product.inStock ? (
                              <>
                                <FiShoppingCart className={styles.buyIcon} />
                                {t("mototechnics_buttons_buy")}
                              </>
                            ) : (
                              t("mototechnics_buttons_on_order")
                            )}
                          </button>
                          <Link
                            to={`/product/${product.id}`}
                            className={styles.detailsButton}
                          >
                            <FiEye />
                            {t("mototechnics_buttons_details")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                  >
                    ← {t("mototechnics_pagination_prev")}
                  </button>

                  <div className={styles.pageNumbers}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`${styles.pageNumber} ${
                            currentPage === pageNum ? styles.active : ""
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className={styles.pageDots}>...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={styles.pageNumber}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                  >
                    {t("mototechnics_pagination_next")} →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.benefitsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <FiShield />
              {t("mototechnics_benefits_title")}
            </h2>
            <p className={styles.sectionSubtitle}>
              {t("mototechnics_benefits_subtitle")}
            </p>
          </div>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <FiShield />
              </div>
              <div className={styles.benefitContent}>
                <h3 className={styles.benefitTitle}>
                  {t("mototechnics_benefits_quality")}
                </h3>
                <p className={styles.benefitDescription}>
                  {t("mototechnics_benefits_quality_desc")}
                </p>
              </div>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <FiTool />
              </div>
              <div className={styles.benefitContent}>
                <h3 className={styles.benefitTitle}>
                  {t("mototechnics_benefits_service")}
                </h3>
                <p className={styles.benefitDescription}>
                  {t("mototechnics_benefits_service_desc")}
                </p>
              </div>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <FiUsers />
              </div>
              <div className={styles.benefitContent}>
                <h3 className={styles.benefitTitle}>
                  {t("mototechnics_benefits_consultation")}
                </h3>
                <p className={styles.benefitDescription}>
                  {t("mototechnics_benefits_consultation_desc")}
                </p>
              </div>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <FiCheck />
              </div>
              <div className={styles.benefitContent}>
                <h3 className={styles.benefitTitle}>
                  {t("mototechnics_benefits_warranty")}
                </h3>
                <p className={styles.benefitDescription}>
                  {t("mototechnics_benefits_warranty_desc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>{t("mototechnics_cta_title")}</h2>
            <p className={styles.ctaDescription}>
              {t("mototechnics_cta_description")}
            </p>
            <button className={styles.ctaButton}>
              <FiUsers />
              {t("mototechnics_cta_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorcycleCatalog;
