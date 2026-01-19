import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RoutePreloader = () => {
  const location = useLocation();

  useEffect(() => {
    const pagesToPreload = {
      "/catalog": () => import("../pages/catalog/Catalog"),
      "/product": () => import("../pages/ProductsDetail/ProductsDetail"),
      "/card": () => import("../pages/Cart/Card"),
    };

    Object.entries(pagesToPreload).forEach(([path, importFn]) => {
      if (
        location.pathname !== path &&
        location.pathname.startsWith("/product/")
      ) {
        setTimeout(() => {
          importFn().catch(() => {});
        }, 1000);
      } else if (location.pathname !== path) {
        importFn().catch(() => {});
      }
    });
  }, [location.pathname]);

  return null;
};

export default React.memo(RoutePreloader);
