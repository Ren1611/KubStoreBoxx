import React from "react";
import { useTranslation } from "react-i18next";

const TestI18n = () => {
  const { t, i18n } = useTranslation();

  return (
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      <h2>Тест i18n</h2>
      <p>Язык: {i18n.language}</p>
      <p>home.new_collection: {t("home.new_collection")}</p>
      <p>categories.motorcycle_helmets: {t("categories.motorcycle_helmets")}</p>
      <button onClick={() => i18n.changeLanguage("ru")}>RU</button>
      <button onClick={() => i18n.changeLanguage("en")}>EN</button>
      <button onClick={() => i18n.changeLanguage("ky")}>KY</button>
    </div>
  );
};

export default TestI18n;
