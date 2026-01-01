import { useState, useMemo } from "react";
import scss from "./OrderSummary.module.scss";

const OrderSummary = ({ items = [], onOrderSubmit }) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Рассчитываем общую стоимость товаров
  const itemsTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  }, [items]);

  // Рассчитываем итоговую сумму (пока без доставки)
  const orderTotal = itemsTotal;

  const handleSubmit = () => {
    if (!agreeToTerms) {
      alert("Пожалуйста, согласитесь с правилами");
      return;
    }

    if (!deliveryAddress.trim()) {
      alert("Пожалуйста, выберите адрес доставки");
      return;
    }

    if (onOrderSubmit) {
      onOrderSubmit({
        items,
        total: orderTotal,
        deliveryAddress,
        agreeToTerms,
      });
    }
  };

  return (
    <div className={scss.orderSummary}>
      <div className={scss.orderSummaryContent}>
        <div className={scss.orderHeader}>
          <h2>Выбрать адрес доставки</h2>
        </div>

        <div className={scss.addressSection}>
          <div className={scss.addressInput}>
            <label htmlFor="deliveryAddress">Адрес доставки:</label>
            <input
              id="deliveryAddress"
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Введите ваш адрес"
            />
          </div>
        </div>

        <div className={scss.summarySection}>
          <h3>Сводка заказа</h3>

          <div className={scss.summaryRow}>
            <span className={scss.label}>Товары, {items.length} шт.</span>
            <span className={scss.value}>
              {itemsTotal.toLocaleString()} сом
            </span>
          </div>

          <div className={scss.divider}></div>

          <div className={scss.totalRow}>
            <span className={scss.totalLabel}>Итого</span>
            <span className={scss.totalValue}>
              {orderTotal.toLocaleString()} сом
            </span>
          </div>
        </div>

        <div className={scss.termsSection}>
          <div className={scss.checkboxWrapper}>
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className={scss.checkbox}
            />
            <label htmlFor="agreeTerms" className={scss.checkboxLabel}>
              Соглашаюсь с правилами пользования торговой площадкой и возврата
            </label>
          </div>
        </div>

        <button
          className={scss.orderButton}
          onClick={handleSubmit}
          disabled={!agreeToTerms || !deliveryAddress.trim()}
        >
          Заказать
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
