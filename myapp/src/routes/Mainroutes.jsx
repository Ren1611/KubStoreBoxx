import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import Favorites from "../pages/Favorites/Favorites";
import Mototechnics from "../pages/Auth/mototechnics";
import Motorcycle_helmets from "../pages/Auth/Motorcycle_helmets";
import Motorcycle_equipment from "../pages/Auth/Motorcycle_equipment";
import Tuning from "../pages/Auth/Tuning";
import Spare_parts from "../pages/Auth/Spare_parts";
import Motorcycle_tires from "../pages/Auth/Motorcycle_tires";
import Motochemistry from "../pages/Auth/Motochemistry";
import Stock from "../pages/stock/Stock";
import Service from "../pages/service/Service";
import Catalog from "../pages/catalog/Catalog";
import Products from "../pages/Products/Products";
import Card from "../pages/Cart/Card";
import CardProduct from "../pages/CardProduct/CardProduct";

const Mainroutes = () => {
  const routes = [
    {
      link: "/",
      element: <Home />,
    },
    {
      link: "/catalog",
      element: <Catalog />,
    },
    {
      link: "/mototechnics",
      element: <Mototechnics />,
    },
    {
      link: "/login",
      element: <Login />,
    },
    {
      link: "/motorcycle_helmets",
      element: <Motorcycle_helmets />,
    },
    {
      link: "/motorcycle_equipment",
      element: <Motorcycle_equipment />,
    },
    {
      link: "/register",
      element: <Register />,
    },
    {
      link: "/favorites",
      element: <Favorites />,
    },
    {
      link: "/card",
      element: <Card />,
    },
    {
      link: "/tuning",
      element: <Tuning />,
    },
    {
      link: "/spare_parts",
      element: <Spare_parts />,
    },
    {
      link: "/motorcycle_tires",
      element: <Motorcycle_tires />,
    },
    {
      link: "/motochemistry",
      element: <Motochemistry />,
    },
    {
      link: "/stock",
      element: <Stock />,
    },
    {
      link: "/service",
      element: <Service />,
    },
    {
      link: "/products",
      element: <Products />,
    },
    {
      link: "/cardProduct",
      element: <CardProduct />,
    },
  ];

  return (
    <Routes>
      {routes.map((item, index) => (
        <Route key={index} path={item.link} element={item.element} />
      ))}
    </Routes>
  );
};

export default Mainroutes;
