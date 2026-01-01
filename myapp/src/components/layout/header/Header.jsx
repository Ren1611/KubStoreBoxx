import { NavLink } from "react-router-dom";
import scss from "./Header.module.scss";

const Header = () => {
  return (
    <div>
      <div id={scss.header}>
        <div className={scss.headerHeader}>
          <div className={scss.apple}>
            <h2 id={scss.Diler}>Для дилеров</h2>
            <h2>
              <span>мотосалон в городе</span> Бишкек
              <span> +996708502907</span>
            </h2>
            <h2>
              Интернет-магазин: <span> 8 800 333-66-53</span>
            </h2>
          </div>
        </div>
        <hr />
        <div className={scss.HeaderLogo}>
          <div className={scss.d}>
            <a href="/">
              <img id={scss.logo} src="./src/assets/icons/GOOD.png" alt="" />
            </a>
            <input
              type="text"
              placeholder="
Наименование, артикул или бренд
"
            />
            <button>
              <img src="./src/assets/icons/Component 2 (1).svg" alt="" />
            </button>
            <div className={scss.HeaderImg}>
              <a href="/favorites">
                <img src="../src/assets/icons/Wishlist (1).svg" alt="" />
              </a>
              <a href="/card">
                <img src="../src/assets/icons/Cart1 with buy (1).svg" alt="" />
              </a>
              <a href="/register">
                <img src="/src/assets/icons/User (1).svg" alt="" />
              </a>
            </div>
          </div>
        </div>
        <div className={scss.HeaderMenu}>
          <NavLink
            className={({ isActive }) =>
              `${scss.navLink} ${isActive ? scss.active : ""}`
            }
            to="/catalog"
          >
            <p>
              <img src="./src/assets/icons/Fon.jpg" alt="" /> КАТАЛОГ
            </p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${scss.navLink} ${isActive ? scss.active : ""}`
            }
            to="/mototechnics"
          >
            <p>МОТОТЕХНИКА</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${scss.navLink} ${isActive ? scss.active : ""}`
            }
            to="/motorcycle_helmets"
          >
            <p>МОТОШЛЕМЫ</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${scss.navLink} ${isActive ? scss.active : ""}`
            }
            to="/motorcycle_equipment"
          >
            <p>МОТОЭКИПИРОВКА</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${scss.navLink} ${isActive ? scss.active : ""}`
            }
            to="/tuning"
          >
            <p>ТЮНИНГ</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${scss.navLink} ${isActive ? scss.active : ""}`
            }
            to="/spare_parts"
          >
            <p>ЗАПЧАСТИ</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${scss.navLink} ${isActive ? scss.active : ""}`
            }
            to="/motorcycle_tires"
          >
            <p>МОТОРЕЗИНА</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${scss.navLink} ${isActive ? scss.active : ""}`
            }
            to="/motochemistry"
          >
            <p>МОТОХИМИЯ</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${scss.navLink} ${isActive ? scss.active : ""}`
            }
            to="/stock"
          >
            <p>АКЦИЯ</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${scss.navLink} ${isActive ? scss.active : ""}`
            }
            to="/service"
          >
            <p>СЕРВИС</p>
          </NavLink>
        </div>
        <div className="container">
          <div className={scss.header}></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
