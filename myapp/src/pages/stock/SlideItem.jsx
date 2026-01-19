import React from "react";
import styles from "./SlideItem.module.scss";

const SlideItem = ({ slide }) => {
  if (!slide) return null;

  return (
    <div className={styles.slideItem}>
      <img
        className={styles.media}
        src={slide.image}
        alt={slide.title || "slide"}
      />

      <div className={styles.content}>
        <h2>{slide.title}</h2>
        <p>{slide.text}</p>
      </div>
    </div>
  );
};

export default SlideItem;
