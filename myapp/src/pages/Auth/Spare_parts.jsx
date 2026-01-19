import React, { useEffect, useState } from "react";
import { useProduct } from "../../MainContext/MainContext";
import { Link } from "react-router-dom";
import {
  formatPriceWithCurrency,
  calculateItemTotal,
} from "../../utils/priceFormatter";
import scss from "./Spare_parts.module.scss";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaTimes,
  FaShoppingCart,
  FaHeart,
  FaCheck,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

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

const Spare_parts = () => {
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

  const [query, setQuery] = useState("");
  const [inStock, setInStock] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedCompatibility, setSelectedCompatibility] = useState(new Set());
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedPartTypes, setSelectedPartTypes] = useState(new Set());
  const [selectedMaterials, setSelectedMaterials] = useState(new Set());
  const [selectedConditions, setSelectedConditions] = useState(new Set());
  const [selectedQualities, setSelectedQualities] = useState(new Set());

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [currentPriceRange, setCurrentPriceRange] = useState({
    min: 0,
    max: 100000,
  });

  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availablePartTypes, setAvailablePartTypes] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [availableConditions, setAvailableConditions] = useState([]);
  const [availableQualities, setAvailableQualities] = useState([]);
  const [availableCompatibility, setAvailableCompatibility] = useState([]);

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

    const sparePartsProducts = products.filter(
      (p) => p.category === "Моторасходники и З/Ч",
    );

    console.log("Всего запчастей:", sparePartsProducts.length);

    if (sparePartsProducts.length > 0) {
      const prices = sparePartsProducts
        .map((p) => parseFloat(p.price) || 0)
        .filter((p) => p > 0);

      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices) / 1000) * 1000;
        const maxPrice = Math.ceil(Math.max(...prices) / 1000) * 1000;
        setPriceRange({ min: minPrice, max: maxPrice });
        setCurrentPriceRange({ min: minPrice, max: maxPrice });
      }

      const uniqueBrands = new Set();
      const uniqueCategories = new Set();
      const uniquePartTypes = new Set();
      const uniqueMaterials = new Set();
      const uniqueConditions = new Set();
      const uniqueQualities = new Set();
      const uniqueCompatibility = new Set();

      sparePartsProducts.forEach((product) => {
        if (product.brand) uniqueBrands.add(product.brand);

        if (product.sparePartCategory) {
          uniqueCategories.add(product.sparePartCategory);
        }

        if (product.partType) {
          uniquePartTypes.add(product.partType);
        }

        if (product.material) uniqueMaterials.add(product.material);

        if (product.condition) uniqueConditions.add(product.condition);

        if (product.quality) uniqueQualities.add(product.quality);

        if (product.compatibility)
          uniqueCompatibility.add(product.compatibility);
      });

      console.log("Найденные бренды:", Array.from(uniqueBrands));
      console.log("Найденные категории:", Array.from(uniqueCategories));
      console.log("Найденные типы запчастей:", Array.from(uniquePartTypes));
      console.log("Найденные состояния:", Array.from(uniqueConditions));

      setAvailableBrands(Array.from(uniqueBrands).sort());
      setAvailableCategories(Array.from(uniqueCategories).sort());
      setAvailablePartTypes(Array.from(uniquePartTypes).sort());
      setAvailableMaterials(Array.from(uniqueMaterials).sort());
      setAvailableConditions(Array.from(uniqueConditions).sort());
      setAvailableQualities(Array.from(uniqueQualities).sort());
      setAvailableCompatibility(Array.from(uniqueCompatibility).sort());
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

  const toggleBrand = (brand) => {
    const copy = new Set(selectedBrands);
    if (copy.has(brand)) copy.delete(brand);
    else copy.add(brand);
    setSelectedBrands(copy);
  };

  const togglePartType = (type) => {
    const copy = new Set(selectedPartTypes);
    if (copy.has(type)) copy.delete(type);
    else copy.add(type);
    setSelectedPartTypes(copy);
  };

  const toggleMaterial = (material) => {
    const copy = new Set(selectedMaterials);
    if (copy.has(material)) copy.delete(material);
    else copy.add(material);
    setSelectedMaterials(copy);
  };

  const toggleCondition = (condition) => {
    const copy = new Set(selectedConditions);
    if (copy.has(condition)) copy.delete(condition);
    else copy.add(condition);
    setSelectedConditions(copy);
  };

  const toggleQuality = (quality) => {
    const copy = new Set(selectedQualities);
    if (copy.has(quality)) copy.delete(quality);
    else copy.add(quality);
    setSelectedQualities(copy);
  };

  const clearAllFilters = () => {
    setQuery("");
    setInStock(false);
    setDiscountOnly(false);
    setSelectedCategories(new Set());
    setSelectedCompatibility(new Set());
    setSelectedBrands(new Set());
    setSelectedPartTypes(new Set());
    setSelectedMaterials(new Set());
    setSelectedConditions(new Set());
    setSelectedQualities(new Set());
    setCurrentPriceRange(priceRange);
    setCurrentPage(1);
    showNotification(t("spare_parts_notifications_filters_cleared"), "info");
  };

  const clearFilter = (filterName) => {
    switch (filterName) {
      case "categories":
        setSelectedCategories(new Set());
        break;
      case "compatibility":
        setSelectedCompatibility(new Set());
        break;
      case "brands":
        setSelectedBrands(new Set());
        break;
      case "partTypes":
        setSelectedPartTypes(new Set());
        break;
      case "materials":
        setSelectedMaterials(new Set());
        break;
      case "conditions":
        setSelectedConditions(new Set());
        break;
      case "qualities":
        setSelectedQualities(new Set());
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
      const isSparePart = product.category === "Моторасходники и З/Ч";

      if (!isSparePart) return false;

      const searchQuery = query.trim().toLowerCase();
      if (searchQuery) {
        const title = (product.name || product.title || "").toLowerCase();
        const desc = (product.description || "").toLowerCase();
        const brand = (product.brand || "").toLowerCase();
        const partType = (product.partType || "").toLowerCase();

        if (
          !title.includes(searchQuery) &&
          !desc.includes(searchQuery) &&
          !brand.includes(searchQuery) &&
          !partType.includes(searchQuery)
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
        const productCategory = product.sparePartCategory || "";
        if (
          productCategory === "" ||
          !selectedCategories.has(productCategory)
        ) {
          return false;
        }
      }
      if (selectedPartTypes.size > 0) {
        const partType = product.partType || "";
        if (partType === "" || !selectedPartTypes.has(partType)) {
          return false;
        }
      }

      if (selectedCompatibility.size > 0) {
        const compatibility = product.compatibility || "";
        if (compatibility === "" || !selectedCompatibility.has(compatibility)) {
          return false;
        }
      }

      if (selectedBrands.size > 0) {
        const brand = product.brand || "";
        if (brand === "" || !selectedBrands.has(brand)) {
          return false;
        }
      }

      if (selectedMaterials.size > 0) {
        const material = product.material || "";
        if (material === "" || !selectedMaterials.has(material)) {
          return false;
        }
      }

      if (selectedConditions.size > 0) {
        const condition = product.condition || "";
        if (condition === "" || !selectedConditions.has(condition)) {
          return false;
        }
      }

      if (selectedQualities.size > 0) {
        const quality = product.quality || "";
        if (quality === "" || !selectedQualities.has(quality)) {
          return false;
        }
      }

      return true;
    });

    console.log("Фильтрованные запчасти:", filteredProducts.length);
    console.log("Выбранные категории:", Array.from(selectedCategories));
    console.log("Выбранные типы:", Array.from(selectedPartTypes));

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
    selectedBrands,
    selectedPartTypes,
    selectedMaterials,
    selectedConditions,
    selectedQualities,
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
      t("spare_parts_notifications_added_to_cart", {
        name: product.name || product.title || t("spare_parts_part"),
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
        t("spare_parts_notifications_removed_from_favorites", {
          name: product.name || product.title || t("spare_parts_part"),
        }),
        "info",
      );
    } else {
      addFavorit(product);
      const newFavoriteSet = new Set(favorites);
      newFavoriteSet.add(product.id);
      setFavorites(newFavoriteSet);
      showNotification(
        t("spare_parts_notifications_added_to_favorites", {
          name: product.name || product.title || t("spare_parts_part"),
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
      activeFilters.push(
        <span key="categories" className={scss.activeFilter}>
          {t("spare_parts_active_filters_categories")}:{" "}
          {Array.from(selectedCategories).join(", ")}
          <button onClick={() => clearFilter("categories")}>×</button>
        </span>,
      );
    }

    if (selectedBrands.size > 0) {
      activeFilters.push(
        <span key="brands" className={scss.activeFilter}>
          {t("spare_parts_active_filters_brands")}:{" "}
          {Array.from(selectedBrands).join(", ")}
          <button onClick={() => clearFilter("brands")}>×</button>
        </span>,
      );
    }

    if (selectedPartTypes.size > 0) {
      activeFilters.push(
        <span key="partTypes" className={scss.activeFilter}>
          {t("spare_parts_active_filters_part_types")}:{" "}
          {Array.from(selectedPartTypes).join(", ")}
          <button onClick={() => clearFilter("partTypes")}>×</button>
        </span>,
      );
    }

    if (selectedCompatibility.size > 0) {
      activeFilters.push(
        <span key="compatibility" className={scss.activeFilter}>
          {t("spare_parts_active_filters_compatibility")}:{" "}
          {Array.from(selectedCompatibility).join(", ")}
          <button onClick={() => clearFilter("compatibility")}>×</button>
        </span>,
      );
    }

    if (selectedMaterials.size > 0) {
      activeFilters.push(
        <span key="materials" className={scss.activeFilter}>
          {t("spare_parts_active_filters_materials")}:{" "}
          {Array.from(selectedMaterials).join(", ")}
          <button onClick={() => clearFilter("materials")}>×</button>
        </span>,
      );
    }

    if (selectedConditions.size > 0) {
      activeFilters.push(
        <span key="conditions" className={scss.activeFilter}>
          {t("spare_parts_active_filters_conditions")}:{" "}
          {Array.from(selectedConditions).join(", ")}
          <button onClick={() => clearFilter("conditions")}>×</button>
        </span>,
      );
    }

    if (selectedQualities.size > 0) {
      activeFilters.push(
        <span key="qualities" className={scss.activeFilter}>
          {t("spare_parts_active_filters_qualities")}:{" "}
          {Array.from(selectedQualities).join(", ")}
          <button onClick={() => clearFilter("qualities")}>×</button>
        </span>,
      );
    }

    if (discountOnly) {
      activeFilters.push(
        <span key="discount" className={scss.activeFilter}>
          {t("spare_parts_active_filters_discount_only")}
          <button onClick={() => setDiscountOnly(false)}>×</button>
        </span>,
      );
    }

    if (inStock) {
      activeFilters.push(
        <span key="stock" className={scss.activeFilter}>
          <FaCheck style={{ marginRight: 4 }} />
          {t("spare_parts_active_filters_in_stock")}
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
          {t("spare_parts_active_filters_price")}: {currentPriceRange.min} -{" "}
          {currentPriceRange.max} {t("common_currency")}
          <button onClick={() => setCurrentPriceRange(priceRange)}>×</button>
        </span>,
      );
    }

    return activeFilters;
  };

  return (
    <div className={`${scss.categoryPage} ${scss.sparePartsPage}`}>
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
          <h1>{t("spare_parts_page_title")}</h1>
          <p>{t("spare_parts_page_description")}</p>
        </div>

        <div className={scss.sparePartsInner}>
          <aside className={scss.sidebar}>
            <div className={scss.filterBlock}>
              <div className={scss.filterHeader}>
                <h3>{t("spare_parts_basic_filters")}</h3>
                <button className={scss.clearAll} onClick={clearAllFilters}>
                  {t("spare_parts_clear")}
                </button>
              </div>

              <div className={scss.filterSection}>
                <label className={scss.filterLabel}>
                  <span>{t("spare_parts_search_by_name")}</span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("spare_parts_search_placeholder")}
                  />
                </label>
              </div>

              <div className={scss.filterSection}>
                <h4>{t("spare_parts_basic_filters")}</h4>
                <div className={scss.checkboxGroup}>
                  <label className={scss.customCheck}>
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={() => setInStock(!inStock)}
                    />
                    <span>{t("spare_parts_active_filters_in_stock")}</span>
                  </label>
                  <label className={scss.customCheck}>
                    <input
                      type="checkbox"
                      checked={discountOnly}
                      onChange={() => setDiscountOnly(!discountOnly)}
                    />
                    <span>{t("spare_parts_active_filters_discount_only")}</span>
                  </label>
                </div>
              </div>

              <div className={scss.filterSection}>
                <h4>
                  {t("spare_parts_active_filters_price")}:{" "}
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

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("spare_parts_active_filters_categories")}</h4>
                  {selectedCategories.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("categories")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableCategories.length > 0
                    ? availableCategories.map((category) => (
                        <label key={category} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedCategories.has(category)}
                            onChange={() => toggleCategory(category)}
                          />
                          <span>{category}</span>
                        </label>
                      ))
                    : []}
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("spare_parts_part_types")}</h4>
                  {selectedPartTypes.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("partTypes")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availablePartTypes.length > 0
                    ? availablePartTypes.map((type) => (
                        <label key={type} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedPartTypes.has(type)}
                            onChange={() => togglePartType(type)}
                          />
                          <span>{type}</span>
                        </label>
                      ))
                    : []}
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("spare_parts_compatibility")}</h4>
                  {selectedCompatibility.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("compatibility")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableCompatibility.length > 0
                    ? availableCompatibility.map((type) => (
                        <label key={type} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedCompatibility.has(type)}
                            onChange={() => toggleCompatibility(type)}
                          />
                          <span>{type}</span>
                        </label>
                      ))
                    : []}
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("spare_parts_active_filters_brands")}</h4>
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

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("spare_parts_materials")}</h4>
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
                    : []}
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("spare_parts_condition")}</h4>
                  {selectedConditions.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("conditions")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableConditions.length > 0
                    ? availableConditions.map((condition) => (
                        <label key={condition} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedConditions.has(condition)}
                            onChange={() => toggleCondition(condition)}
                          />
                          <span>{condition}</span>
                        </label>
                      ))
                    : []}
                </div>
              </div>

              <div className={scss.filterSection}>
                <div className={scss.filterHeader}>
                  <h4>{t("spare_parts_quality")}</h4>
                  {selectedQualities.size > 0 && (
                    <button
                      className={scss.clearFilter}
                      onClick={() => clearFilter("qualities")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={scss.checkboxGroup}>
                  {availableQualities.length > 0
                    ? availableQualities.map((quality) => (
                        <label key={quality} className={scss.customCheck}>
                          <input
                            type="checkbox"
                            checked={selectedQualities.has(quality)}
                            onChange={() => toggleQuality(quality)}
                          />
                          <span>{quality}</span>
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
                {t("spare_parts_products_found")}
                {renderActiveFilters().length > 0 && (
                  <div className={scss.activeFilters}>
                    <span>{t("spare_parts_applied_filters")}:</span>
                    {renderActiveFilters()}
                  </div>
                )}
              </div>
              <div className={scss.sort}>
                <label>
                  {t("spare_parts_sort_by")}:
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">
                      {t("spare_parts_sort_options_default")}
                    </option>
                    <option value="price-asc">
                      {t("spare_parts_sort_options_price_asc")}
                    </option>
                    <option value="price-desc">
                      {t("spare_parts_sort_options_price_desc")}
                    </option>
                    <option value="discount">
                      {t("spare_parts_sort_options_discount")}
                    </option>
                    <option value="rating">
                      {t("spare_parts_sort_options_rating")}
                    </option>
                    <option value="popularity">
                      {t("spare_parts_sort_options_popularity")}
                    </option>
                    <option value="newest">
                      {t("spare_parts_sort_options_newest")}
                    </option>
                  </select>
                </label>
              </div>
            </div>

            <div className={scss.productsGrid}>
              {loading ? (
                <div className={scss.loading}>
                  <div className={scss.spinner}></div>
                  <p>{t("spare_parts_loading")}</p>
                </div>
              ) : currentItems.length === 0 ? (
                <div className={scss.noResults}>
                  <img
                    src="/src/assets/icons/no-results.svg"
                    alt={t("spare_parts_no_results_title")}
                  />
                  <h3>{t("spare_parts_no_results_title")}</h3>
                  <p>{t("spare_parts_no_results_description")}</p>
                  <button onClick={clearAllFilters}>
                    {t("spare_parts_no_results_reset_filters")}
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
                            t("spare_parts_part")
                          }
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1565689221354-d87f85d4aee2?w=600&auto=format&fit=crop&q=60";
                          }}
                        />
                        <button
                          className={`${scss.favoriteBtn} ${
                            isFavorite ? scss.favoriteActive : ""
                          }`}
                          onClick={() => handleAddToFavorites(product)}
                          title={
                            isFavorite
                              ? t("spare_parts_in_favorites")
                              : t("spare_parts_add_to_favorites")
                          }
                        >
                          {isFavorite ? (
                            <FaHeart className={scss.favoriteIcon} />
                          ) : (
                            <img
                              src="./src/assets/icons/Wishlist (1).svg"
                              alt={t("spare_parts_add_to_favorites")}
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
                            {t("spare_parts_out_of_stock")}
                          </div>
                        )}
                      </div>
                      <div className={scss.cardContent}>
                        <div className={scss.cardHeader}>
                          <div className={scss.brand}>{product.brand}</div>
                          {product.sparePartCategory && (
                            <div className={scss.category}>
                              {product.sparePartCategory}
                            </div>
                          )}
                        </div>
                        <h3 className={scss.title}>
                          {product.name ||
                            product.title ||
                            t("spare_parts_part")}
                        </h3>
                        <div className={scss.details}>
                          {product.partType && (
                            <span className={scss.detailItem}>
                              {t("spare_parts_part_type_label")}:{" "}
                              {product.partType}
                            </span>
                          )}
                          {product.compatibility && (
                            <span className={scss.detailItem}>
                              {t("spare_parts_compatibility_label")}:{" "}
                              {product.compatibility}
                            </span>
                          )}
                          {product.material && (
                            <span className={scss.detailItem}>
                              {t("spare_parts_material_label")}:{" "}
                              {product.material}
                            </span>
                          )}
                          {product.condition && (
                            <span className={scss.detailItem}>
                              {t("spare_parts_condition_label")}:{" "}
                              {product.condition}
                            </span>
                          )}
                          {product.quality && (
                            <span className={scss.detailItem}>
                              {t("spare_parts_quality_label")}:{" "}
                              {product.quality}
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
                            {t("spare_parts_add_to_cart")}
                          </button>
                          <Link to={`/product/${product.id}`}>
                            <button className={scss.detailsBtn}>
                              {t("spare_parts_details")}
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
                  {t("common_pagination_prev")}
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
                  {t("common_pagination_next")}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Spare_parts;
