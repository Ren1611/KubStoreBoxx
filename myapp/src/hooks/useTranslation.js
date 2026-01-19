import { useTranslation as useI18nTranslation } from "react-i18next";

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const switchLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem("i18nextLng", lng);
      return true;
    } catch (error) {
      console.error("Error changing language:", error);
      return false;
    }
  };

  return {
    t,
    translate: t,
    currentLanguage: i18n.language,
    changeLanguage: switchLanguage,
    i18n,
  };
};
