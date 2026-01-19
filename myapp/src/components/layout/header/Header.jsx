import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import scss from "./Header.module.scss";
import LanguageSwitcher from "../../../components/LanguageSwitcher";

const Header = () => {
  const [isCatalogHovered, setIsCatalogHovered] = useState(false);
  const [isMotorTechHovered, setIsMotorTechHovered] = useState(false);
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const catalogCategories = [
    {
      id: 1,
      name: t("categories_motorcycle_tires", "Моторезина"),
      path: "/motorcycle_tires",
    },
    {
      id: 2,
      name: t("categories_motorcycle_helmets", "Мотошлемы"),
      path: "/motorcycle_helmets",
    },
    {
      id: 3,
      name: t("categories_motorcycle_equipment", "Мотоэкипировка"),
      path: "/motorcycle_equipment",
    },
    { id: 4, name: t("categories_tuning", "Тюнинг"), path: "/tuning" },
    {
      id: 5,
      name: t("categories_spare_parts", "Запчасти"),
      path: "/spare_parts",
    },
    {
      id: 6,
      name: t("categories_motochemistry", "Мотохимия"),
      path: "/motochemistry",
    },
  ];

  const motorTechCategories = [
    {
      id: 1,
      name: t("categories_motorcycles", "Мотоциклы"),
      path: "/mototechnics",
      filterType: "all",
      kubCategory: "all",
    },
    {
      id: 2,
      name: t("categories_superbikes", "Спортивные мотоциклы"),
      path: "/mototechnics",
      filterType: "superbike",
      kubCategory: "superbike",
    },
    {
      id: 3,
      name: t("categories_cruisers", "Круизеры"),
      path: "/mototechnics",
      filterType: "cruiser",
      kubCategory: "cruiser",
    },
    {
      id: 4,
      name: t("categories_naked", "Нейкеды"),
      path: "/mototechnics",
      filterType: "naked",
      kubCategory: "naked",
    },
    {
      id: 5,
      name: t("categories_touring", "Туреры"),
      path: "/mototechnics",
      filterType: "touring",
      kubCategory: "touring",
    },
    {
      id: 6,
      name: t("categories_sport_touring", "Спорт-туреры"),
      path: "/mototechnics",
      filterType: "sport-touring",
      kubCategory: "sport-touring",
    },
    {
      id: 7,
      name: t("categories_atv", "Квадроциклы"),
      path: "/mototechnics",
      filterType: "atv",
      kubCategory: "atv",
    },
    {
      id: 8,
      name: t("categories_scooter", "Скутеры"),
      path: "/mototechnics",
      filterType: "scooter",
      kubCategory: "scooter",
    },
  ];

  const handleMotorTechClick = (category) => {
    const params = new URLSearchParams({
      filter: category.filterType,
      kubCategory: category.kubCategory,
    });

    navigate(`${category.path}?${params.toString()}`);
    setIsMotorTechHovered(false);
  };

  return (
    <div className={scss.wrapper}>
      <div className={scss.topBar}>
        <div className={scss.topBarContent}>
          <div className={scss.contacts}>
            <span className={scss.phone}>
              <span className={scss.phoneIcon}>📞</span>
              +996 708 502 907
            </span>
            <span className={scss.separator}>|</span>
            <span className={scss.forDealers}>
              {t("header_for_dealers", "Для дилеров")}
            </span>
            <span className={scss.separator}>|</span>
            <span className={scss.internetShop}>
              {t("header_internet_shop", "Интернет-магазин")}: 8 800 333-66-53
            </span>
          </div>
        </div>
      </div>

      <header className={scss.mainHeader}>
        <div className={scss.headerContent}>
          <div className={scss.logoSection}>
            <NavLink to="/" className={scss.logo}>
              <span className={scss.logoText}>
                {t("app_title", "KubStore")}
              </span>
              <span className={scss.logoSubtitle}>
                {t("app_subtitle", "мототехника и экипировка")}
              </span>
            </NavLink>
          </div>

          <nav className={scss.mainNav}>
            <div className={scss.navItems}>
              <div
                className={scss.navItemWrapper}
                onMouseEnter={() => setIsCatalogHovered(true)}
                onMouseLeave={() => setIsCatalogHovered(false)}
              >
                <NavLink
                  to="/catalog"
                  className={({ isActive }) =>
                    `${scss.navItem} ${isActive ? scss.active : ""}`
                  }
                >
                  <span className={scss.navIcon}>📦</span>
                  <span className={scss.navText}>
                    {t("navigation_catalog", "Каталог")}
                  </span>
                  <span className={scss.arrow}>▼</span>
                </NavLink>

                {isCatalogHovered && (
                  <div className={scss.dropdownMenu}>
                    <div className={scss.dropdownContent}>
                      {catalogCategories.map((category) => (
                        <NavLink
                          key={category.id}
                          to={category.path}
                          className={scss.dropdownItem}
                          onClick={() => setIsCatalogHovered(false)}
                        >
                          {category.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className={scss.navItemWrapper}
                onMouseEnter={() => setIsMotorTechHovered(true)}
                onMouseLeave={() => setIsMotorTechHovered(false)}
              >
                <NavLink
                  to="/mototechnics"
                  className={({ isActive }) =>
                    `${scss.navItem} ${isActive ? scss.active : ""}`
                  }
                >
                  <span className={scss.navIcon}>🏍️</span>
                  <span className={scss.navText}>
                    {t("navigation_mototechnics", "Мототехника")}
                  </span>
                </NavLink>
              </div>

              <NavLink
                to="/stock"
                className={({ isActive }) =>
                  `${scss.navItem} ${scss.hot} ${isActive ? scss.active : ""}`
                }
              >
                <span className={scss.navIcon}>🔥</span>
                <span className={scss.navText}>
                  {t("navigation_stock", "Акции")}
                </span>
              </NavLink>

              <NavLink
                to="/service"
                className={({ isActive }) =>
                  `${scss.navItem} ${isActive ? scss.active : ""}`
                }
              >
                <span className={scss.navIcon}>🔧</span>
                <span className={scss.navText}>
                  {t("navigation_service", "Сервис")}
                </span>
              </NavLink>
            </div>
          </nav>

          <div className={scss.userSection}>
            <NavLink to="/favorites" className={scss.userIcon}>
              <div className={scss.iconContainer}>
                <span className={scss.icon}>❤️</span>
                <span className={scss.iconLabel}>
                  {t("navigation_favorites", "Избранное")}
                </span>
              </div>
            </NavLink>

            <NavLink to="/profile" className={scss.userIcon}>
              <div className={scss.iconContainer}>
                <span className={scss.icon}>👤</span>
                <span className={scss.iconLabel}>
                  {t("navigation_profile", "Профиль")}
                </span>
              </div>
            </NavLink>

            <NavLink to="/card" className={`${scss.userIcon} ${scss.cartIcon}`}>
              <div className={scss.iconContainer}>
                <span className={scss.icon}>🛒</span>
                <span className={scss.iconLabel}>
                  {t("navigation_cart", "Корзина")}
                </span>
              </div>
            </NavLink>
            <LanguageSwitcher />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
