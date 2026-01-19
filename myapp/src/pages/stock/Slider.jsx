import { useState, useEffect, useRef } from "react";
import SlideItem from "./SlideItem";
import styles from "./Slider.module.scss";

const slides = [
  {
    id: 1,

    image:
      "https://bikeland.ru/upload/iblock/7a6/wk6ejmxtrtpbqkizdxwbqb4cktdzrguo/HQequip_NY_1920x550-_2_.jpg",
  },
  {
    id: 2,

    image:
      "https://bikeland.ru/upload/iblock/e9e/aiu30np6a8q6n6jepfzradwhqkd4l3mb/SENA_NY_1920x550.jpg",
  },
  {
    id: 3,
    image:
      "https://bikeland.ru/upload/iblock/337/l9j2e02hl6nlz5gbdlualnzed4sb4ih9/Accums_NY_1920x550.jpg",
  },
];

const AUTO_PLAY_INTERVAL = 5000;

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  function nextSlide() {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }

  function prevSlide() {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, []);

  function pause() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function resume() {
    pause();
    timerRef.current = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
  }

  return (
    <div className={styles.slider} onMouseEnter={pause} onMouseLeave={resume}>
      <div className={styles.track}>
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`${styles.slide} ${i === current ? styles.active : ""}`}
          >
            <SlideItem slide={s} />
          </div>
        ))}
      </div>

      <button
        className={styles.prev}
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        className={styles.next}
        onClick={nextSlide}
        aria-label="Next slide"
      >
        →
      </button>

      <div className={styles.dots}>
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`${styles.dot} ${i === current ? styles.active : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
