import { useEffect, useState } from "react";
import scss from "./Card.module.scss";
import { useProduct } from "../../MainContext/MainContext";

const Cart = () => {
  const { order, deleteOrder, readOrder } = useProduct();

  const [count, setCount] = useState(1);

  useEffect(() => {
    readOrder();
  }, []);

  return (
    <div id={scss.card}>
      <div className="container">
        <div className={scss.card}>
          <div className={scss.tobuylist}>
            {order.length === 0 ? (
              <p>Корзина пуста</p>
            ) : (
              order.map((item, index) => (
                <div key={item.id || index} className={scss.tobuy}>
                  <img src={item.image} alt={item.title} />
                  <h2>{item.title}</h2>
                  <h4>{item.price}</h4>
                  <div className={scss.deleteOr}>
                    <button
                      id={scss.delete}
                      onClick={() => deleteOrder(item.id)}
                    >
                      Удалить
                    </button>
                    <h2>{count}</h2>
                    <button
                      id={scss.increment}
                      onClick={() => setCount(count + 1)}
                    >
                      +
                    </button>
                    <button
                      id={scss.decrement}
                      onClick={() => setCount(count === 1 ? count : count - 1)}
                    >
                      -
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
