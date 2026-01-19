import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import i18n, { changeLanguage, loadTranslations } from "./index";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "ru");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await loadTranslations();

        setCurrentLanguage(i18n.language);

        const savedLang = localStorage.getItem("i18nextLng");
        if (savedLang && ["en", "ru", "ky"].includes(savedLang)) {
          await i18n.changeLanguage(savedLang);
          setCurrentLanguage(savedLang);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Language initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng);
      document.documentElement.lang = lng;
      localStorage.setItem("i18nextLng", lng);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  const switchLanguage = useCallback(
    async (lng) => {
      if (!["en", "ru", "ky"].includes(lng) || lng === currentLanguage) return;

      setIsLoading(true);
      try {
        const success = await changeLanguage(lng);
        if (success) {
          setCurrentLanguage(lng);
        }
      } catch (error) {
        console.error("Error changing language:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentLanguage],
  );

  const availableLanguages = [
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
    { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча", flag: "🇰🇬" },
  ];

  const getCurrentLanguage = () => {
    return (
      availableLanguages.find((lang) => lang.code === currentLanguage) ||
      availableLanguages[1]
    );
  };

  const value = {
    currentLanguage,
    switchLanguage,
    availableLanguages,
    getCurrentLanguage,
    isLoading,
    isInitialized,
    t: i18n.t.bind(i18n),
    i18n,
  };

  if (!isInitialized) {
    return <div>Loading translations...</div>;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
