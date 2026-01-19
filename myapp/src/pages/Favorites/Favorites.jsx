import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "../../MainContext/MainContext";
import { formatPriceWithCurrency } from "../../utils/priceFormatter";
import { useTranslation } from "react-i18next";
import styles from "./Favorites.module.scss";
import {
  FaHeart,
  FaShoppingCart,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaHeartBroken,
  FaExclamationTriangle,
  FaTag,
  FaFire,
  FaStar,
  FaShippingFast,
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
        return <FaCheck className={styles.notificationIconSuccess} />;
      case "info":
        return (
          <FaExclamationTriangle className={styles.notificationIconInfo} />
        );
      case "error":
        return (
          <FaExclamationTriangle className={styles.notificationIconError} />
        );
      default:
        return (
          <FaExclamationTriangle className={styles.notificationIconDefault} />
        );
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

const FavoriteItem = React.memo(({ product, onRemove, onAddToCart, t }) => {
  const hasDiscount = product.discount > 0;
  const discountPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;
  const isNew = product.isNew || false;
  const isHot = product.isHot || false;
  const rating = product.rating || 4.5;
  const reviewsCount = product.reviewsCount || 12;

  return (
    <div className={styles.favoriteItem}>
      <div className={styles.itemImageContainer}>
        <Link to={`/product/${product.id}`} className={styles.imageLink}>
          <img
            src={
              product.image ||
              "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            }
            alt={product.name}
            loading="lazy"
            className={styles.productImage}
          />
        </Link>

        {isNew && (
          <div className={`${styles.imageBadge} ${styles.newBadge}`}>
            <FaTag /> {t("favorites_badges_new")}
          </div>
        )}

        {isHot && (
          <div className={`${styles.imageBadge} ${styles.hotBadge}`}>
            <FaFire /> {t("favorites_badges_hot")}
          </div>
        )}

        {hasDiscount && (
          <div className={`${styles.imageBadge} ${styles.discountBadge}`}>
            -{product.discount}%
          </div>
        )}

        <button
          className={styles.quickRemoveBtn}
          onClick={() => onRemove(product.id)}
          title={t("favorites_actions_remove_from_favorites")}
        >
          <FaTimes />
        </button>
      </div>

      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <div className={styles.brandCategory}>
            <span className={styles.itemBrand}>{product.brand}</span>
            <span className={styles.itemCategory}>{product.category}</span>
          </div>
          <h3 className={styles.itemName}>
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
        </div>

        <div className={styles.ratingSection}>
          <div className={styles.ratingStars}>
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.floor(rating)
                    ? styles.starFilled
                    : i < rating
                      ? styles.starHalf
                      : styles.starEmpty
                }
              />
            ))}
            <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
          </div>
          <span className={styles.reviewsCount}>
            ({reviewsCount} {t("favorites_reviews")})
          </span>
        </div>

        <div className={styles.availabilitySection}>
          <div className={styles.availabilityInfo}>
            {product.inStock ? (
              <div className={styles.stockStatus}>
                <span className={styles.inStock}>
                  <FaCheck /> {t("favorites_availability_in_stock")}
                </span>
                <span className={styles.deliveryInfo}>
                  <FaShippingFast /> {t("favorites_availability_delivery")}
                </span>
              </div>
            ) : (
              <div className={styles.stockStatus}>
                <span className={styles.outOfStock}>
                  <FaTimes /> {t("favorites_availability_out_of_stock")}
                </span>
                <span className={styles.preorderInfo}>
                  {t("favorites_availability_preorder")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.priceContainer}>
            {hasDiscount ? (
              <>
                <div className={styles.discountPriceRow}>
                  <span className={styles.currentPrice}>
                    {formatPriceWithCurrency(discountPrice)}
                  </span>
                  <span className={styles.pricePerUnit}>
                    {product.unit ? `/ ${product.unit}` : ""}
                  </span>
                </div>
                <div className={styles.oldPriceRow}>
                  <span className={styles.oldPrice}>
                    {formatPriceWithCurrency(product.price)}
                  </span>
                  <span className={styles.discountAmount}>
                    {t("favorites_discount_save")}{" "}
                    {formatPriceWithCurrency(product.price - discountPrice)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <span className={styles.currentPrice}>
                  {formatPriceWithCurrency(product.price)}
                </span>
                <span className={styles.pricePerUnit}>
                  {product.unit ? `/ ${product.unit}` : ""}
                </span>
              </>
            )}
          </div>
        </div>

        <div className={styles.actionsSection}>
          <button
            className={`${styles.actionButton} ${styles.addToCartButton} ${
              !product.inStock ? styles.disabled : ""
            }`}
            onClick={() => product.inStock && onAddToCart(product)}
            disabled={!product.inStock}
          >
            <FaShoppingCart />
            {product.inStock
              ? t("favorites_actions_add_to_cart")
              : t("favorites_availability_out_of_stock")}
          </button>

          <div className={styles.secondaryActions}>
            <Link
              to={`/product/${product.id}`}
              className={`${styles.actionButton} ${styles.viewDetailsButton}`}
            >
              <FaEye /> {t("favorites_actions_view_details")}
            </Link>
            <button
              className={`${styles.actionButton} ${styles.removeButton}`}
              onClick={() => onRemove(product.id)}
              title={t("favorites_actions_remove_from_favorites")}
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <div className={styles.additionalInfo}>
          {product.features && product.features.length > 0 && (
            <div className={styles.features}>
              <span className={styles.featuresLabel}>
                {t("favorites_features_label")}:
              </span>
              <div className={styles.featuresList}>
                {product.features.slice(0, 2).map((feature, index) => (
                  <span key={index} className={styles.feature}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.warranty && (
            <div className={styles.warranty}>
              <span className={styles.warrantyLabel}>
                {t("favorites_warranty_label")}:
              </span>
              <span className={styles.warrantyValue}>{product.warranty}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

FavoriteItem.displayName = "FavoriteItem";

const Favorits = () => {
  const { favorit, readFavorit, deleteFavorit, addOrder } = useProduct();
  const { t } = useTranslation();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const loadFavorites = useCallback(() => {
    try {
      const favoriteData = readFavorit();
      setFavorites(favoriteData);
    } catch (error) {
      console.error("Ошибка загрузки избранного:", error);
    }
  }, [readFavorit]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadFavorites();
      setLoading(false);
    };

    loadData();
  }, [loadFavorites]);

  useEffect(() => {
    if (favorit && Array.isArray(favorit)) {
      setFavorites(favorit);
    }
  }, [favorit]);

  const showNotification = useCallback((message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const handleRemoveFromFavorites = useCallback(
    (productId) => {
      try {
        deleteFavorit(productId);
        showNotification(t("favorites_notifications_removed"), "info");
      } catch (error) {
        console.error("Ошибка удаления из избранного:", error);
        showNotification(t("favorites_notifications_remove_error"), "error");
      }
    },
    [deleteFavorit, showNotification, t],
  );

  const handleAddToCart = useCallback(
    (product) => {
      try {
        const productToAdd = {
          ...product,
          id: product.id || Date.now().toString(),
          quantity: 1,
          addedAt: new Date().toISOString(),
        };
        addOrder(productToAdd);
        showNotification(
          t("favorites_notifications_added_to_cart", {
            name: product.name || t("favorites_product"),
          }),
          "success",
        );
      } catch (error) {
        console.error("Ошибка добавления в корзину:", error);
        showNotification(
          t("favorites_notifications_add_to_cart_error"),
          "error",
        );
      }
    },
    [addOrder, showNotification, t],
  );

  const handleClearAll = useCallback(() => {
    if (favorites.length === 0) return;

    if (window.confirm(t("favorites_confirmations_clear_all"))) {
      try {
        favorites.forEach((item) => {
          deleteFavorit(item.id);
        });
        showNotification(t("favorites_notifications_all_removed"), "info");
      } catch (error) {
        console.error("Ошибка очистки избранного:", error);
        showNotification(t("favorites_notifications_clear_all_error"), "error");
      }
    }
  }, [favorites, deleteFavorit, showNotification, t]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="container">
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <p>{t("favorites_loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favoritesPage}>
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
          <Link to="/">{t("common_breadcrumbs_home")}</Link>
          <span className={styles.divider}>/</span>
          <span className={styles.current}>{t("favorites_title")}</span>
        </div>

        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            <FaHeart /> {t("favorites_title")}
            {favorites.length > 0 && (
              <span className={styles.itemsCountBadge}>{favorites.length}</span>
            )}
          </h1>
          <Link to="/catalog" className={styles.backToCatalog}>
            <FaArrowLeft /> {t("favorites_actions_back_to_catalog")}
          </Link>
        </div>

        <div className={styles.favoritesInfo}>
          <p className={styles.itemsCount}>
            {t("favorites_items_count")}: <strong>{favorites.length}</strong>
          </p>
          {favorites.length > 0 && (
            <button onClick={handleClearAll} className={styles.clearAllBtn}>
              <FaTrash /> {t("favorites_actions_clear_all")}
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className={styles.emptyFavorites}>
            <div className={styles.emptyIcon}>
              <FaHeartBroken />
            </div>
            <h2>{t("favorites_empty_title")}</h2>
            <p>{t("favorites_empty_description")}</p>
            <Link to="/catalog" className={styles.browseCatalogBtn}>
              {t("favorites_actions_browse_catalog")}
            </Link>
          </div>
        ) : (
          <div className={styles.favoritesList}>
            {favorites.map((item) => (
              <FavoriteItem
                key={item.id}
                product={item}
                onRemove={handleRemoveFromFavorites}
                onAddToCart={handleAddToCart}
                t={t}
              />
            ))}
          </div>
        )}

        <div className={styles.infoSection}>
          <h3>{t("favorites_how_it_works_title")}</h3>
          <ul className={styles.infoList}>
            <li>{t("favorites_how_it_works_point1")}</li>
            <li>{t("favorites_how_it_works_point2")}</li>
            <li>{t("favorites_how_it_works_point3")}</li>
            <li>{t("favorites_how_it_works_point4")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Favorits;
