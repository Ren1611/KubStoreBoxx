import { useEffect, useState } from "react";
import { useProduct } from "../../MainContext/MainContext";
import scss from "./Card.module.scss";
import OrderSummary from "./OrderSummary"; // Импортируем компонент чека
import Sisi from "./Sisi";

const Card = () => {
  const { order, deleteOrder, readOrder, addFavorit } = useProduct();
  const [itemCounts, setItemCounts] = useState({});

  useEffect(() => {
    readOrder();
  }, []);

  // Инициализируем счетчики для каждого товара
  useEffect(() => {
    const initialCounts = {};
    order.forEach((item) => {
      initialCounts[item.id] = item.quantity || 1;
    });
    setItemCounts(initialCounts);
  }, [order]);

  const handleIncrement = (itemId) => {
    setItemCounts((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1,
    }));
  };

  const handleDecrement = (itemId) => {
    const currentCount = itemCounts[itemId] || 1;
    if (currentCount > 1) {
      setItemCounts((prev) => ({
        ...prev,
        [itemId]: currentCount - 1,
      }));
    }
  };

  // Подготовка данных для OrderSummary
  const orderItemsForSummary = order.map((item) => ({
    ...item,
    quantity: itemCounts[item.id] || 1,
  }));

  const handleOrderSubmit = (orderData) => {
    console.log("Заказ оформлен:", orderData);
    alert(`Заказ на сумму ${orderData.total} сом успешно оформлен!`);
    // Здесь можно добавить логику отправки заказа на сервер
  };

  return (
    <div id={scss.card}>
      <div className="container">
        <div className={scss.card}>
          <div className={scss.tobuylist}>
            <div className={scss.kar}>
              <h1>Корзина</h1>
              <h4>{order.length} товара</h4>
            </div>

            <hr />
            {order.length === 0 ? (
              <p>Корзина пуста</p>
            ) : (
              order.map((item, index) => {
                const count = itemCounts[item.id] || 1;
                const totalPrice = (item.price || 0) * count;

                return (
                  <div key={item.id || index} className={scss.tobuy}>
                    <img src={item.image} alt={item.title} />
                    <div className={scss.go}>
                      <h2>{item.title}</h2>
                      <br />
                      <div className={scss.btn}>
                        <button
                          onClick={() => addFavorit(item)}
                          id={scss.favorit}
                        >
                          <img
                            src="/src/assets/icons/Wishlist (1).svg"
                            alt="В избранное"
                          />
                        </button>
                        <button
                          id={scss.delete}
                          onClick={() => deleteOrder(item.id)}
                        >
                          <img
                            src="./src/assets/icons/icon-delete (1).svg"
                            alt="Удалить"
                          />
                        </button>
                      </div>
                    </div>

                    <div className={scss.deleteOr}>
                      <div className={scss.counter}>
                        <button
                          className={scss.increment}
                          onClick={() => handleIncrement(item.id)}
                        >
                          +
                        </button>
                        <h2 className={scss.count}>{count}</h2>
                        <button
                          className={scss.decrement}
                          onClick={() => handleDecrement(item.id)}
                          disabled={count <= 1}
                        >
                          -
                        </button>
                      </div>
                      <h2 id={scss.price}>{totalPrice} сом</h2>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {order.length > 0 && (
            <div className={scss.orderSummaryContainer}>
              <OrderSummary
                items={orderItemsForSummary}
                onOrderSubmit={handleOrderSubmit}
              />
            </div>
          )}
        </div>
      </div>
      <Sisi />
    </div>
  );
};

export default Card;
