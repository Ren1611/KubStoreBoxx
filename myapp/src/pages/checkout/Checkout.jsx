import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useProduct } from "../../MainContext/MainContext";
import {
  formatPriceWithCurrency,
  calculateItemTotal,
  formatPrice,
} from "../../utils/priceFormatter";
import styles from "./Checkout.module.scss";
import {
  FaCreditCard,
  FaTruck,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaMapMarkerAlt,
  FaLock,
  FaArrowLeft,
  FaCheckCircle,
  FaShieldAlt,
  FaCalendarAlt,
  FaEdit,
  FaStore,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const {
    order,
    deleteOrder,
    calculateItemTotal: calculateItemTotalContext,
  } = useProduct();

  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [orderData, setOrderData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    deliveryMethod: "courier", // courier, pickup
    city: "",
    address: "",
    apartment: "",
    entrance: "",
    floor: "",
    comment: "",

    paymentMethod: "card", // card, cash
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardHolder: "",

    acceptTerms: false,
    subscribeNews: true,
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const items = location.state?.items || order || [];
    setCartItems(items);

    const savedData = localStorage.getItem("checkoutData");
    if (savedData) {
      setOrderData((prev) => ({ ...prev, ...JSON.parse(savedData) }));
    }
  }, [location.state, order]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return (
        total +
        (calculateItemTotalContext
          ? calculateItemTotalContext(item)
          : calculateItemTotal(item))
      );
    }, 0);
  };

  // Исправленная функция расчета доставки
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();

    // Если выбран самовывоз - доставка всегда 0
    if (orderData.deliveryMethod === "pickup") {
      return 0;
    }

    // Если выбран курьер - бесплатная доставка от 3000 сом
    return subtotal >= 3000 ? 0 : 300;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!orderData.firstName.trim())
        newErrors.firstName = t("checkout_errors_firstName");
      if (!orderData.lastName.trim())
        newErrors.lastName = t("checkout_errors_lastName");
      if (!orderData.email.trim()) newErrors.email = t("checkout_errors_email");
      else if (!/\S+@\S+\.\S+/.test(orderData.email))
        newErrors.email = t("checkout_errors_emailFormat");
      if (!orderData.phone.trim()) newErrors.phone = t("checkout_errors_phone");
      else if (!/^[\d\s\-\+\(\)]+$/.test(orderData.phone))
        newErrors.phone = t("checkout_errors_phoneFormat");
    }

    if (stepNumber === 2 && orderData.deliveryMethod === "courier") {
      if (!orderData.city.trim()) newErrors.city = t("checkout_errors_city");
      if (!orderData.address.trim())
        newErrors.address = t("checkout_errors_address");
    }

    if (stepNumber === 3 && orderData.paymentMethod === "card") {
      if (!orderData.cardNumber.trim())
        newErrors.cardNumber = t("checkout_errors_cardNumber");
      else if (!/^\d{16}$/.test(orderData.cardNumber.replace(/\s/g, "")))
        newErrors.cardNumber = t("checkout_errors_cardNumberFormat");
      if (!orderData.cardExpiry.trim())
        newErrors.cardExpiry = t("checkout_errors_cardExpiry");
      else if (!/^\d{2}\/\d{2}$/.test(orderData.cardExpiry))
        newErrors.cardExpiry = t("checkout_errors_cardExpiryFormat");
      if (!orderData.cardCvc.trim())
        newErrors.cardCvc = t("checkout_errors_cardCvc");
      else if (!/^\d{3}$/.test(orderData.cardCvc))
        newErrors.cardCvc = t("checkout_errors_cardCvcFormat");
      if (!orderData.cardHolder.trim())
        newErrors.cardHolder = t("checkout_errors_cardHolder");
    }

    if (stepNumber === 4 && !orderData.acceptTerms) {
      newErrors.acceptTerms = t("checkout_errors_acceptTerms");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      localStorage.setItem("checkoutData", JSON.stringify(orderData));
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatCardExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmitOrder = async () => {
    if (validateStep(4)) {
      setIsProcessing(true);

      setTimeout(() => {
        const newOrderNumber = `ORD-${Date.now().toString().slice(-8)}`;
        setOrderNumber(newOrderNumber);

        cartItems.forEach((item) => {
          deleteOrder(item.id);
        });

        localStorage.removeItem("checkoutData");
        localStorage.removeItem("buyNowProduct");
        localStorage.removeItem("orders");

        setIsProcessing(false);
        setOrderSuccess(true);

        const orderHistory =
          JSON.parse(localStorage.getItem("orderHistory")) || [];
        const orderToSave = {
          id: newOrderNumber,
          date: new Date().toISOString(),
          items: cartItems.map((item) => ({
            ...item,
            price: formatPrice(item.price),
            quantity: item.quantity || 1,
          })),
          customer: {
            name: `${orderData.firstName} ${orderData.lastName}`,
            email: orderData.email,
            phone: orderData.phone,
          },
          delivery: {
            method: orderData.deliveryMethod,
            address:
              orderData.deliveryMethod === "courier"
                ? `${orderData.city}, ${orderData.address}`
                : t("checkout_pickup"),
            cost: calculateShipping(),
          },
          payment: {
            method: orderData.paymentMethod,
            total: calculateTotal(),
            subtotal: calculateSubtotal(),
          },
          status: "processing",
        };

        orderHistory.unshift(orderToSave);
        localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
      }, 2000);
    }
  };

  const renderStepIndicator = () => (
    <div className={styles.stepIndicator}>
      {[1, 2, 3, 4].map((stepNum) => (
        <div key={stepNum} className={styles.step}>
          <div
            className={`${styles.stepCircle} ${
              step >= stepNum ? styles.active : ""
            }`}
          >
            {step > stepNum ? <FaCheckCircle /> : stepNum}
          </div>
          <div
            className={`${styles.stepLabel} ${
              step >= stepNum ? styles.active : ""
            }`}
          >
            {stepNum === 1 && t("checkout_steps_data")}
            {stepNum === 2 && t("checkout_steps_delivery")}
            {stepNum === 3 && t("checkout_steps_payment")}
            {stepNum === 4 && t("checkout_steps_confirmation")}
          </div>
          {stepNum < 4 && <div className={styles.stepLine}></div>}
        </div>
      ))}
    </div>
  );

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className={styles.emptyCheckout}>
        <div className="container">
          <div className={styles.emptyContent}>
            <h2>{t("checkout_empty_title")}</h2>
            <p>{t("checkout_empty_description")}</p>
            <Link to="/catalog" className={styles.backToShop}>
              {t("checkout_empty_backToShop")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className={styles.successPage}>
        <div className="container">
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <FaCheckCircle />
            </div>
            <h1>{t("checkout_success_title")}</h1>
            <p className={styles.orderNumber}>
              {t("checkout_success_orderNumber")} <strong>{orderNumber}</strong>
            </p>
            <div className={styles.successInfo}>
              <p>
                {t("checkout_success_confirmationSent")}{" "}
                <strong>{orderData.email}</strong>
              </p>
              <p>{t("checkout_success_contactManager")}</p>
            </div>
            <div className={styles.successActions}>
              <Link to="/catalog" className={styles.continueShopping}>
                {t("checkout_success_continueShopping")}
              </Link>
              <Link to="/orders" className={styles.viewOrders}>
                {t("checkout_success_viewOrders")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const total = calculateTotal();

  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        {/* Хлебные крошки */}
        <div className={styles.breadcrumbs}>
          <Link to="/">{t("checkout_breadcrumbs_home")}</Link>
          <span className={styles.divider}>/</span>
          <Link to="/card">{t("checkout_breadcrumbs_cart")}</Link>
          <span className={styles.divider}>/</span>
          <span className={styles.current}>
            {t("checkout_breadcrumbs_checkout")}
          </span>
        </div>

        <h1 className={styles.pageTitle}>{t("checkout_title")}</h1>

        {/* Индикатор шагов */}
        {renderStepIndicator()}

        <div className={styles.checkoutLayout}>
          {/* Основная форма */}
          <div className={styles.checkoutForm}>
            {step === 1 && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                  <FaUser /> {t("checkout_contactDetails_title")}
                </h2>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>{t("checkout_contactDetails_firstName")} *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={orderData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? styles.error : ""}
                      placeholder={t(
                        "checkout_contactDetails_firstNamePlaceholder",
                      )}
                    />
                    {errors.firstName && (
                      <span className={styles.errorMessage}>
                        {errors.firstName}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t("checkout_contactDetails_lastName")} *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={orderData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? styles.error : ""}
                      placeholder={t(
                        "checkout_contactDetails_lastNamePlaceholder",
                      )}
                    />
                    {errors.lastName && (
                      <span className={styles.errorMessage}>
                        {errors.lastName}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t("checkout_contactDetails_email")} *</label>
                    <div className={styles.inputWithIcon}>
                      <FaEnvelope />
                      <input
                        type="email"
                        name="email"
                        value={orderData.email}
                        onChange={handleInputChange}
                        className={errors.email ? styles.error : ""}
                        placeholder="example@mail.com"
                      />
                    </div>
                    {errors.email && (
                      <span className={styles.errorMessage}>
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t("checkout_contactDetails_phone")} *</label>
                    <div className={styles.inputWithIcon}>
                      <FaPhone />
                      <input
                        type="tel"
                        name="phone"
                        value={orderData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? styles.error : ""}
                        placeholder="+996 XXX XXX XXX"
                      />
                    </div>
                    {errors.phone && (
                      <span className={styles.errorMessage}>
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                  <FaTruck /> {t("checkout_delivery_title")}
                </h2>

                <div className={styles.deliveryMethods}>
                  <label className={styles.deliveryOption}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="courier"
                      checked={orderData.deliveryMethod === "courier"}
                      onChange={handleInputChange}
                    />
                    <div className={styles.optionContent}>
                      <div className={styles.optionHeader}>
                        <div className={styles.optionIcon}>
                          <FaTruck />
                        </div>
                        <div>
                          <h3>{t("checkout_delivery_courier_title")}</h3>
                          <p>{t("checkout_delivery_courier_description")}</p>
                        </div>
                      </div>
                      <div className={styles.optionPrice}>
                        {orderData.deliveryMethod === "courier"
                          ? subtotal >= 3000
                            ? t("checkout_delivery_free")
                            : "300 сом"
                          : subtotal >= 3000
                            ? t("checkout_delivery_free")
                            : "300 сом"}
                      </div>
                    </div>
                  </label>

                  <label className={styles.deliveryOption}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={orderData.deliveryMethod === "pickup"}
                      onChange={handleInputChange}
                    />
                    <div className={styles.optionContent}>
                      <div className={styles.optionHeader}>
                        <div className={styles.optionIcon}>
                          <FaStore />
                        </div>
                        <div>
                          <h3>{t("checkout_delivery_pickup_title")}</h3>
                          <p>{t("checkout_delivery_pickup_description")}</p>
                          <p className={styles.pickupAddress}>
                            {t("checkout_delivery_pickup_address")}
                          </p>
                          <p className={styles.pickupHours}>
                            {t("checkout_delivery_pickup_hours")}
                          </p>
                        </div>
                      </div>
                      <div className={styles.optionPrice}>
                        {t("checkout_delivery_free")}
                      </div>
                    </div>
                  </label>
                </div>

                {orderData.deliveryMethod === "courier" && (
                  <div className={styles.addressForm}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>{t("checkout_delivery_city")} *</label>
                        <input
                          type="text"
                          name="city"
                          value={orderData.city}
                          onChange={handleInputChange}
                          className={errors.city ? styles.error : ""}
                          placeholder={t("checkout_delivery_cityPlaceholder")}
                        />
                        {errors.city && (
                          <span className={styles.errorMessage}>
                            {errors.city}
                          </span>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label>{t("checkout_delivery_address")} *</label>
                        <div className={styles.inputWithIcon}>
                          <FaMapMarkerAlt />
                          <input
                            type="text"
                            name="address"
                            value={orderData.address}
                            onChange={handleInputChange}
                            className={errors.address ? styles.error : ""}
                            placeholder={t(
                              "checkout_delivery_addressPlaceholder",
                            )}
                          />
                        </div>
                        {errors.address && (
                          <span className={styles.errorMessage}>
                            {errors.address}
                          </span>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label>{t("checkout_delivery_apartment")}</label>
                        <input
                          type="text"
                          name="apartment"
                          value={orderData.apartment}
                          onChange={handleInputChange}
                          placeholder={t(
                            "checkout_delivery_apartmentPlaceholder",
                          )}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>{t("checkout_delivery_entrance")}</label>
                        <input
                          type="text"
                          name="entrance"
                          value={orderData.entrance}
                          onChange={handleInputChange}
                          placeholder={t(
                            "checkout_delivery_entrancePlaceholder",
                          )}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>{t("checkout_delivery_floor")}</label>
                        <input
                          type="text"
                          name="floor"
                          value={orderData.floor}
                          onChange={handleInputChange}
                          placeholder={t("checkout_delivery_floorPlaceholder")}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>{t("checkout_delivery_comment")}</label>
                      <textarea
                        name="comment"
                        value={orderData.comment}
                        onChange={handleInputChange}
                        placeholder={t("checkout_delivery_commentPlaceholder")}
                        rows="3"
                      />
                    </div>

                    {/* Информация о бесплатной доставке */}
                    {subtotal < 3000 && (
                      <div className={styles.shippingInfo}>
                        <FaTruck />
                        <span>
                          {t("checkout_delivery_addForFreeShipping")}{" "}
                          {formatPriceWithCurrency(3000 - subtotal)}{" "}
                          {t("checkout_delivery_forFreeShipping")}
                        </span>
                      </div>
                    )}
                    {subtotal >= 3000 && (
                      <div className={styles.freeShippingInfo}>
                        <FaCheckCircle />
                        <span>
                          {t("checkout_delivery_freeShippingActivated")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {orderData.deliveryMethod === "pickup" && (
                  <div className={styles.pickupInfo}>
                    <div className={styles.pickupDetails}>
                      <h3>{t("checkout_delivery_pickup_infoTitle")}</h3>
                      <div className={styles.pickupAddressCard}>
                        <div className={styles.addressHeader}>
                          <FaStore />
                          <div>
                            <h4>{t("checkout_delivery_pickup_store")}</h4>
                            <p>{t("checkout_delivery_pickup_address")}</p>
                          </div>
                        </div>
                        <div className={styles.addressDetails}>
                          <div className={styles.detailItem}>
                            <strong>
                              {t("checkout_delivery_pickup_hoursLabel")}:
                            </strong>
                            <span>{t("checkout_delivery_pickup_hours")}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <strong>
                              {t("checkout_delivery_pickup_phone")}:
                            </strong>
                            <span>+996 555 123 456</span>
                          </div>
                          <div className={styles.detailItem}>
                            <strong>
                              {t("checkout_delivery_pickup_prepTime")}:
                            </strong>
                            <span>
                              {t("checkout_delivery_pickup_prepTimeValue")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.pickupInstructions}>
                        <h4>{t("checkout_delivery_pickup_howToPickup")}:</h4>
                        <ol>
                          <li>{t("checkout_delivery_pickup_step1")}</li>
                          <li>{t("checkout_delivery_pickup_step2")}</li>
                          <li>
                            {t("checkout_delivery_pickup_step3")}{" "}
                            <strong>{`ORD-${Date.now()
                              .toString()
                              .slice(-6)}`}</strong>
                          </li>
                          <li>{t("checkout_delivery_pickup_step4")}</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {step === 3 && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                  <FaCreditCard /> {t("checkout_payment_title")}
                </h2>

                <div className={styles.paymentMethods}>
                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={orderData.paymentMethod === "card"}
                      onChange={handleInputChange}
                    />
                    <div className={styles.optionContent}>
                      <div className={styles.optionHeader}>
                        <div className={styles.optionIcon}>
                          <FaCreditCard />
                        </div>
                        <div>
                          <h3>{t("checkout_payment_card_title")}</h3>
                          <p>{t("checkout_payment_card_description")}</p>
                        </div>
                      </div>
                      <div className={styles.cardLogos}>
                        <span>VISA</span>
                        <span>MasterCard</span>
                        <span>МИР</span>
                      </div>
                    </div>
                  </label>

                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={orderData.paymentMethod === "cash"}
                      onChange={handleInputChange}
                    />
                    <div className={styles.optionContent}>
                      <div className={styles.optionHeader}>
                        <div className={styles.optionIcon}>
                          <FaLock />
                        </div>
                        <div>
                          <h3>{t("checkout_payment_cash_title")}</h3>
                          <p>{t("checkout_payment_cash_description")}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                {orderData.paymentMethod === "card" && (
                  <div className={styles.cardForm}>
                    <div className={styles.formGrid}>
                      <div
                        className={`${styles.formGroup} ${styles.fullWidth}`}
                      >
                        <label>{t("checkout_payment_cardNumber")} *</label>
                        <div className={styles.inputWithIcon}>
                          <FaCreditCard />
                          <input
                            type="text"
                            name="cardNumber"
                            value={formatCardNumber(orderData.cardNumber)}
                            onChange={(e) => {
                              const formatted = formatCardNumber(
                                e.target.value,
                              );
                              handleInputChange({
                                target: {
                                  name: "cardNumber",
                                  value: formatted,
                                },
                              });
                            }}
                            className={errors.cardNumber ? styles.error : ""}
                            placeholder="0000 0000 0000 0000"
                            maxLength="19"
                          />
                        </div>
                        {errors.cardNumber && (
                          <span className={styles.errorMessage}>
                            {errors.cardNumber}
                          </span>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label>{t("checkout_payment_cardExpiry")} *</label>
                        <div className={styles.inputWithIcon}>
                          <FaCalendarAlt />
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formatCardExpiry(orderData.cardExpiry)}
                            onChange={(e) => {
                              const formatted = formatCardExpiry(
                                e.target.value,
                              );
                              handleInputChange({
                                target: {
                                  name: "cardExpiry",
                                  value: formatted,
                                },
                              });
                            }}
                            className={errors.cardExpiry ? styles.error : ""}
                            placeholder={t(
                              "checkout_payment_cardExpiryPlaceholder",
                            )}
                            maxLength="5"
                          />
                        </div>
                        {errors.cardExpiry && (
                          <span className={styles.errorMessage}>
                            {errors.cardExpiry}
                          </span>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label>{t("checkout_payment_cardCvc")} *</label>
                        <input
                          type="text"
                          name="cardCvc"
                          value={orderData.cardCvc}
                          onChange={handleInputChange}
                          className={errors.cardCvc ? styles.error : ""}
                          placeholder="123"
                          maxLength="3"
                        />
                        {errors.cardCvc && (
                          <span className={styles.errorMessage}>
                            {errors.cardCvc}
                          </span>
                        )}
                      </div>

                      <div
                        className={`${styles.formGroup} ${styles.fullWidth}`}
                      >
                        <label>{t("checkout_payment_cardHolder")} *</label>
                        <input
                          type="text"
                          name="cardHolder"
                          value={orderData.cardHolder}
                          onChange={handleInputChange}
                          className={errors.cardHolder ? styles.error : ""}
                          placeholder="IVAN IVANOV"
                        />
                        {errors.cardHolder && (
                          <span className={styles.errorMessage}>
                            {errors.cardHolder}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.securityNote}>
                      <FaShieldAlt />
                      <span>{t("checkout_payment_securityNote")}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                  <FaCheckCircle /> {t("checkout_confirmation_title")}
                </h2>

                <div className={styles.reviewSection}>
                  <div className={styles.reviewBlock}>
                    <h3>{t("checkout_confirmation_contactInfo")}</h3>
                    <div className={styles.reviewContent}>
                      <p>
                        <strong>{t("checkout_confirmation_name")}:</strong>{" "}
                        {orderData.firstName} {orderData.lastName}
                      </p>
                      <p>
                        <strong>{t("checkout_confirmation_email")}:</strong>{" "}
                        {orderData.email}
                      </p>
                      <p>
                        <strong>{t("checkout_confirmation_phone")}:</strong>{" "}
                        {orderData.phone}
                      </p>
                    </div>
                    <button
                      className={styles.editBtn}
                      onClick={() => setStep(1)}
                    >
                      <FaEdit /> {t("checkout_confirmation_edit")}
                    </button>
                  </div>

                  <div className={styles.reviewBlock}>
                    <h3>{t("checkout_confirmation_delivery")}</h3>
                    <div className={styles.reviewContent}>
                      <p>
                        <strong>{t("checkout_confirmation_method")}:</strong>{" "}
                        {orderData.deliveryMethod === "courier"
                          ? t("checkout_delivery_courier_title")
                          : t("checkout_delivery_pickup_title")}
                      </p>
                      {orderData.deliveryMethod === "courier" ? (
                        <>
                          <p>
                            <strong>
                              {t("checkout_confirmation_address")}:
                            </strong>{" "}
                            {orderData.city}, {orderData.address}
                          </p>
                          {orderData.apartment && (
                            <p>
                              <strong>
                                {t("checkout_confirmation_apartment")}:
                              </strong>{" "}
                              {orderData.apartment}
                            </p>
                          )}
                          <p>
                            <strong>
                              {t("checkout_confirmation_shippingCost")}:
                            </strong>{" "}
                            {formatPriceWithCurrency(shipping)}
                          </p>
                          {orderData.comment && (
                            <p>
                              <strong>
                                {t("checkout_confirmation_comment")}:
                              </strong>{" "}
                              {orderData.comment}
                            </p>
                          )}
                        </>
                      ) : (
                        <p>
                          <strong>
                            {t("checkout_confirmation_pickupAddress")}:
                          </strong>{" "}
                          {t("checkout_delivery_pickup_address")}
                        </p>
                      )}
                    </div>
                    <button
                      className={styles.editBtn}
                      onClick={() => setStep(2)}
                    >
                      <FaEdit /> {t("checkout_confirmation_edit")}
                    </button>
                  </div>

                  <div className={styles.reviewBlock}>
                    <h3>{t("checkout_confirmation_payment")}</h3>
                    <div className={styles.reviewContent}>
                      <p>
                        <strong>{t("checkout_confirmation_method")}:</strong>{" "}
                        {orderData.paymentMethod === "card"
                          ? t("checkout_payment_card_title")
                          : t("checkout_payment_cash_title")}
                      </p>
                      {orderData.paymentMethod === "card" && (
                        <p>
                          <strong>{t("checkout_confirmation_card")}:</strong>{" "}
                          **** **** **** {orderData.cardNumber.slice(-4)}
                        </p>
                      )}
                    </div>
                    <button
                      className={styles.editBtn}
                      onClick={() => setStep(3)}
                    >
                      <FaEdit /> {t("checkout_confirmation_edit")}
                    </button>
                  </div>
                </div>

                <div className={styles.termsSection}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={orderData.acceptTerms}
                      onChange={handleInputChange}
                    />
                    <span>
                      {t("checkout_terms_agree")}{" "}
                      <a href="/terms">{t("checkout_terms_personalData")}</a>{" "}
                      {t("checkout_terms_and")}{" "}
                      <a href="/policy">{t("checkout_terms_privacyPolicy")}</a>{" "}
                      *
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <span className={styles.errorMessage}>
                      {errors.acceptTerms}
                    </span>
                  )}

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="subscribeNews"
                      checked={orderData.subscribeNews}
                      onChange={handleInputChange}
                    />
                    <span>{t("checkout_terms_subscribeNews")}</span>
                  </label>
                </div>
              </div>
            )}
            {/* Кнопки навигации */}
            <div className={styles.navigationButtons}>
              {step > 1 && (
                <button onClick={handlePrevStep} className={styles.prevBtn}>
                  <FaArrowLeft /> {t("checkout_buttons_back")}
                </button>
              )}

              {step < 4 ? (
                <button onClick={handleNextStep} className={styles.nextBtn}>
                  {t("checkout_buttons_continue")}
                </button>
              ) : (
                <button
                  onClick={handleSubmitOrder}
                  className={styles.submitBtn}
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? t("checkout_buttons_processing")
                    : t("checkout_buttons_confirmOrder")}
                </button>
              )}
            </div>
          </div>

          {/* Боковая панель с заказом */}
          <div className={styles.orderSummary}>
            <div className={styles.summaryCard}>
              <h3>{t("checkout_orderSummary_yourOrder")}</h3>

              <div className={styles.orderItems}>
                {cartItems.map((item, index) => {
                  const itemTotal = calculateItemTotalContext
                    ? calculateItemTotalContext(item)
                    : calculateItemTotal(item);

                  return (
                    <div key={index} className={styles.orderItem}>
                      <div className={styles.itemImage}>
                        <img
                          src={
                            item.image ||
                            item.images?.[0] ||
                            "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                          }
                          alt={item.name}
                        />
                      </div>
                      <div className={styles.itemDetails}>
                        <h4>{item.name}</h4>
                        <div className={styles.itemMeta}>
                          <span>
                            {t("checkout_orderSummary_quantity")}:{" "}
                            {item.quantity || 1}
                          </span>
                          {item.color && (
                            <span>
                              {t("checkout_orderSummary_color")}: {item.color}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={styles.itemPrice}>
                        {formatPriceWithCurrency(itemTotal)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>
                    {t("checkout_orderSummary_items")} ({cartItems.length})
                  </span>
                  <span>{formatPriceWithCurrency(subtotal)}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>{t("checkout_orderSummary_shipping")}</span>
                  <span>
                    {shipping === 0 ? (
                      <span className={styles.freeShipping}>
                        {t("checkout_delivery_free")}
                      </span>
                    ) : (
                      formatPriceWithCurrency(shipping)
                    )}
                  </span>
                </div>

                <div className={styles.summaryDivider}></div>

                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <strong>{t("checkout_orderSummary_total")}</strong>
                  <strong className={styles.totalAmount}>
                    {formatPriceWithCurrency(total)}
                  </strong>
                </div>

                {/* Информация о бесплатной доставке */}
                {orderData.deliveryMethod === "courier" && subtotal < 3000 && (
                  <div className={styles.freeShippingInfo}>
                    <FaTruck />
                    <span>
                      {t("checkout_delivery_addForFreeShipping")}{" "}
                      {formatPriceWithCurrency(3000 - subtotal)}{" "}
                      {t("checkout_delivery_forFreeShipping")}
                    </span>
                  </div>
                )}
                {orderData.deliveryMethod === "courier" && subtotal >= 3000 && (
                  <div className={styles.freeShippingActive}>
                    <FaCheckCircle />
                    <span>{t("checkout_delivery_freeShippingActivated")}</span>
                  </div>
                )}
                {orderData.deliveryMethod === "pickup" && (
                  <div className={styles.pickupInfoNote}>
                    <FaStore />
                    <span>{t("checkout_delivery_pickup_alwaysFree")}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmitOrder}
                className={`${styles.checkoutBtn} ${
                  step === 4 && !isProcessing ? styles.active : ""
                }`}
                disabled={isProcessing || step !== 4}
              >
                {isProcessing ? (
                  <>
                    <FaCreditCard /> {t("checkout_buttons_processing")}
                  </>
                ) : (
                  <>
                    <FaCreditCard /> {t("checkout_buttons_confirmOrder")}
                  </>
                )}
              </button>

              <div className={styles.securityInfo}>
                <div className={styles.securityItem}>
                  <FaShieldAlt />
                  <span>{t("checkout_security_securePayment")}</span>
                </div>
                <p className={styles.guaranteeText}>
                  {t("checkout_security_moneyBackGuarantee")}
                </p>
              </div>
            </div>

            <div className={styles.helpSection}>
              <h4>{t("checkout_help_needHelp")}</h4>
              <p>
                {t("checkout_help_callUs")}:{" "}
                <a href="tel:+996555123456">+996 555 123 456</a>
              </p>
              <p>
                {t("checkout_help_orWrite")}:{" "}
                <a href="mailto:support@kubstore.kg">support@kubstore.kg</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
