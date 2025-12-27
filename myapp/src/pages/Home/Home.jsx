import { useEffect, useState } from "react";
import scss from "./Home.module.scss";
import Slider from "./Slider";

const Home = () => {
  return (
    <div className={scss.home}>
      <Slider />
    </div>
  );
};

export default Home;
