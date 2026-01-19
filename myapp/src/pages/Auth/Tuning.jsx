import React, { useEffect, useState } from "react";
import { useProduct } from "../../MainContext/MainContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  formatPriceWithCurrency,
  calculateItemTotal,
} from "../../utils/priceFormatter";
import scss from "./Tuning.module.scss";
import {
  FiFilter,
  FiX,
  FiHeart,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaTimes,
  FaHeart as SolidHeart,
  FaCheck,
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

const Tuning = () => {
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

  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedCompatibility, setSelectedCompatibility] = useState(new Set());
  const [selectedMaterials, setSelectedMaterials] = useState(new Set());
  const [selectedColors, setSelectedColors] = useState(new Set());
  const [selectedBrands, setSelectedBrands] = useState(new Set());

  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [currentPriceRange, setCurrentPriceRange] = useState({
    min: 0,
    max: 1000000,
  });

  const [allBrands, setAllBrands] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [allCompatibility, setAllCompatibility] = useState([]);

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

    const tuningProducts = products.filter(
      (p) => p.category === "Тюнинг и Аксессуары",
    );

    if (tuningProducts.length > 0) {
      const prices = tuningProducts
        .map((p) => parseFloat(p.price) || 0)
        .filter((p) => p > 0);

      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices) / 1000) * 1000;
        const maxPrice = Math.ceil(Math.max(...prices) / 1000) * 1000;
        setPriceRange({ min: minPrice, max: maxPrice });
        setCurrentPriceRange({ min: minPrice, max: maxPrice });
      }
    }

    const uniqueBrands = new Set();
    const uniqueCategories = new Set();
    const uniqueMaterials = new Set();
    const uniqueColors = new Set();
    const uniqueCompatibility = new Set();

    tuningProducts.forEach((product) => {
      if (product.brand) uniqueBrands.add(product.brand);

      if (product.tuningCategory) {
        uniqueCategories.add(product.tuningCategory);
      } else if (product.subcategory) {
        uniqueCategories.add(product.subcategory);
      }

      if (product.material) uniqueMaterials.add(product.material);
      if (product.color) uniqueColors.add(product.color);
      if (product.compatibility) uniqueCompatibility.add(product.compatibility);
    });
    setAllBrands(Array.from(uniqueBrands).sort());
    setAllCategories(Array.from(uniqueCategories).sort());
    setAllMaterials(Array.from(uniqueMaterials).sort());
    setAllColors(Array.from(uniqueColors).sort());
    setAllCompatibility(Array.from(uniqueCompatibility).sort());
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

  const isInFavorites = (productId) => {
    return favorites.has(productId);
  };

  const toggleCategory = (category) => {
    const copy = new Set(selectedCategories);
    if (copy.has(category)) copy.delete(category);
    else copy.add(category);
    setSelectedCategories(copy);
  };

  const toggleCompatibility = (type) => {
    const copy = new Set(selectedCompatibility);
    if (copy.has(type)) copy.delete(type);
    else copy.add(type);
    setSelectedCompatibility(copy);
  };

  const toggleMaterial = (material) => {
    const copy = new Set(selectedMaterials);
    if (copy.has(material)) copy.delete(material);
    else copy.add(material);
    setSelectedMaterials(copy);
  };

  const toggleColor = (color) => {
    const copy = new Set(selectedColors);
    if (copy.has(color)) copy.delete(color);
    else copy.add(color);
    setSelectedColors(copy);
  };

  const toggleBrand = (brand) => {
    const copy = new Set(selectedBrands);
    if (copy.has(brand)) copy.delete(brand);
    else copy.add(brand);
    setSelectedBrands(copy);
  };

  const clearAllFilters = () => {
    setQuery("");
    setInStock(false);
    setDiscountOnly(false);
    setSelectedCategories(new Set());
    setSelectedCompatibility(new Set());
    setSelectedMaterials(new Set());
    setSelectedColors(new Set());
    setSelectedBrands(new Set());
    setCurrentPriceRange(priceRange);
    setCurrentPage(1);
    showNotification(t("tuning_notifications_filters_cleared"), "info");
  };

  // Очистка конкретного фильтра
  const clearFilter = (filterName) => {
    switch (filterName) {
      case "categories":
        setSelectedCategories(new Set());
        break;
      case "compatibility":
        setSelectedCompatibility(new Set());
        break;
      case "materials":
        setSelectedMaterials(new Set());
        break;
      case "colors":
        setSelectedColors(new Set());
        break;
      case "brands":
        setSelectedBrands(new Set());
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!products) return;

    let filteredProducts = products.filter((product) => {
      const isTuningRelated = product.category === "Тюнинг и Аксессуары";
      if (!isTuningRelated) return false;

      const searchQuery = query.trim().toLowerCase();
      if (searchQuery) {
        const title = (product.name || product.title || "").toLowerCase();
        const desc = (product.description || "").toLowerCase();
        const brand = (product.brand || "").toLowerCase();
        const category = (
          product.tuningCategory ||
          product.subcategory ||
          ""
        ).toLowerCase();

        if (
          !title.includes(searchQuery) &&
          !desc.includes(searchQuery) &&
          !brand.includes(searchQuery) &&
          !category.includes(searchQuery)
        ) {
          return false;
        }
      }

      if (inStock && product.inStock === false) return false;

      if (discountOnly && (!product.discount || product.discount <= 0))
        return false;

      const price = parseFloat(product.price) || 0;
      if (price < currentPriceRange.min || price > currentPriceRange.max) {
        return false;
      }

      if (selectedCategories.size > 0) {
        const productCategory =
          product.tuningCategory || product.subcategory || "";

        if (!productCategory) return false;

        const productCategoryLower = productCategory.toLowerCase();
        let found = false;

        for (let category of selectedCategories) {
          if (productCategoryLower.includes(category.toLowerCase())) {
            found = true;
            break;
          }
        }

        if (!found) return false;
      }

      if (selectedCompatibility.size > 0) {
        const compatibility = product.compatibility || "";
        if (!compatibility) return false;

        const compatLower = compatibility.toLowerCase();
        let found = false;

        for (let compat of selectedCompatibility) {
          if (compatLower.includes(compat.toLowerCase())) {
            found = true;
            break;
          }
        }

        if (!found) return false;
      }

      if (selectedMaterials.size > 0) {
        const material = product.material || "";
        if (!material) return false;

        const materialLower = material.toLowerCase();
        let found = false;

        for (let mat of selectedMaterials) {
          if (materialLower.includes(mat.toLowerCase())) {
            found = true;
            break;
          }
        }

        if (!found) return false;
      }

      if (selectedColors.size > 0) {
        const color = product.color || "";
        if (!color) return false;

        const colorLower = color.toLowerCase();
        let found = false;

        for (let col of selectedColors) {
          if (colorLower.includes(col.toLowerCase())) {
            found = true;
            break;
          }
        }

        if (!found) return false;
      }

      if (selectedBrands.size > 0) {
        const brand = product.brand || "";
        if (!brand) return false;

        const brandLower = brand.toLowerCase();
        let found = false;

        for (let br of selectedBrands) {
          if (brandLower.includes(br.toLowerCase())) {
            found = true;
            break;
          }
        }

        if (!found) return false;
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
    selectedCategories,
    selectedCompatibility,
    selectedMaterials,
    selectedColors,
    selectedBrands,
    currentPriceRange,
    sortBy,
  ]);

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
      t("tuning_notifications_added_to_cart", {
        name: product.name || product.title || t("tuning_product"),
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
        t("tuning_notifications_removed_from_favorites", {
          name: product.name || product.title || t("tuning_product"),
        }),
        "info",
      );
    } else {
      addFavorit(product);
      const newFavoriteSet = new Set(favorites);
      newFavoriteSet.add(product.id);
      setFavorites(newFavoriteSet);
      showNotification(
        t("tuning_notifications_added_to_favorites", {
          name: product.name || product.title || t("tuning_product"),
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

    if (selectedCategories.size > 0) {
      const categories = Array.from(selectedCategories).slice(0, 2);
      activeFilters.push(
        <span key="categories" className={scss.activeFilter}>
          {t("tuning_active_filters_categories")}: {categories.join(", ")}
          {selectedCategories.size > 2 && ` +${selectedCategories.size - 2}`}
          <button onClick={() => clearFilter("categories")}>×</button>
        </span>,
      );
    }

    if (selectedBrands.size > 0) {
      const brands = Array.from(selectedBrands).slice(0, 2);
      activeFilters.push(
        <span key="brands" className={scss.activeFilter}>
          {t("tuning_active_filters_brands")}: {brands.join(", ")}
          {selectedBrands.size > 2 && ` +${selectedBrands.size - 2}`}
          <button onClick={() => clearFilter("brands")}>×</button>
        </span>,
      );
    }

    if (selectedCompatibility.size > 0) {
      activeFilters.push(
        <span key="compatibility" className={scss.activeFilter}>
          {t("tuning_active_filters_compatibility")}:{" "}
          {Array.from(selectedCompatibility).join(", ")}
          <button onClick={() => clearFilter("compatibility")}>×</button>
        </span>,
      );
    }

    if (selectedMaterials.size > 0) {
      activeFilters.push(
        <span key="materials" className={scss.activeFilter}>
          {t("tuning_active_filters_materials")}:{" "}
          {Array.from(selectedMaterials).join(", ")}
          <button onClick={() => clearFilter("materials")}>×</button>
        </span>,
      );
    }

    if (selectedColors.size > 0) {
      activeFilters.push(
        <span key="colors" className={scss.activeFilter}>
          {t("tuning_active_filters_colors")}:{" "}
          {Array.from(selectedColors).join(", ")}
          <button onClick={() => clearFilter("colors")}>×</button>
        </span>,
      );
    }

    if (discountOnly) {
      activeFilters.push(
        <span key="discount" className={scss.activeFilter}>
          {t("tuning_active_filters_discount_only")}
          <button onClick={() => setDiscountOnly(false)}>×</button>
        </span>,
      );
    }

    if (inStock) {
      activeFilters.push(
        <span key="stock" className={scss.activeFilter}>
          <FaCheck style={{ marginRight: 4 }} />
          {t("tuning_active_filters_in_stock")}
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
          {t("tuning_active_filters_price")}: {currentPriceRange.min} -{" "}
          {currentPriceRange.max} {t("common_currency")}
          <button onClick={() => setCurrentPriceRange(priceRange)}>×</button>
        </span>,
      );
    }

    return activeFilters;
  };

  return (
    <div className={`${scss.categoryPage} ${scss.tuningPage}`}>
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
          <h1>{t("tuning_page_title")}</h1>
          <p>{t("tuning_page_description")}</p>
        </div>

        <div className={scss.tuningInner}>
          <aside className={scss.sidebar}>
            <div className={scss.filterBlock}>
              <div className={scss.filterHeader}>
                <h3>{t("tuning_filters")}</h3>
                <button className={scss.clearAll} onClick={clearAllFilters}>
                  {t("tuning_clear_all_filters")}
                </button>
              </div>

              <div className={scss.filterSection}>
                <label className={scss.filterLabel}>
                  <span>{t("tuning_search_by_name")}</span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("tuning_search_placeholder")}
                  />
                </label>
              </div>

              <div className={scss.filterSection}>
                <h4>{t("tuning_basic_filters")}</h4>
                <div className={scss.checkboxGroup}>
                  <label className={scss.customCheck}>
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={() => setInStock(!inStock)}
                    />
                    <span>{t("tuning_in_stock")}</span>
                  </label>
                  <label className={scss.customCheck}>
                    <input
                      type="checkbox"
                      checked={discountOnly}
                      onChange={() => setDiscountOnly(!discountOnly)}
                    />
                    <span>{t("tuning_discount_only")}</span>
                  </label>
                </div>
              </div>

              <div className={scss.filterSection}>
                <h4>
                  {t("tuning_price_range")}: {t("common_currency")}
                </h4>
                <div className={scss.priceRange}>
                  <div className={scss.priceInputs}>
                    <input
                      type="number"
                      value={currentPriceRange.min}
                      onChange={(e) =>
                        setCurrentPriceRange({
                          ...currentPriceRange,
                          min: parseInt(e.target.value) || priceRange.min,
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
                  <div className={scss.rangeSliderContainer}>
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
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterSectionHeader}>
                  <h4>{t("tuning_categories")}</h4>
                  {selectedCategories.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("categories")}
                    >
                      {t("tuning_clear")}
                    </button>
                  )}
                </div>
                <div className={`${scss.checkboxGroup} ${scss.scrollable}`}>
                  {allCategories.map((category) => (
                    <label key={category} className={scss.customCheck}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(category)}
                        onChange={() => toggleCategory(category)}
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterSectionHeader}>
                  <h4>{t("tuning_brands")}</h4>
                  {selectedBrands.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("brands")}
                    >
                      {t("tuning_clear")}
                    </button>
                  )}
                </div>
                <div className={`${scss.checkboxGroup} ${scss.scrollable}`}>
                  {allBrands.map((brand) => (
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
                <div className={scss.filterSectionHeader}>
                  <h4>{t("tuning_compatibility")}</h4>
                  {selectedCompatibility.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("compatibility")}
                    >
                      {t("tuning_clear")}
                    </button>
                  )}
                </div>
                <div className={`${scss.checkboxGroup} ${scss.scrollable}`}>
                  {allCompatibility.map((type) => (
                    <label key={type} className={scss.customCheck}>
                      <input
                        type="checkbox"
                        checked={selectedCompatibility.has(type)}
                        onChange={() => toggleCompatibility(type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterSectionHeader}>
                  <h4>{t("tuning_materials")}</h4>
                  {selectedMaterials.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("materials")}
                    >
                      {t("tuning_clear")}
                    </button>
                  )}
                </div>
                <div className={`${scss.checkboxGroup} ${scss.scrollable}`}>
                  {allMaterials.map((material) => (
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

              <div className={scss.filterSection}>
                <div className={scss.filterSectionHeader}>
                  <h4>{t("tuning_colors")}</h4>
                  {selectedColors.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("colors")}
                    >
                      {t("tuning_clear")}
                    </button>
                  )}
                </div>
                <div className={`${scss.checkboxGroup} ${scss.scrollable}`}>
                  {allColors.map((color) => (
                    <label key={color} className={scss.customCheck}>
                      <input
                        type="checkbox"
                        checked={selectedColors.has(color)}
                        onChange={() => toggleColor(color)}
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className={scss.main}>
            <div className={scss.controls}>
              <div className={scss.resultsInfo}>
                <strong>{filtered.length}</strong> {t("tuning_products_found")}
                {renderActiveFilters().length > 0 && (
                  <div className={scss.activeFilters}>
                    <span>{t("tuning_applied_filters")}:</span>
                    {renderActiveFilters()}
                  </div>
                )}
              </div>
              <div className={scss.sort}>
                <label>
                  {t("tuning_sort_by")}:
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">{t("tuning_sort_default")}</option>
                    <option value="price-asc">
                      {t("tuning_sort_price_asc")}
                    </option>
                    <option value="price-desc">
                      {t("tuning_sort_price_desc")}
                    </option>
                    <option value="discount">
                      {t("tuning_sort_discount")}
                    </option>
                    <option value="rating">{t("tuning_sort_rating")}</option>
                    <option value="popularity">
                      {t("tuning_sort_popularity")}
                    </option>
                    <option value="newest">{t("tuning_sort_newest")}</option>
                  </select>
                </label>
              </div>
            </div>

            <div className={scss.productsGrid}>
              {loading ? (
                <div className={scss.loading}>
                  <div className={scss.spinner}></div>
                  <p>{t("tuning_loading_products")}</p>
                </div>
              ) : currentItems.length === 0 ? (
                <div className={scss.noResults}>
                  <img
                    src="/src/assets/icons/no-results.svg"
                    alt={t("tuning_no_results_alt")}
                  />
                  <h3>{t("tuning_no_results_title")}</h3>
                  <p>{t("tuning_no_results_description")}</p>
                  <button onClick={clearAllFilters}>
                    {t("tuning_no_results_reset_filters")}
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
                      <Link
                        to={`/product/${product.id}`}
                        className={scss.cardLink}
                      >
                        <div className={scss.cardImage}>
                          <img
                            src={
                              product.image ||
                              "/src/assets/images/product-placeholder.jpg"
                            }
                            alt={
                              product.name ||
                              product.title ||
                              t("tuning_accessory")
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
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToFavorites(product);
                            }}
                            title={
                              isFavorite
                                ? t("tuning_in_favorites")
                                : t("tuning_add_to_favorites")
                            }
                          >
                            {isFavorite ? (
                              <SolidHeart className={scss.favoriteIcon} />
                            ) : (
                              <img
                                src="./src/assets/icons/Wishlist (1).svg"
                                alt={t("tuning_add_to_favorites")}
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
                              -{product.discount}%
                            </div>
                          )}
                          {product.inStock === false && (
                            <div className={scss.outOfStock}>
                              {t("tuning_out_of_stock")}
                            </div>
                          )}
                          {product.isNew && (
                            <div className={scss.newBadge}>
                              {t("tuning_new_badge")}
                            </div>
                          )}
                        </div>
                        <div className={scss.cardContent}>
                          <div className={scss.cardHeader}>
                            <div className={scss.brand}>
                              {product.brand || t("tuning_no_brand")}
                            </div>
                            {product.tuningCategory && (
                              <div className={scss.category}>
                                {product.tuningCategory}
                              </div>
                            )}
                          </div>
                          <h3 className={scss.title}>
                            {product.name ||
                              product.title ||
                              t("tuning_accessory")}
                          </h3>
                          <div className={scss.details}>
                            {product.compatibility && (
                              <span className={scss.detailItem}>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {product.compatibility}
                              </span>
                            )}
                            {product.material && (
                              <span className={scss.detailItem}>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M3 21H21M3 7V8C3 8.79565 3.31607 9.55871 3.87868 10.1213C4.44129 10.6839 5.20435 11 6 11C6.79565 11 7.55871 10.6839 8.12132 10.1213C8.68393 9.55871 9 8.79565 9 8V7M3 7H21M3 7L5 3H19L21 7M9 7V8C9 8.79565 9.31607 9.55871 9.87868 10.1213C10.4413 10.6839 11.2044 11 12 11C12.7956 11 13.5587 10.6839 14.1213 10.1213C14.6839 9.55871 15 8.79565 15 8V7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {product.material}
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
                        </div>
                      </Link>
                      <div className={scss.cardActions}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className={`${scss.addToCart} `}
                          disabled={!product.inStock}
                        >
                          {t("tuning_add_to_cart")}
                        </button>
                        <Link to={`/product/${product.id}`}>
                          <button className={scss.detailsBtn}>
                            {t("tuning_details")}
                          </button>
                        </Link>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t("tuning_pagination_back")}
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
                  {t("tuning_pagination_next")}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Tuning;
