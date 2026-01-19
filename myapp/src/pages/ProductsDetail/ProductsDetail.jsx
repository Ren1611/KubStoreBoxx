import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct } from "../../MainContext/MainContext";
import {
  formatPriceWithCurrency,
  calculateItemTotal,
  formatPrice,
} from "../../utils/priceFormatter";
import { useTranslation } from "react-i18next";
import styles from "./ProductDetail.module.scss";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaArrowLeft,
  FaShareAlt,
  FaTruck,
  FaShieldAlt,
  FaUndo,
} from "react-icons/fa";

const Notification = React.memo(({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.notification}>
      <span className={styles.notificationMessage}>{message}</span>
    </div>
  );
});

Notification.displayName = "Notification";

const ProductsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOneProduct, oneProduct, loading, error, addOrder, addFavorit } =
    useProduct();
  const { t } = useTranslation();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNotification, setShowNotification] = useState("");

  useEffect(() => {
    if (id) {
      getOneProduct(id);
    }
  }, [id]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorit")) || [];
    if (oneProduct) {
      setIsFavorite(favorites.some((item) => item.id === oneProduct.id));
    }
  }, [oneProduct]);

  const handleAddToCart = () => {
    if (oneProduct) {
      const productToAdd = {
        ...oneProduct,
        quantity: quantity,
        addedAt: new Date().toISOString(),
      };
      addOrder(productToAdd);
      showNotificationMessage(t("product_detail_notifications_added_to_cart"));
    }
  };

  const handleBuyNow = () => {
    if (oneProduct) {
      const productToAdd = {
        ...oneProduct,
        quantity: quantity,
        addedAt: new Date().toISOString(),
      };

      addOrder(productToAdd);

      const buyNowProduct = {
        product: productToAdd,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem("buyNowProduct", JSON.stringify(buyNowProduct));

      navigate("/card", { state: { fromBuyNow: true, product: productToAdd } });
    }
  };

  const handleToggleFavorite = () => {
    if (oneProduct) {
      if (isFavorite) {
        const favorites = JSON.parse(localStorage.getItem("favorit")) || [];
        const updatedFavorites = favorites.filter(
          (item) => item.id !== oneProduct.id,
        );
        localStorage.setItem("favorit", JSON.stringify(updatedFavorites));
        setIsFavorite(false);
        showNotificationMessage(
          t("product_detail_notifications_removed_from_favorites"),
        );
      } else {
        addFavorit(oneProduct);
        setIsFavorite(true);
        showNotificationMessage(
          t("product_detail_notifications_added_to_favorites"),
        );
      }
    }
  };

  const showNotificationMessage = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingAnimation}>
          <div className={styles.spinner}></div>
          <p>{t("product_detail_loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !oneProduct) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>{t("product_detail_errors_not_found")}</h2>
          <p>{t("product_detail_errors_not_found_description")}</p>
          <button
            className={styles.backToCatalog}
            onClick={() => navigate("/catalog")}
          >
            <FaArrowLeft /> {t("product_detail_actions_back_to_catalog")}
          </button>
        </div>
      </div>
    );
  }

  const images = Array.isArray(oneProduct.images)
    ? oneProduct.images
    : oneProduct.image
      ? [oneProduct.image]
      : [
          "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ];

  const hasDiscount = oneProduct.discount && oneProduct.discount > 0;
  const discountPrice = hasDiscount
    ? calculateItemTotal(oneProduct.price, oneProduct.discount)
    : formatPrice(oneProduct.price);

  const rating = formatPrice(oneProduct.rating || 4.5);
  const reviewsCount = oneProduct.reviews || 24;

  return (
    <div className={styles.productDetail}>
      {showNotification && (
        <Notification
          message={showNotification}
          onClose={() => setShowNotification("")}
        />
      )}

      <div className={styles.breadcrumbs}>
        <div className="container">
          <Link to="/">{t("common_breadcrumbs_home")}</Link>
          <span className={styles.divider}> / </span>
          <Link to="/catalog">{t("common_breadcrumbs_catalog")}</Link>
          <span className={styles.divider}> / </span>
          <Link to={`/catalog?category=${oneProduct.category}`}>
            {oneProduct.category}
          </Link>
          <span className={styles.divider}> / </span>
          <span className={styles.current}>{oneProduct.name}</span>
        </div>
      </div>

      <div className="container">
        <div className={styles.productMain}>
          <div className={styles.gallerySection}>
            <div className={styles.mainImageWrapper}>
              <div className={styles.imageContainer}>
                <img
                  src={images[selectedImage]}
                  alt={oneProduct.name}
                  className={styles.mainImage}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                  }}
                />
                {hasDiscount && (
                  <div className={styles.discountTag}>
                    -{oneProduct.discount}%
                  </div>
                )}
              </div>

              <div className={styles.imageActions}>
                <button
                  className={styles.wishlistButton}
                  onClick={handleToggleFavorite}
                >
                  <FaHeart
                    className={isFavorite ? styles.favoriteActive : ""}
                  />
                  {isFavorite
                    ? t("product_detail_actions_in_favorites")
                    : t("product_detail_actions_add_to_favorites")}
                </button>
              </div>
            </div>

            {images.length > 1 && (
              <div className={styles.thumbnailGallery}>
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${
                      selectedImage === index ? styles.active : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={img}
                      alt={`${oneProduct.name} ${index + 1}`}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            <div className={styles.productHeader}>
              <span className={styles.brandTag}>{oneProduct.brand}</span>
              <h1 className={styles.productTitle}>{oneProduct.name}</h1>
              <div className={styles.ratingContainer}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.floor(rating)
                          ? styles.starFilled
                          : styles.starEmpty
                      }
                    />
                  ))}
                </div>
                <span className={styles.ratingText}>
                  {rating.toFixed(1)} ({reviewsCount}{" "}
                  {t("product_detail_reviews", { count: reviewsCount })})
                </span>
                <span className={styles.productCode}>
                  {t("product_detail_product_code")}: {oneProduct.id}
                </span>
              </div>
            </div>

            <div className={styles.priceSection}>
              <div className={styles.priceContainer}>
                {hasDiscount ? (
                  <>
                    <div className={styles.discountPrice}>
                      {formatPriceWithCurrency(discountPrice, "сом")}
                    </div>
                    <div className={styles.originalPrice}>
                      {formatPriceWithCurrency(oneProduct.price, "сом")}
                    </div>
                  </>
                ) : (
                  <div className={styles.currentPrice}>
                    {formatPriceWithCurrency(oneProduct.price, "сом")}
                  </div>
                )}
              </div>

              <div className={styles.availability}>
                <span
                  className={
                    oneProduct.inStock ? styles.inStock : styles.outOfStock
                  }
                >
                  {oneProduct.inStock
                    ? t("product_detail_availability_in_stock")
                    : t("product_detail_availability_out_of_stock")}
                </span>
                {oneProduct.inStock && (
                  <span className={styles.deliveryInfo}>
                    {t("product_detail_delivery_info")}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.actionSection}>
              <div className={styles.quantitySelector}>
                <label>{t("product_detail_quantity")}:</label>
                <div className={styles.quantityControls}>
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className={styles.quantityBtn}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      if (val > 0) setQuantity(val);
                    }}
                    className={styles.quantityInput}
                    min="1"
                  />
                  <button
                    onClick={handleIncrement}
                    className={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.actionButtons}>
                <button
                  onClick={handleAddToCart}
                  disabled={!oneProduct.inStock}
                  className={styles.addToCartBtn}
                >
                  <FaShoppingCart />
                  {oneProduct.inStock
                    ? t("product_detail_actions_add_to_cart")
                    : t("product_detail_availability_out_of_stock")}
                </button>
                <button
                  onClick={handleBuyNow}
                  className={styles.buyNowBtn}
                  disabled={!oneProduct.inStock}
                >
                  {t("product_detail_actions_buy_now")}
                </button>
              </div>
            </div>

            <div className={styles.benefits}>
              <div className={styles.benefitItem}>
                <FaTruck className={styles.benefitIcon} />
                <div>
                  <strong>
                    {t("product_detail_benefits_free_shipping_title")}
                  </strong>
                  <p>
                    {t("product_detail_benefits_free_shipping_description")}
                  </p>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <FaShieldAlt className={styles.benefitIcon} />
                <div>
                  <strong>{t("product_detail_benefits_warranty_title")}</strong>
                  <p>{t("product_detail_benefits_warranty_description")}</p>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <FaUndo className={styles.benefitIcon} />
                <div>
                  <strong>{t("product_detail_benefits_return_title")}</strong>
                  <p>{t("product_detail_benefits_return_description")}</p>
                </div>
              </div>
            </div>

            <div className={styles.specsPreview}>
              <h3>{t("product_detail_specifications_title")}</h3>
              <div className={styles.specsGrid}>
                {oneProduct.category && (
                  <div className={styles.specItem}>
                    <span>{t("product_detail_specifications_category")}</span>
                    <strong>{oneProduct.category}</strong>
                  </div>
                )}
                {oneProduct.brand && (
                  <div className={styles.specItem}>
                    <span>{t("product_detail_specifications_brand")}</span>
                    <strong>{oneProduct.brand}</strong>
                  </div>
                )}
                {oneProduct.color && (
                  <div className={styles.specItem}>
                    <span>{t("product_detail_specifications_color")}</span>
                    <strong>{oneProduct.color}</strong>
                  </div>
                )}
                {oneProduct.type && (
                  <div className={styles.specItem}>
                    <span>{t("product_detail_specifications_type")}</span>
                    <strong>{oneProduct.type}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetail;
