import { useEffect, useState } from "react";
import scss from "./Favorites.module.scss";
import { useProduct } from "../../MainContext/MainContext";

import { Link } from "react-router-dom";

const Favorites = () => {
  const { addOrder } = useProduct();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка избранных товаров из localStorage
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = localStorage.getItem("favorit");
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);

          // Фильтруем невалидные данные
          const validFavorites = parsedFavorites.filter(
            (item) => item && typeof item === "object"
          );

          setFavorites(validFavorites);
        } else {
          setFavorites([]);
        }
        setError(null);
      } catch (error) {
        console.error("Ошибка при загрузке избранного:", error);
        setError("Не удалось загрузить избранное");
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();

    // Слушаем изменения в localStorage
    window.addEventListener("storage", loadFavorites);

    return () => {
      window.removeEventListener("storage", loadFavorites);
    };
  }, []);

  // Удаление товара из избранного
  const removeFromFavorites = (productId) => {
    try {
      const updatedFavorites = favorites.filter(
        (item) => item.id !== productId
      );
      setFavorites(updatedFavorites);
      localStorage.setItem("favorit", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Ошибка при удалении из избранного:", error);
    }
  };

  // Перемещение товара в корзину
  const moveToCart = (product) => {
    try {
      // Здесь можно добавить логику добавления в корзину
      console.log("Добавление в корзину:", product);
      alert(`Товар "${product.name || "Без названия"}" добавлен в корзину`);
      // После добавления в корзину можно удалить из избранного
      removeFromFavorites(product.id);
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
    }
  };

  // Подсчет общего количества товаров
  const totalItems = favorites.length;

  // Подсчет общей суммы с проверкой
  const totalPrice = favorites.reduce((sum, item) => {
    // Проверяем наличие цены и что это число
    const price = item?.price;
    const quantity = item?.quantity || 1;

    if (typeof price === "number" && !isNaN(price)) {
      return sum + price * quantity;
    }
    return sum;
  }, 0);

  // Форматирование цены
  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "Цена не указана";
    }
    return new Intl.NumberFormat("ru-RU").format(price) + " сом";
  };

  // Получение имени товара
  const getItemName = (item) => {
    return item?.name || item?.title || "Товар без названия";
  };

  // Получение изображения товара
  const getItemImage = (item) => {
    return item?.image || item?.img || "/placeholder-image.jpg";
  };

  if (loading) {
    return (
      <div className={scss.favorites}>
        <div className="container">
          <div className={scss.favoritesContainer}>
            <p>Загрузка избранного...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={scss.favorites}>
        <div className="container">
          <div className={scss.favoritesContainer}>
            <div className={scss.errorState}>
              <p>{error}</p>
              <button
                className={scss.btn}
                onClick={() => window.location.reload()}
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={scss.favorites}>
      <div className="container">
        <div className={scss.favoritesContainer}>
          <header className={scss.header}>
            <h1>Избранное</h1>
            <nav className={scss.navLinks}>
              <Link to="/">Главная</Link>
              <Link to="/catalog">Каталог</Link>
              <Link to="/card">Корзина</Link>
            </nav>
          </header>

          <main className={scss.mainContent}>
            <section className={scss.favoritesSection}>
              <h2 className={scss.sectionTitle}>
                Избранные товары
                {totalItems > 0 && <span> ({totalItems} товара)</span>}
              </h2>

              {favorites.length === 0 ? (
                <div className={scss.emptyFavorites}>
                  <p>В избранном пока нет товаров</p>
                  <Link to="/catalog" className={scss.btn}>
                    Перейти в каталог
                  </Link>
                </div>
              ) : (
                <div className={scss.contentWrapper}>
                  <div className={scss.favoritesList}>
                    {favorites.map((item, index) => (
                      <div
                        key={item.id || `item-${index}`}
                        className={scss.favoriteItem}
                      >
                        <img
                          src={getItemImage(item)}
                          alt={getItemName(item)}
                          className={scss.itemImage}
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                        <div className={scss.itemDetails}>
                          <h3 className={scss.itemTitle}>
                            {getItemName(item)}
                          </h3>
                          <p className={scss.itemPrice}>{item?.price} сом</p>
                          {item?.description && (
                            <p className={scss.itemDescription}>
                              {item.description.length > 100
                                ? `${item.description.substring(0, 100)}...`
                                : item.description}
                            </p>
                          )}
                        </div>
                        <div className={scss.itemActions}>
                          <button
                            className={`${scss.btn} ${scss.btnSecondary}`}
                            onClick={() => addOrder(item)}
                          >
                            В корзину
                          </button>
                          <button
                            className={`${scss.btn} ${scss.btnRemove}`}
                            onClick={() => removeFromFavorites(item.id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={scss.orderSummary}>
                    <div className={scss.summaryHeader}>
                      <h3>Сводка избранного</h3>
                    </div>
                    <div className={scss.summaryDetails}>
                      <div className={scss.summaryRow}>
                        <span>Товары, {totalItems} шт.</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                      <div className={scss.summaryTotal}>
                        <span>Всего товаров</span>
                        <span>{totalItems} шт.</span>
                      </div>
                    </div>
                    <div className={scss.summaryActions}>
                      <Link to="/card" className={scss.btn}>
                        Перейти в корзину
                      </Link>
                      <button
                        className={`${scss.btn} ${scss.btnRemove} ${scss.clearAllBtn}`}
                        onClick={() => {
                          if (window.confirm("Очистить все избранное?")) {
                            setFavorites([]);
                            localStorage.setItem("favorit", JSON.stringify([]));
                          }
                        }}
                      >
                        Очистить всё
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
