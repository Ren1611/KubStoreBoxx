import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProduct } from "../../MainContext/MainContext";
import { useTranslation } from "react-i18next";
import {
  formatPriceWithCurrency,
  formatPrice,
} from "../../utils/priceFormatter";
import styles from "./Catalog.module.scss";
import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaEye,
  FaCheck,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaTags,
  FaLayerGroup,
  FaTimesCircle,
  FaSlidersH,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

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
        return <FaCheckCircle className={styles.notificationIconSuccess} />;
      case "info":
        return <FaInfoCircle className={styles.notificationIconInfo} />;
      default:
        return <FaInfoCircle className={styles.notificationIconDefault} />;
    }
  };

  return (
    <div className={`${styles.notification} ${styles[`notification${type}`]}`}>
      {getIcon()}
      <span className={styles.notificationMessage}>{message}</span>
      <button className={styles.notificationClose} onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
});

Notification.displayName = "Notification";

const RatingStars = React.memo(({ rating }) => {
  return (
    <div className={styles.ratingStars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={star <= rating ? styles.starActive : styles.starInactive}
        />
      ))}
      <span className={styles.ratingNumber}>({rating})</span>
    </div>
  );
});

RatingStars.displayName = "RatingStars";

const ProductCard = React.memo(
  ({
    product,
    onAddToCart,
    onAddToFavorit,
    onShowNotification,
    isFavorited,
  }) => {
    const { t } = useTranslation();

    const hasDiscount = product.discount > 0;
    const discountPrice = hasDiscount
      ? product.price * (1 - product.discount / 100)
      : product.price;

    const [imageLoaded, setImageLoaded] = useState(false);

    const handleAddToCartClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onAddToCart(product);
      onShowNotification(
        t("notifications_added_to_cart", { name: product.name }),
        "success",
      );
    };

    const handleAddToFavoritClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onAddToFavorit(product);
      const message = isFavorited
        ? t("notifications_removed_from_favorites")
        : t("notifications_added_to_favorites");
      onShowNotification(message, isFavorited ? "info" : "success");
    };

    return (
      <div className={styles.productCard}>
        {hasDiscount && (
          <div className={styles.discountBadge}>-{product.discount}%</div>
        )}

        {product.isNew && (
          <div className={styles.newBadge}>{t("catalog_badges_new")}</div>
        )}

        <div className={styles.productImage}>
          <Link to={`/product/${product.id}`}>
            {!imageLoaded && <div className={styles.imagePlaceholder}></div>}
            <img
              src={
                product.image ||
                product.images?.[0] ||
                "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              }
              alt={product.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          </Link>

          <div className={styles.productActions}>
            <button
              className={styles.actionBtn}
              onClick={handleAddToCartClick}
              title={t("cart_title")}
            >
              <FaShoppingCart />
            </button>
            <button
              className={`${styles.actionBtn} ${
                isFavorited ? styles.favorited : ""
              }`}
              onClick={handleAddToFavoritClick}
              title={
                isFavorited
                  ? t("favorites_added")
                  : t("catalog_actions_add_to_favorites")
              }
            >
              <FaHeart />
            </button>
            <Link
              to={`/product/${product.id}`}
              className={styles.actionBtn}
              title={t("catalog_actions_view_details")}
            >
              <FaEye />
            </Link>
          </div>
        </div>

        <div className={styles.productInfo}>
          <div className={styles.productCategory}>
            {t(product.category, product.category)}
          </div>
          <h3 className={styles.productName}>
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>

          <div className={styles.productMeta}>
            <span className={styles.productBrand}>{product.brand}</span>
            {product.rating > 0 && <RatingStars rating={product.rating} />}
          </div>

          <div className={styles.productAvailability}>
            {product.inStock ? (
              <span className={styles.inStock}>
                <FaCheck /> {t("products_in_stock")}
              </span>
            ) : (
              <span className={styles.outOfStock}>
                <FaTimes /> {t("products_out_of_stock")}
              </span>
            )}
          </div>

          <div className={styles.productPrice}>
            {hasDiscount ? (
              <>
                <span className={styles.currentPrice}>
                  {formatPriceWithCurrency(discountPrice)}
                </span>
                <span className={styles.oldPrice}>
                  {formatPriceWithCurrency(product.price)}
                </span>
              </>
            ) : (
              <span className={styles.currentPrice}>
                {formatPriceWithCurrency(product.price)}
              </span>
            )}
          </div>

          <button
            className={styles.addToCartBtn}
            onClick={handleAddToCartClick}
            disabled={!product.inStock}
          >
            <FaShoppingCart />
            {product.inStock
              ? t("products_add_to_cart")
              : t("products_out_of_stock")}
          </button>
        </div>
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";

const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();

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

  const pageNumbers = generatePageNumbers();

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.paginationBtn}
      >
        <FaChevronLeft /> {t("buttons_back")}
      </button>

      <div className={styles.pageNumbers}>
        {currentPage > 3 && totalPages > 5 && (
          <>
            <button onClick={() => onPageChange(1)} className={styles.pageBtn}>
              1
            </button>
            {currentPage > 4 && <span className={styles.pageDots}>...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`${styles.pageBtn} ${
              currentPage === number ? styles.active : ""
            }`}
          >
            {number}
          </button>
        ))}

        {currentPage < totalPages - 2 && totalPages > 5 && (
          <>
            {currentPage < totalPages - 3 && (
              <span className={styles.pageDots}>...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={styles.pageBtn}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.paginationBtn}
      >
        {t("buttons_next")} <FaChevronRight />
      </button>
    </div>
  );
});

Pagination.displayName = "Pagination";

// Панель фильтров
const FilterPanel = React.memo(
  ({
    show,
    filters,
    categories,
    brands,
    maxProductPrice,
    onFilterChange,
    onClearFilters,
    onClose,
    hasActiveFilters,
  }) => {
    const { t } = useTranslation();

    if (!show) return null;

    return (
      <div className={styles.filterPanel}>
        <div className={styles.filterPanelHeader}>
          <h3>
            <FaSlidersH /> {t("catalog_filters_title")}
          </h3>
          <div className={styles.filterPanelActions}>
            {hasActiveFilters && (
              <button onClick={onClearFilters} className={styles.clearAllBtn}>
                <FaTimesCircle /> {t("catalog_filters_clear_all")}
              </button>
            )}
            <button onClick={onClose} className={styles.closeFiltersBtn}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className={styles.filterPanelContent}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              <FaLayerGroup /> {t("products_category")}
            </label>
            <div className={styles.categoryChips}>
              <button
                className={`${styles.categoryChip} ${
                  filters.category === "" ? styles.active : ""
                }`}
                onClick={() => onFilterChange({ category: "" })}
              >
                {t("catalog_filters_all_categories")}
              </button>
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category}
                  className={`${styles.categoryChip} ${
                    filters.category === category ? styles.active : ""
                  }`}
                  onClick={() =>
                    onFilterChange({
                      category: filters.category === category ? "" : category,
                    })
                  }
                >
                  {t(category, category)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t("products_brand")}</label>
            <select
              value={filters.brand}
              onChange={(e) => onFilterChange({ brand: e.target.value })}
              className={styles.brandSelect}
            >
              <option value="">{t("catalog_filters_all_brands")}</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              {t("catalog_filters_price_up_to")}:{" "}
              {formatPriceWithCurrency(filters.maxPrice)}
            </label>
            <div className={styles.priceSliderContainer}>
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                step="100"
                value={filters.maxPrice}
                onChange={(e) =>
                  onFilterChange({
                    maxPrice: parseInt(e.target.value),
                  })
                }
                className={styles.priceSlider}
              />
              <div className={styles.priceLabels}>
                <span>0 {t("catalog_common_currency", "сом")}</span>
                <span>{formatPriceWithCurrency(maxProductPrice)}</span>
              </div>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) =>
                    onFilterChange({ inStock: e.target.checked })
                  }
                />
                <span className={styles.checkmark}></span>
                <span className={styles.checkboxText}>
                  <FaCheck /> {t("catalog_filters_in_stock")}
                </span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.discount}
                  onChange={(e) =>
                    onFilterChange({ discount: e.target.checked })
                  }
                />
                <span className={styles.checkmark}></span>
                <span className={styles.checkboxText}>
                  <FaTags /> {t("catalog_filters_with_discount")}
                </span>
              </label>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <ActiveFilters
            filters={filters}
            maxProductPrice={maxProductPrice}
            onFilterChange={onFilterChange}
          />
        )}
      </div>
    );
  },
);

FilterPanel.displayName = "FilterPanel";

const ActiveFilters = React.memo(
  ({ filters, maxProductPrice, onFilterChange }) => {
    const { t } = useTranslation();

    return (
      <div className={styles.activeFiltersBar}>
        <span className={styles.activeFiltersLabel}>
          {t("catalog_filters_applied")}:
        </span>
        <div className={styles.activeFiltersList}>
          {filters.category && (
            <span className={styles.activeFilter}>
              {t("products_category")}: {t(filters.category, filters.category)}
              <button onClick={() => onFilterChange({ category: "" })}>
                <FaTimes />
              </button>
            </span>
          )}
          {filters.brand && (
            <span className={styles.activeFilter}>
              {t("products_brand")}: {filters.brand}
              <button onClick={() => onFilterChange({ brand: "" })}>
                <FaTimes />
              </button>
            </span>
          )}
          {filters.inStock && (
            <span className={styles.activeFilter}>
              {t("catalog_filters_in_stock")}
              <button onClick={() => onFilterChange({ inStock: false })}>
                <FaTimes />
              </button>
            </span>
          )}
          {filters.discount && (
            <span className={styles.activeFilter}>
              {t("catalog_filters_with_discount")}
              <button onClick={() => onFilterChange({ discount: false })}>
                <FaTimes />
              </button>
            </span>
          )}
          {filters.maxPrice < maxProductPrice && (
            <span className={styles.activeFilter}>
              {t("catalog_filters_up_to")}{" "}
              {formatPriceWithCurrency(filters.maxPrice)}
              <button
                onClick={() =>
                  onFilterChange({
                    maxPrice: maxProductPrice,
                  })
                }
              >
                <FaTimes />
              </button>
            </span>
          )}
        </div>
      </div>
    );
  },
);

ActiveFilters.displayName = "ActiveFilters";

const Catalog = () => {
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

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [sortOption, setSortOption] = useState("default");
  const [initialLoad, setInitialLoad] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    minPrice: 0,
    maxPrice: 5000,
    inStock: false,
    discount: false,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [categories, brands] = useMemo(() => {
    if (!products.length) return [[], []];

    const categoriesSet = new Set();
    const brandsSet = new Set();

    for (const product of products) {
      if (product.category) categoriesSet.add(product.category);
      if (product.brand) brandsSet.add(product.brand);
    }

    return [Array.from(categoriesSet), Array.from(brandsSet)];
  }, [products]);

  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 5000;

    let max = 0;
    for (const product of products) {
      if (product.price > max) max = product.price;
    }
    return max;
  }, [products]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (products.length === 0 && !loading) {
        await getProducts();
      }
      readFavorit();
      setInitialLoad(false);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const newFilters = { ...filters };
    let newSortOption = sortOption;

    const categoryParam = queryParams.get("category");
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam);
      newFilters.category = decodedCategory;
    }

    const brandParam = queryParams.get("brand");
    if (brandParam) {
      const decodedBrand = decodeURIComponent(brandParam);
      newFilters.brand = decodedBrand;
    }

    const sortParam = queryParams.get("sort");
    if (sortParam) {
      if (sortParam === "popular") {
        newSortOption = "rating-desc";
      } else if (sortParam === "newest") {
        newSortOption = "default";
      } else {
        newSortOption = sortParam;
      }
    }

    const discountParam = queryParams.get("discount");
    if (discountParam === "true") {
      newFilters.discount = true;
    }

    const inStockParam = queryParams.get("inStock");
    if (inStockParam === "true") {
      newFilters.inStock = true;
    }

    setFilters(newFilters);
    setSortOption(newSortOption);

    if (
      categoryParam ||
      brandParam ||
      discountParam ||
      inStockParam ||
      sortParam
    ) {
      setShowFilterPanel(true);
    }
  }, [location.search]);

  useEffect(() => {
    if (maxProductPrice > 0 && filters.maxPrice === 5000) {
      setFilters((prev) => ({ ...prev, maxPrice: maxProductPrice }));
    }
  }, [maxProductPrice]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.category) {
      params.set("category", encodeURIComponent(filters.category));
    }

    if (filters.brand) {
      params.set("brand", encodeURIComponent(filters.brand));
    }

    if (filters.inStock) {
      params.set("inStock", "true");
    }

    if (filters.discount) {
      params.set("discount", "true");
    }

    if (sortOption === "rating-desc") {
      params.set("sort", "popular");
    } else if (sortOption === "default") {
      params.set("sort", "newest");
    } else if (sortOption !== "default") {
      params.set("sort", sortOption);
    }

    const newUrl = params.toString()
      ? `/catalog?${params.toString()}`
      : "/catalog";
    navigate(newUrl, { replace: true });
  }, [
    filters.category,
    filters.brand,
    filters.inStock,
    filters.discount,
    sortOption,
    navigate,
  ]);

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    let result = [...products];

    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(term),
      );
    }

    if (filters.category) {
      result = result.filter(
        (product) => product.category === filters.category,
      );
    }

    if (filters.brand) {
      result = result.filter((product) => product.brand === filters.brand);
    }

    result = result.filter(
      (product) =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice,
    );

    if (filters.inStock) {
      result = result.filter((product) => product.inStock);
    }

    if (filters.discount) {
      result = result.filter((product) => product.discount > 0);
    }

    return [...result].sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "rating-desc":
          return b.rating - a.rating;
        case "discount-desc":
          return (b.discount || 0) - (a.discount || 0);
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });
  }, [products, debouncedSearchTerm, filters, sortOption]);

  const hasActiveFilters = useMemo(
    () =>
      filters.category ||
      filters.brand ||
      filters.inStock ||
      filters.discount ||
      filters.maxPrice < maxProductPrice,
    [filters, maxProductPrice],
  );

  const isInFavorit = useCallback(
    (productId) => favorit.some((item) => item.id === productId),
    [favorit],
  );
  const showNotification = useCallback((message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const handleAddToCart = useCallback(
    (product) => {
      const productToAdd = {
        ...product,
        quantity: 1,
      };
      addOrder(productToAdd);
    },
    [addOrder],
  );

  const handleAddToFavorit = useCallback(
    (product) => {
      if (isInFavorit(product.id)) {
        const favorites = JSON.parse(localStorage.getItem("favorit")) || [];
        const updatedFavorites = favorites.filter(
          (item) => item.id !== product.id,
        );
        localStorage.setItem("favorit", JSON.stringify(updatedFavorites));
        readFavorit();
      } else {
        addFavorit(product);
      }
    },
    [addFavorit, isInFavorit, readFavorit],
  );

  const handleFilterChange = useCallback((updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      category: "",
      brand: "",
      minPrice: 0,
      maxPrice: maxProductPrice,
      inStock: false,
      discount: false,
    });
    setSearchTerm("");
    setSortOption("default");
    setCurrentPage(1);
    showNotification(t("catalog_notifications_filters_cleared"), "info");
    navigate("/catalog", { replace: true });
  }, [maxProductPrice, showNotification, navigate, t]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts.length]);

  if (initialLoad || loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="container">
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <p>{t("catalog_loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className="container">
          <div className={styles.errorContent}>
            <h2>{t("messages_error")}</h2>
            <p>{error}</p>
            <button onClick={getProducts} className={styles.retryBtn}>
              {t("catalog_buttons_retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.catalogPage}>
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

      <div className="container">
        <div className={styles.breadcrumbs}>
          <Link to="/">{t("header_home")}</Link>
          <span className={styles.divider}>/</span>
          <span className={styles.current}>{t("navigation_catalog")}</span>
        </div>

        <h1 className={styles.pageTitle}>{t("products_title")}</h1>

        <div className={styles.topControls}>
          <div className={styles.searchBox}>
            <FaSearch />
            <input
              type="text"
              placeholder={t("catalog_search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchTerm("")}
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className={styles.sortControls}>
            <div className={styles.sortSelect}>
              <FaSortAmountDown />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">
                  {t("catalog_sort_options_default")}
                </option>
                <option value="price-asc">
                  {t("catalog_sort_options_price_asc")}
                </option>
                <option value="price-desc">
                  {t("catalog_sort_options_price_desc")}
                </option>
                <option value="name-asc">
                  {t("catalog_sort_options_name_asc")}
                </option>
                <option value="name-desc">
                  {t("catalog_sort_options_name_desc")}
                </option>
                <option value="rating-desc">
                  {t("catalog_sort_options_rating_desc")}
                </option>
                <option value="discount-desc">
                  {t("catalog_sort_options_discount_desc")}
                </option>
              </select>
            </div>

            <button
              className={`${styles.filterToggle} ${
                showFilterPanel ? styles.active : ""
              }`}
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <FaFilter />
              {showFilterPanel
                ? t("catalog_buttons_hide_filters")
                : t("catalog_buttons_show_filters")}
              {hasActiveFilters && !showFilterPanel && (
                <span className={styles.filterBadge}></span>
              )}
            </button>
          </div>
        </div>
        <FilterPanel
          show={showFilterPanel}
          filters={filters}
          categories={categories}
          brands={brands}
          maxProductPrice={maxProductPrice}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onClose={() => setShowFilterPanel(false)}
          hasActiveFilters={hasActiveFilters}
        />

        <div className={styles.resultsInfo}>
          <div className={styles.resultsCount}>
            <p>
              {t("catalog_results_found")}:{" "}
              <strong>{filteredProducts.length}</strong>
            </p>
            {searchTerm && (
              <p className={styles.searchTermInfo}>
                {t("catalog_results_for_query")} "<strong>{searchTerm}</strong>"
              </p>
            )}
            {filters.category && (
              <p className={styles.activeFilterInfo}>
                {t("products_category")}:{" "}
                <strong>{t(filters.category, filters.category)}</strong>
              </p>
            )}
            {filters.brand && (
              <p className={styles.activeFilterInfo}>
                {t("products_brand")}: <strong>{filters.brand}</strong>
              </p>
            )}
            {filters.discount && (
              <p className={styles.activeFilterInfo}>
                {t("catalog_results_showing")}:{" "}
                <strong>{t("catalog_filters_with_discount")}</strong>
              </p>
            )}
          </div>

          {hasActiveFilters && !showFilterPanel && (
            <button
              onClick={() => setShowFilterPanel(true)}
              className={styles.editFiltersBtn}
            >
              <FaFilter /> {t("catalog_buttons_edit_filters")}
            </button>
          )}
        </div>

        <div className={styles.mainContent}>
          {currentItems.length === 0 ? (
            <div className={styles.noResults}>
              <h2>{t("catalog_no_results_title")}</h2>
              <p>{t("catalog_no_results_description")}</p>
              <button
                onClick={handleClearFilters}
                className={styles.clearFiltersBtn}
              >
                {t("catalog_buttons_clear_filters")}
              </button>
            </div>
          ) : (
            <>
              <div className={styles.productsGrid}>
                {currentItems.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToFavorit={handleAddToFavorit}
                    onShowNotification={showNotification}
                    isFavorited={isInFavorit(product.id)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
