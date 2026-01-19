import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "../../MainContext/MainContext";
import { formatPriceWithCurrency } from "../../utils/priceFormatter";
import styles from "./Stock.module.scss";
import Slider from "./Slider";
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
        return "✓";
      case "info":
        return "ℹ";
      default:
        return "ℹ";
    }
  };

  return (
    <div className={`${styles.notification} ${styles[`notification${type}`]}`}>
      <span className={styles.notificationIcon}>{getIcon()}</span>
      <span className={styles.notificationMessage}>{message}</span>
      <button className={styles.notificationClose} onClick={onClose}>
        ×
      </button>
    </div>
  );
});

Notification.displayName = "Notification";

const NewsPage = () => {
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

  const [notifications, setNotifications] = useState([]);

  const newsData = [
    {
      id: 1,
      date: t("news_promo_date"),
      title: t("news_promo_title"),
      type: "promo",
      location: t("news_promo_location"),
      dates: t("news_promo_dates"),
      subtitle: t("news_promo_subtitle"),
      promoText: t("news_promo_text"),
      icon: "🔥",
      color: "#FF4757",
    },
    {
      id: 4,
      date: t("news_closed_date"),
      title: t("news_closed_title"),
      description: t("news_closed_description"),
      details: t("news_closed_details"),
      type: "closed",
      icon: "🚫",
      color: "#747D8C",
    },
    {
      id: 5,
      date: t("news_info_date"),
      timestamp: t("news_info_timestamp"),
      type: "info",
      icon: "🏍️",
      color: "#FFA502",
    },
    {
      id: 6,
      date: t("news_gift_date"),
      timestamp: t("news_gift_timestamp"),
      type: "gift",
      icon: "🎁",
      color: "#FF6B81",
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (products.length === 0) {
      getProducts();
    }
    readFavorit();
  }, []);

  useEffect(() => {
    const discountedProducts = products.filter(
      (product) => product.discount && product.discount >= 30,
    );
    setFilteredProducts(discountedProducts);
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

  const isInFavorit = (productId) => {
    return favorit.some((item) => item.id === productId);
  };

  const handleAddToCart = (product) => {
    addOrder({ ...product, quantity: 1 });
    showNotification(
      t("notification_added_to_cart", {
        name: product.name || t("unknown_model"),
      }),
      "success",
    );
  };

  const handleAddToFavorit = (product) => {
    if (!isInFavorit(product.id)) {
      addFavorit(product);
      showNotification(t("notification_added_to_favorites"), "success");
    } else {
      showNotification(t("notification_already_in_favorites"), "info");
    }
  };

  const categories = [
    { id: "all", name: t("category_all"), count: newsData.length },
    {
      id: "promo",
      name: t("category_promo"),
      count: newsData.filter((n) => n.type === "promo").length,
    },
    {
      id: "opening",
      name: t("category_opening"),
      count: newsData.filter((n) => n.type === "opening").length,
    },
    {
      id: "schedule",
      name: t("category_schedule"),
      count: newsData.filter((n) => n.type === "schedule").length,
    },
    {
      id: "gift",
      name: t("category_gift"),
      count: newsData.filter((n) => n.type === "gift").length,
    },
  ];

  const filteredNews = newsData.filter(
    (news) => selectedCategory === "all" || news.type === selectedCategory,
  );

  const indexOfLastNews = currentPage * itemsPerPage;
  const indexOfFirstNews = indexOfLastNews - itemsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{t("loading_news")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <h3>{t("error_loading_news")}</h3>
          <p>{error}</p>
          <button onClick={getProducts} className={styles.retryButton}>
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  const renderNewsItem = (news) => {
    switch (news.type) {
      case "promo":
        return (
          <div
            className={`${styles.newsCard} ${styles.promoCard}`}
            style={{ borderLeftColor: news.color }}
          >
            <div className={styles.newsHeader}>
              <div
                className={styles.newsIcon}
                style={{ backgroundColor: news.color }}
              >
                {news.icon}
              </div>
              <div className={styles.newsDate}>{news.date}</div>
            </div>
            <div className={styles.newsContent}>
              <h3 className={styles.newsTitle}>{news.title}</h3>
              <div className={styles.locationInfo}>
                <div className={styles.location}>{news.location}</div>
                <div className={styles.dates}>{news.dates}</div>
                <div className={styles.subtitle}>{news.subtitle}</div>
                <div className={styles.promoText}>{news.promoText}</div>
              </div>
            </div>
          </div>
        );

      case "opening":
        return (
          <div
            className={`${styles.newsCard} ${styles.openingCard}`}
            style={{ borderLeftColor: news.color }}
          >
            <div className={styles.newsHeader}>
              <div
                className={styles.newsIcon}
                style={{ backgroundColor: news.color }}
              >
                {news.icon}
              </div>
              <div className={styles.newsDate}>{news.date}</div>
            </div>
            <div className={styles.newsContent}>
              <h3 className={styles.newsTitle}>{news.title}</h3>
              {news.subtitle && (
                <div className={styles.subtitle}>{news.subtitle}</div>
              )}
            </div>
          </div>
        );

      case "schedule":
        return (
          <div
            className={`${styles.newsCard} ${styles.scheduleCard}`}
            style={{ borderLeftColor: news.color }}
          >
            <div className={styles.newsHeader}>
              <div
                className={styles.newsIcon}
                style={{ backgroundColor: news.color }}
              >
                {news.icon}
              </div>
              <div className={styles.newsDate}>{news.date}</div>
            </div>
            <div className={styles.newsContent}>
              <h3 className={styles.newsTitle}>{news.title}</h3>
            </div>
          </div>
        );

      case "closed":
        return (
          <div
            className={`${styles.newsCard} ${styles.closedCard}`}
            style={{ borderLeftColor: news.color }}
          >
            <div className={styles.newsHeader}>
              <div
                className={styles.newsIcon}
                style={{ backgroundColor: news.color }}
              >
                {news.icon}
              </div>
              <div className={styles.newsDate}>{news.date}</div>
            </div>
            <div className={styles.newsContent}>
              <h3 className={styles.newsTitle}>{news.title}</h3>
              <p className={styles.newsDescription}>{news.description}</p>
              <div className={styles.newsDetails}>
                <p className={styles.detailsText}>{news.details}</p>
              </div>
            </div>
          </div>
        );

      case "gift":
        return (
          <div
            className={`${styles.newsCard} ${styles.giftCard}`}
            style={{ borderLeftColor: news.color }}
          >
            <div className={styles.newsHeader}>
              <div
                className={styles.newsIcon}
                style={{ backgroundColor: news.color }}
              >
                {news.icon}
              </div>
              <div className={styles.newsDate}>{news.date}</div>
            </div>
            <div className={styles.newsContent}>
              {news.timestamp && (
                <div className={styles.timestamp}>{news.timestamp}</div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div
            className={`${styles.newsCard} ${styles.infoCard}`}
            style={{ borderLeftColor: news.color }}
          >
            <div className={styles.newsHeader}>
              <div
                className={styles.newsIcon}
                style={{ backgroundColor: news.color }}
              >
                {news.icon}
              </div>
              <div className={styles.newsDate}>{news.date}</div>
            </div>
            <div className={styles.newsContent}>
              {news.timestamp && (
                <div className={styles.timestamp}>{news.timestamp}</div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.newsPage}>
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

      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>{t("news_title")}</h1>
          <p className={styles.pageSubtitle}>{t("news_subtitle")}</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.contentWrapper}>
          <div className={styles.newsColumn}>
            <div className={styles.newsHeader}>
              <h2 className={styles.sectionTitle}>{t("latest_news")}</h2>

              <div className={styles.categoryFilters}>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`${styles.categoryButton} ${
                      selectedCategory === category.id ? styles.active : ""
                    }`}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setCurrentPage(1);
                    }}
                  >
                    {category.name}
                    <span className={styles.categoryCount}>
                      ({category.count})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.newsGrid}>
              {currentNews.map((news) => (
                <div key={news.id} className={styles.newsItem}>
                  {renderNewsItem(news)}
                </div>
              ))}
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
                  ← {t("prev")}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`${styles.pageNumber} ${
                        currentPage === page ? styles.active : ""
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={styles.pageButton}
                >
                  {t("next")} →
                </button>
              </div>
            )}
          </div>

          <div className={styles.productsColumn}>
            <div className={styles.productsSidebar}>
              <h3 className={styles.sidebarTitle}>
                <span className={styles.titleAccent}>
                  {t("sidebar_products")}
                </span>{" "}
                {t("on_sale")}
              </h3>
              <p className={styles.sidebarSubtitle}>{t("discount_from")}</p>

              <div className={styles.discountedProducts}>
                {filteredProducts.slice(0, 4).map((product) => {
                  const isFavorited = isInFavorit(product.id);
                  const discountPrice =
                    product.price * (1 - product.discount / 100);

                  return (
                    <div key={product.id} className={styles.discountedProduct}>
                      <div className={styles.productImage}>
                        <img
                          src={
                            product.image ||
                            "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&q=80"
                          }
                          alt={product.name}
                        />
                        <div className={styles.productDiscount}>
                          -{product.discount}%
                        </div>
                      </div>
                      <div className={styles.productInfo}>
                        <h4 className={styles.productName}>
                          <Link to={`/motorcycle/${product.id}`}>
                            {product.name || t("unknown_model")}
                          </Link>
                        </h4>
                        <div className={styles.productPrice}>
                          <span className={styles.currentPrice}>
                            {formatPriceWithCurrency(discountPrice)}
                          </span>
                          <span className={styles.oldPrice}>
                            {formatPriceWithCurrency(product.price)}
                          </span>
                        </div>
                        <div className={styles.productActions}>
                          <button
                            className={`${styles.favoriteButton} ${
                              isFavorited ? styles.active : ""
                            }`}
                            onClick={() => handleAddToFavorit(product)}
                            title={
                              isFavorited
                                ? t("in_favorites")
                                : t("add_to_favorites")
                            }
                          >
                            {isFavorited ? "♥" : "♡"}
                          </button>
                          <button
                            className={styles.cartButton}
                            onClick={() => handleAddToCart(product)}
                          >
                            {t("add_to_cart")}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className={styles.noProducts}>
                  <div className={styles.noProductsIcon}>🏍️</div>
                  <p>{t("no_discounted_products")}</p>
                </div>
              )}

              <div className={styles.scheduleWidget}>
                <h4 className={styles.widgetTitle}>{t("work_schedule")}</h4>
                <div className={styles.scheduleItem}>
                  <span className={styles.day}>{t("weekdays")}:</span>
                  <span className={styles.time}>{t("weekday_hours")}</span>
                </div>
                <div className={styles.scheduleItem}>
                  <span className={styles.day}>{t("weekend")}:</span>
                  <span className={styles.time}>{t("weekend_hours")}</span>
                </div>
                <div className={styles.scheduleNote}>{t("schedule_note")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
