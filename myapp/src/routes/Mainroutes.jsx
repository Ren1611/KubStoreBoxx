import React, { Suspense, lazy, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const Home = lazy(() => import("../pages/Home/Home"));
const Register = lazy(() => import("../pages/Auth/Register"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Favorites = lazy(() => import("../pages/Favorites/Favorites"));
const Mototechnics = lazy(() => import("../pages/Auth/Mototechnics"));
const Motorcycle_helmets = lazy(
  () => import("../pages/Auth/Motorcycle_helmets"),
);
const Motorcycle_equipment = lazy(
  () => import("../pages/Auth/Motorcycle_equipment"),
);
const Tuning = lazy(() => import("../pages/Auth/Tuning"));
const Spare_parts = lazy(() => import("../pages/Auth/Spare_parts"));
const Motorcycle_tires = lazy(() => import("../pages/Auth/Motorcycle_tires"));
const Motochemistry = lazy(() => import("../pages/Auth/Motochemistry"));
const Stock = lazy(() => import("../pages/stock/Stock"));
const Service = lazy(() => import("../pages/service/Service"));
const Catalog = lazy(() => import("../pages/catalog/Catalog"));
const Products = lazy(() => import("../pages/Products/Products"));
const Card = lazy(() => import("../pages/Cart/Card"));
const ProductDetail = lazy(
  () => import("../pages/ProductsDetail/ProductsDetail"),
);
const Checkout = lazy(() => import("../pages/checkout/Checkout"));
const Faq = lazy(() => import("../components/layout/footer/Faq"));
const Contacts = lazy(() => import("../components/layout/footer/Contacts"));
const AdminLogin = lazy(() => import("../pages/Admin/AdminLogin"));
const Profile = lazy(() => import("../pages/Profile/Profile"));

const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "300px",
      flexDirection: "column",
      gap: "15px",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "3px solid #f3f3f3",
        borderTop: "3px solid #ea66e8",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    ></div>
    <p style={{ color: "#666", fontSize: "14px" }}>Загрузка страницы...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const LazyRoute = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const Mainroutes = () => {
  const routes = useMemo(
    () => [
      {
        link: "/",
        element: (
          <LazyRoute>
            <Home />
          </LazyRoute>
        ),
        exact: true,
      },
      {
        link: "/catalog",
        element: (
          <LazyRoute>
            <Catalog />
          </LazyRoute>
        ),
      },
      {
        link: "/mototechnics",
        element: (
          <LazyRoute>
            <Mototechnics />
          </LazyRoute>
        ),
      },
      {
        link: "/login",
        element: (
          <LazyRoute>
            <Login />
          </LazyRoute>
        ),
      },
      {
        link: "/motorcycle_helmets",
        element: (
          <LazyRoute>
            <Motorcycle_helmets />
          </LazyRoute>
        ),
      },
      {
        link: "/motorcycle_equipment",
        element: (
          <LazyRoute>
            <Motorcycle_equipment />
          </LazyRoute>
        ),
      },
      {
        link: "/register",
        element: (
          <LazyRoute>
            <Register />
          </LazyRoute>
        ),
      },
      {
        link: "/favorites",
        element: (
          <LazyRoute>
            <Favorites />
          </LazyRoute>
        ),
      },
      {
        link: "/card",
        element: (
          <LazyRoute>
            <Card />
          </LazyRoute>
        ),
      },
      {
        link: "/tuning",
        element: (
          <LazyRoute>
            <Tuning />
          </LazyRoute>
        ),
      },
      {
        link: "/spare_parts",
        element: (
          <LazyRoute>
            <Spare_parts />
          </LazyRoute>
        ),
      },
      {
        link: "/motorcycle_tires",
        element: (
          <LazyRoute>
            <Motorcycle_tires />
          </LazyRoute>
        ),
      },
      {
        link: "/motochemistry",
        element: (
          <LazyRoute>
            <Motochemistry />
          </LazyRoute>
        ),
      },
      {
        link: "/stock",
        element: (
          <LazyRoute>
            <Stock />
          </LazyRoute>
        ),
      },
      {
        link: "/service",
        element: (
          <LazyRoute>
            <Service />
          </LazyRoute>
        ),
      },
      {
        link: "/products",
        element: (
          <LazyRoute>
            <ProtectedRoute requireAdmin>
              <Products />
            </ProtectedRoute>
          </LazyRoute>
        ),
      },
      {
        link: "/faq",
        element: (
          <LazyRoute>
            <Faq />
          </LazyRoute>
        ),
      },
      {
        link: "/contacts",
        element: (
          <LazyRoute>
            <Contacts />
          </LazyRoute>
        ),
      },
      {
        link: "/admin-login",
        element: (
          <LazyRoute>
            <AdminLogin />
          </LazyRoute>
        ),
      },
      {
        link: "/profile",
        element: (
          <LazyRoute>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </LazyRoute>
        ),
      },
    ],
    [],
  );

  return (
    <Routes>
      {routes.map((item, index) => (
        <Route
          key={`${item.link}-${index}`}
          path={item.link}
          element={item.element}
        />
      ))}
      <Route
        path="/product/:id"
        element={
          <LazyRoute>
            <ProductDetail />
          </LazyRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <LazyRoute>
            <Checkout />
          </LazyRoute>
        }
      />
    </Routes>
  );
};

export default React.memo(Mainroutes);
