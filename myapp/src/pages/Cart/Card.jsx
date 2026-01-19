import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useProduct } from "../../MainContext/MainContext";
import {
  formatPriceWithCurrency,
  formatPrice,
} from "../../utils/priceFormatter";
import styles from "./Card.module.scss";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaArrowLeft,
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Card = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { order, deleteOrder, readOrder, calculateCartTotal } = useProduct();

  const [cartItems, setCartItems] = useState([]);
  const [buyNowItem, setBuyNowItem] = useState(null);

  const calculateItemTotalLocal = (item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const quantity = Number(item.quantity) || 1;

    if (discount > 0) {
      const discountedPrice = price * (1 - discount / 100);
      return discountedPrice * quantity;
    }

    return price * quantity;
  };

  const calculateUnitPrice = (item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;

    if (discount > 0) {
      return price * (1 - discount / 100);
    }

    return price;
  };

  useEffect(() => {
    const items = readOrder();
    setCartItems(items);

    const storedBuyNow = localStorage.getItem("buyNowProduct");
    if (storedBuyNow) {
      try {
        const buyNowData = JSON.parse(storedBuyNow);
        if (Date.now() - buyNowData.timestamp < 5 * 60 * 1000) {
          setBuyNowItem(buyNowData.product);
        }
      } catch (e) {
        console.error("Error parsing buyNowProduct:", e);
      }
    }
  }, []);

  useEffect(() => {
    let items = [...order];

    if (buyNowItem && location.state?.fromBuyNow) {
      const existingItemIndex = items.findIndex(
        (item) => item.id === buyNowItem.id,
      );
      if (existingItemIndex > -1) {
        items[existingItemIndex].quantity += buyNowItem.quantity;
      } else {
        items.push(buyNowItem);
      }
    }

    setCartItems(items);
  }, [order, buyNowItem, location.state]);

  const handleQuantityChange = (id, change) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = (item.quantity || 1) + change;
        if (newQuantity >= 1) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });

    const ordersData = updatedItems.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));

    localStorage.setItem("orders", JSON.stringify(ordersData));
    setCartItems(updatedItems);
  };

  const handleRemoveItem = (id) => {
    deleteOrder(id);

    if (buyNowItem?.id === id) {
      localStorage.removeItem("buyNowProduct");
      setBuyNowItem(null);
    }
  };

  const handleClearCart = () => {
    cartItems.forEach((item) => {
      deleteOrder(item.id);
    });
    localStorage.removeItem("buyNowProduct");
    setBuyNowItem(null);
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        items: cartItems,
        total: calculateTotal(),
      },
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + calculateItemTotalLocal(item);
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 3000 ? 0 : 300;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  if (cartItems.length === 0 && !buyNowItem) {
    return (
      <div className={styles.emptyCart}>
        <div className="container">
          <div className={styles.emptyContent}>
            <div className={styles.emptyIcon}>
              <FaShoppingCart />
            </div>
            <h2>{t("cart_empty_title")}</h2>
            <p>{t("cart_empty_description")}</p>
            <Link to="/catalog" className={styles.continueShopping}>
              {t("cart_empty_go_to_catalog")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cardPage}>
      <div className="container">
        <div className={styles.breadcrumbs}>
          <Link to="/">{t("cart_breadcrumbs_home")}</Link>
          <span className={styles.divider}>/</span>
          <span className={styles.current}>{t("cart_breadcrumbs_cart")}</span>
        </div>

        <h1 className={styles.pageTitle}>{t("cart_title")}</h1>

        <div className={styles.cartLayout}>
          <div className={styles.cartItems}>
            <div className={styles.cartHeader}>
              <h2>{t("cart_items_title", { count: cartItems.length })}</h2>
              {cartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className={styles.clearCartBtn}
                >
                  <FaTrash /> {t("cart_buttons_clear_cart")}
                </button>
              )}
            </div>

            {cartItems.map((item) => {
              const itemTotal = calculateItemTotalLocal(item);
              const unitPrice = calculateUnitPrice(item);
              const hasDiscount = item.discount && item.discount > 0;

              return (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img
                      src={
                        item.image ||
                        item.images?.[0] ||
                        "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                      }
                      alt={
                        item.name || item.title || t("products_unknown_model")
                      }
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                      }}
                    />
                  </div>

                  <div className={styles.itemInfo}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemName}>
                        <Link to={`/product/${item.id}`}>
                          {item.name ||
                            item.title ||
                            t("products_unknown_model")}
                        </Link>
                      </h3>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className={styles.removeBtn}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className={styles.itemDetails}>
                      <span className={styles.itemBrand}>
                        {item.brand || t("products_unknown_brand")}
                      </span>
                      <span className={styles.itemCategory}>
                        {item.category}
                      </span>
                    </div>

                    <div className={styles.itemPrice}>
                      {hasDiscount ? (
                        <div className={styles.priceContainer}>
                          <span className={styles.unitPrice}>
                            {formatPriceWithCurrency(unitPrice)}
                          </span>
                          <br />
                          <span className={styles.oldPrice}>
                            {formatPriceWithCurrency(item.price)}
                          </span>

                          <span className={styles.discountBadge}>
                            -{item.discount}%
                          </span>
                        </div>
                      ) : (
                        <span className={styles.unitPrice}>
                          {formatPriceWithCurrency(unitPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={(item.quantity || 1) <= 1}
                        className={styles.quantityBtn}
                      >
                        <FaMinus />
                      </button>
                      <input
                        type="number"
                        value={item.quantity || 1}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          if (val >= 1) {
                            const currentQty = item.quantity || 1;
                            handleQuantityChange(item.id, val - currentQty);
                          }
                        }}
                        className={styles.quantityInput}
                        min="1"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className={styles.quantityBtn}
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <div className={styles.itemTotal}>
                      <span>{t("cart_items_total")}:</span>
                      <strong>{formatPriceWithCurrency(itemTotal)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className={styles.continueShopping}>
              <Link to="/catalog" className={styles.backToCatalog}>
                <FaArrowLeft /> {t("cart_buttons_continue_shopping")}
              </Link>
            </div>
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>{t("cart_summary_title")}</h3>

              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>
                    {t("cart_summary_items", { count: cartItems.length })}
                  </span>
                  <span>{formatPriceWithCurrency(calculateSubtotal())}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>{t("cart_summary_shipping")}</span>
                  <span>
                    {calculateShipping() === 0 ? (
                      <span className={styles.freeShipping}>
                        {t("cart_summary_free")}
                      </span>
                    ) : (
                      formatPriceWithCurrency(calculateShipping())
                    )}
                  </span>
                </div>

                <div className={styles.summaryDivider}></div>

                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <strong>{t("cart_summary_total")}</strong>
                  <strong className={styles.totalAmount}>
                    {formatPriceWithCurrency(calculateTotal())}
                  </strong>
                </div>

                {calculateSubtotal() < 3000 && (
                  <div className={styles.freeShippingInfo}>
                    <FaTruck />{" "}
                    {t("cart_summary_add_for_free_shipping", {
                      amount: formatPriceWithCurrency(
                        3000 - calculateSubtotal(),
                      ),
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                className={styles.checkoutBtn}
                disabled={cartItems.length === 0}
              >
                <FaCreditCard /> {t("cart_buttons_checkout")}
              </button>

              <div className={styles.securityInfo}>
                <div className={styles.securityItem}>
                  <FaShieldAlt />
                  <span>{t("cart_security_safe_payment")}</span>
                </div>
                <p className={styles.guaranteeText}>
                  {t("cart_security_refund_guarantee")}
                </p>
              </div>
            </div>

            {/* Промокод */}
            <div className={styles.promoSection}>
              <h4>{t("cart_promo_title")}</h4>
              <div className={styles.promoInput}>
                <input
                  type="text"
                  placeholder={t("cart_promo_placeholder")}
                  className={styles.promoField}
                />
                <button className={styles.promoBtn}>
                  {t("cart_promo_apply")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
