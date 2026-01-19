import React, { useEffect, useState, useRef } from "react";
import { useProduct } from "../../MainContext/MainContext";
import scss from "./Sisi.module.scss";

const QuickViewSlider = () => {
  const { products, getProducts, addCard, favorit, addFavorit, deleteFavorit } =
    useProduct();
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  // Загрузка продуктов при монтировании компонента
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Используем метод из вашего контекста
        await getProducts();
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [getProducts]);

  // Получаем популярные товары для слайдера
  const getQuickViewProducts = () => {
    if (!products || products.length === 0) return [];

    // Берем первые 6 товаров или фильтруем по популярности
    return products.map((product) => ({
      id: product._id || product.id,
      originalPrice: product.price || 0,

      brand: product.brand || "бренда нет",
      name: product.name || product.title || "Без названия",
      image: product.image || product.imageUrl || "/placeholder-image.jpg",
      description: product.description || "",
      isInFavorites: favorit?.some((item) => item.id === product._id),
    }));
  };

  // Навигация по слайдеру
  const nextSlide = () => {
    const quickViewProducts = getQuickViewProducts();
    if (currentIndex < quickViewProducts.length - 4) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Добавление товара в корзину
  const handleAddToCart = (product) => {
    try {
      const cartProduct = {
        id: product.id,
        title: product.name,
        price: product.discountedPrice,
        image: product.image,
        quantity: 1,
        brand: product.brand,
      };

      addCard(cartProduct);
      alert(`Товар "${product.name}" добавлен в корзину!`);
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
      alert("Не удалось добавить товар в корзину");
    }
  };

  // Добавление/удаление из избранного
  const handleToggleFavorite = (product) => {
    const favoriteProduct = {
      id: product.id,
      name: product.name,
      price: product.discountedPrice,
      image: product.image,
      brand: product.brand,
    };

    if (product.isInFavorites) {
      deleteFavorit(product.id);
    } else {
      addFavorit(favoriteProduct);
    }
  };

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " сом";
  };

  const quickViewProducts = getQuickViewProducts();

  if (loading && quickViewProducts.length === 0) {
    return (
      <div className={scss.quickViewSlider}>
        <div className={scss.header}>
          <h3>Быстрый просмотр</h3>
        </div>
        <div className={scss.loading}>
          <p>Загрузка товаров...</p>
        </div>
      </div>
    );
  }

  if (!loading && quickViewProducts.length === 0) {
    return (
      <div className={scss.quickViewSlider}>
        <div className={scss.header}>
          <h3>Быстрый просмотр</h3>
        </div>
        <div className={scss.empty}>
          <p>Нет товаров для отображения</p>
        </div>
      </div>
    );
  }

  return (
    <div className={scss.quickViewSlider}>
      <div className="container">
        <div className={scss.header}>
          <h3>Быстрый просмотр</h3>
          <div className={scss.navigation}>
            <button
              onClick={prevSlide}
              className={`${scss.navBtn} ${scss.prevBtn}`}
              disabled={currentIndex === 0}
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className={`${scss.navBtn} ${scss.nextBtn}`}
              disabled={currentIndex >= quickViewProducts.length - 4}
            >
              ›
            </button>
          </div>
        </div>

        <div className={scss.sliderContainer}>
          <div
            className={scss.sliderTrack}
            ref={sliderRef}
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {quickViewProducts.map((product) => (
              <div key={product.id} className={scss.slide}>
                <div className={scss.productCard}>
                  <div className={scss.productImage}>
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <button
                      className={`${scss.favoriteBtn} ${
                        product.isInFavorites ? scss.active : ""
                      }`}
                      onClick={() => handleToggleFavorite(product)}
                    >
                      <img src="./src/assets/icons/Wishlist (1).svg" alt="" />
                    </button>
                  </div>

                  <div className={scss.productInfo}>
                    <div className={scss.prices}>
                      <span className={scss.originalPrice}>
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>

                    <div className={scss.details}>
                      <p className={scss.brand}>
                        {product.brand} / {product.name}
                      </p>
                    </div>

                    <button
                      className={scss.addToCartBtn}
                      onClick={() => handleAddToCart(product)}
                    >
                      Добавить в корзину
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewSlider;
