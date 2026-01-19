import React, { useState, useEffect } from "react";
import { useAuth } from "../../MainContext/AuthContext";
import { useNavigate } from "react-router-dom";
import scss from "./AdminLogin.module.scss";
import { useTranslation } from "react-i18next";

const AdminLogin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Добавляем эффект частиц при монтировании
    const particlesContainer = document.querySelector(
      `.${scss.animatedBackground}`,
    );
    if (particlesContainer) {
      const createParticle = () => {
        const particle = document.createElement("div");
        particle.className = scss.particle;

        // Случайные параметры для частицы
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const duration = Math.random() * 20 + 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.opacity = Math.random() * 0.3 + 0.1;

        particlesContainer.appendChild(particle);

        // Удаляем частицу после завершения анимации
        setTimeout(() => {
          particle.remove();
        }, duration * 1000);
      };

      // Создаем начальные частицы
      for (let i = 0; i < 20; i++) {
        createParticle();
      }

      // Интервал для создания новых частиц
      const interval = setInterval(createParticle, 300);

      return () => clearInterval(interval);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔐 Попытка входа...");

      // Вход
      await login(email, password);

      console.log("✅ Вход выполнен, проверка прав...");

      // Даем время на обновление состояния
      setTimeout(() => {
        if (isAdmin()) {
          console.log("✅ Права админа подтверждены");
          navigate("/products", { replace: true });
        } else {
          setError(t("admin_no_admin_rights"));
          setLoading(false);
        }
      }, 500);
    } catch (err) {
      console.error("Ошибка входа:", err);

      let errorMessage = t("admin_login_error");

      if (err.code === "auth/invalid-credential") {
        errorMessage = t("auth_error_invalid_credentials");
      } else if (err.code === "auth/user-not-found") {
        errorMessage = t("auth_error_user_not_found");
      } else if (err.code === "auth/wrong-password") {
        errorMessage = t("auth_error_wrong_password");
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    console.log("🚀 Быстрый вход (режим разработки)");

    const mockUser = {
      uid: "dev_admin_" + Date.now(),
      email: "admin@motoshop.com",
      displayName: "Разработчик",
      role: "admin",
      isDevMode: true,
    };

    localStorage.setItem("kubstore_admin_session", JSON.stringify(mockUser));
    localStorage.setItem("kubstore_last_login", mockUser.email);

    // Редирект
    window.location.href = "/products";
  };

  const testFirebase = async () => {
    setLoading(true);
    try {
      const { auth, db } = await import("../../firebase/config");

      console.log("🧪 Тест Firebase:");
      console.log("- Проект:", auth.app.options.projectId);
      console.log("- Auth:", auth ? "✅" : "❌");
      console.log("- Firestore:", db ? "✅" : "❌");

      setError(
        t("admin_firebase_connected", { project: auth.app.options.projectId }),
      );
    } catch (error) {
      setError(t("admin_firebase_error", { message: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const grantAdminRights = () => {
    // Простой способ выдать права
    const currentSession = localStorage.getItem("kubstore_admin_session");

    if (currentSession) {
      try {
        const session = JSON.parse(currentSession);
        const updatedSession = {
          ...session,
          role: "admin",
          grantedAt: new Date().toISOString(),
        };

        localStorage.setItem(
          "kubstore_admin_session",
          JSON.stringify(updatedSession),
        );
        setError(t("admin_rights_granted"));
      } catch (error) {
        setError(t("admin_grant_error", { message: error.message }));
      }
    } else {
      // Создаем новую сессию
      const newSession = {
        uid: "manual_admin_" + Date.now(),
        email: email || "admin@motoshop.com",
        role: "admin",
        name: "Ручная выдача прав",
        grantedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "kubstore_admin_session",
        JSON.stringify(newSession),
      );
      setError(t("admin_new_session_created"));
    }
  };

  return (
    <div className={scss.adminLoginContainer}>
      <div className={scss.animatedBackground}>
        {/* Анимированный фон с волнами */}
        <div className={scss.wave}></div>
        <div className={scss.wave}></div>
        <div className={scss.wave}></div>

        {/* Световые эффекты */}
        <div className={scss.lightEffect}></div>
        <div className={scss.lightEffect}></div>
      </div>

      <div className={scss.adminLoginCard}>
        <div className={scss.cardHeader}>
          <div className={scss.logo}>
            <span className={scss.logoIcon}>
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path
                  fill="currentColor"
                  d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M19,11c0,1.85-0.51,3.65-1.38,5.21l-1.45-1.45 c1.29-1.94,1.07-4.58-0.64-6.29c-1.52-1.52-3.89-1.77-5.68-0.84l1.66,1.66l-1.41,1.41l-4.24-4.24l1.41-1.41l1.66,1.66 c1.52-0.64,3.31-0.39,4.61,0.91C19.49,7.52,19,9.21,19,11z M12,15c-1.66,0-3-1.34-3-3s1.34-3,3-3s3,1.34,3,3S13.66,15,12,15z"
                />
              </svg>
            </span>
            <h1 className={scss.logoText}>{t("admin_panel")}</h1>
          </div>
          <h2>{t("admin_login_title")}</h2>
          <p className={scss.cardSubtitle}>{t("admin_login_subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className={scss.form}>
          <div className={scss.formGroup}>
            <label htmlFor="email" className={scss.inputLabel}>
              {t("admin_email")}
            </label>
            <div className={scss.inputWrapper}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("admin_email_placeholder")}
                required
                disabled={loading}
                className={scss.inputField}
              />
              <span className={scss.inputIcon}>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="#9ca3af"
                    d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className={scss.formGroup}>
            <label htmlFor="password" className={scss.inputLabel}>
              {t("auth_password")}
            </label>
            <div className={scss.inputWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className={scss.inputField}
              />
              <span className={scss.inputIcon}>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="#9ca3af"
                    d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                  />
                </svg>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={scss.passwordToggle}
                aria-label={
                  showPassword
                    ? t("auth_hide_password")
                    : t("auth_show_password")
                }
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  {showPassword ? (
                    <path
                      fill="#6b7280"
                      d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    />
                  ) : (
                    <path
                      fill="#6b7280"
                      d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <div className={scss.errorAlert}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#dc2626"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                />
              </svg>
              <span className={scss.errorText}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={scss.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={scss.spinner}></span>
                {t("admin_checking_access")}
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fill="currentColor"
                    d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                  />
                </svg>
                {t("admin_login_as_admin")}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
