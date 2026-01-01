import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../MainContext/MainContext";
import styles from "./cardProduct.module.scss";

const CardProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getOneProduct,
    product: contextProduct,
    loading,
    error,
    addCard,
    addFavorit,
    favorit,
    card,
    readCard,
    readFavorit,
    deleteFavorit,
  } = useProduct();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      getOneProduct(id);
    }
  }, [id]);

  useEffect(() => {
    if (contextProduct) {
      setProduct(contextProduct);
    }
  }, [contextProduct]);

  useEffect(() => {
    readCard();
    readFavorit();
  }, []);

  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        ...product,
        quantity: quantity,
        totalPrice: product.price * quantity,
      };
      addCard(cartItem);
      alert("Товар добавлен в корзину!");
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      const isFavorited = favorit.some((item) => item.id === product.id);
      if (isFavorited) {
        deleteFavorit(product.id);
      } else {
        addFavorit(product);
      }
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const isInCart = card.some((item) => item.id === product?.id);
  const isFavorited = favorit.some((item) => item.id === product?.id);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка товара...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Ошибка при загрузке товара</h3>
        <p>{error}</p>
        <button
          onClick={() => navigate("/products")}
          className={styles.backButton}
        >
          Вернуться к товарам
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Товар не найден</h2>
        <button
          onClick={() => navigate("/products")}
          className={styles.backButton}
        >
          Вернуться к товарам
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Назад
      </button>

      <div className={styles.productContainer}>
        {/* Изображения продукта */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img
              src={
                product.images?.[selectedImage] ||
                product.image ||
                "/placeholder.jpg"
              }
              alt={product.title}
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`${styles.thumbnail} ${
                    selectedImage === index ? styles.active : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Информация о продукте */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <h1 className={styles.title}>{product.title || product.name}</h1>
            <button
              onClick={handleToggleFavorite}
              className={`${styles.favoriteButton} ${
                isFavorited ? styles.favorited : ""
              }`}
            >
              {isFavorited ? "★" : "☆"}
            </button>
          </div>

          <div className={styles.category}>
            <span>Категория: {product.category || "Не указано"}</span>
          </div>

          <div className={styles.priceSection}>
            <div className={styles.price}>
              <span className={styles.currentPrice}>{product.price} ₽</span>
              {product.oldPrice && (
                <span className={styles.oldPrice}>{product.oldPrice} ₽</span>
              )}
            </div>
            {product.discount && (
              <span className={styles.discount}>-{product.discount}%</span>
            )}
          </div>

          <div className={styles.description}>
            <h3>Описание</h3>
            <p>{product.description || "Описание отсутствует"}</p>
          </div>

          <div className={styles.specifications}>
            <h3>Характеристики</h3>
            <ul>
              {product.brand && (
                <li>
                  <strong>Бренд:</strong> {product.brand}
                </li>
              )}
              {product.model && (
                <li>
                  <strong>Модель:</strong> {product.model}
                </li>
              )}
              {product.color && (
                <li>
                  <strong>Цвет:</strong> {product.color}
                </li>
              )}
              {product.size && (
                <li>
                  <strong>Размер:</strong> {product.size}
                </li>
              )}
              {product.weight && (
                <li>
                  <strong>Вес:</strong> {product.weight} кг
                </li>
              )}
              {product.material && (
                <li>
                  <strong>Материал:</strong> {product.material}
                </li>
              )}
              {product.rating && (
                <li>
                  <strong>Рейтинг:</strong>
                  <span className={styles.rating}>
                    {"★".repeat(Math.floor(product.rating))}
                    {"☆".repeat(5 - Math.floor(product.rating))}
                    <span> ({product.rating})</span>
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Количество и кнопки */}
          <div className={styles.actions}>
            <div className={styles.quantitySelector}>
              <button onClick={decrementQuantity} disabled={quantity <= 1}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={incrementQuantity}>+</button>
            </div>

            <div className={styles.totalPrice}>
              Итого: <strong>{product.price * quantity} ₽</strong>
            </div>

            <div className={styles.buttons}>
              <button
                onClick={handleAddToCart}
                className={`${styles.addToCart} ${
                  isInCart ? styles.inCart : ""
                }`}
                disabled={isInCart}
              >
                {isInCart ? "✓ В корзине" : "🛒 Добавить в корзину"}
              </button>

              <button className={styles.buyNow}>Купить сейчас</button>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className={styles.additionalInfo}>
            <div className={styles.infoItem}>
              <span className={styles.icon}>🚚</span>
              <div>
                <strong>Бесплатная доставка</strong>
                <p>При заказе от 5000 ₽</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.icon}>↩️</span>
              <div>
                <strong>Возврат 30 дней</strong>
                <p>Легкий возврат товара</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.icon}>🛡️</span>
              <div>
                <strong>Гарантия 1 год</strong>
                <p>Официальная гарантия</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Похожие товары (если есть) */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className={styles.relatedProducts}>
          <h2>Похожие товары</h2>
          <div className={styles.relatedGrid}>
            {product.relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className={styles.relatedItem}
                onClick={() => navigate(`/cardProduct/${relatedProduct.id}`)}
              >
                <img src={relatedProduct.image} alt={relatedProduct.title} />
                <h4>{relatedProduct.title}</h4>
                <p>{relatedProduct.price} ₽</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardProduct;
