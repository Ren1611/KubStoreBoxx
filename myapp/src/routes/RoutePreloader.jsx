// components/RoutePreloader.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Предзагрузка наиболее важных страниц
const RoutePreloader = () => {
  const location = useLocation();

  useEffect(() => {
    // Список страниц для предзагрузки
    const pagesToPreload = {
      "/catalog": () => import("../pages/catalog/Catalog"),
      "/product": () => import("../pages/ProductsDetail/ProductsDetail"),
      "/card": () => import("../pages/Cart/Card"),
    };

    // Предзагружаем страницы на основе текущего пути
    Object.entries(pagesToPreload).forEach(([path, importFn]) => {
      if (
        location.pathname !== path &&
        location.pathname.startsWith("/product/")
      ) {
        // Для страниц продукта предзагружаем после загрузки основной
        setTimeout(() => {
          importFn().catch(() => {});
        }, 1000);
      } else if (location.pathname !== path) {
        // Предзагружаем в фоне
        importFn().catch(() => {});
      }
    });
  }, [location.pathname]);

  return null;
};

export default React.memo(RoutePreloader);
