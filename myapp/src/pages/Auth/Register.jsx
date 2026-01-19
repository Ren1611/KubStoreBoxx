import React, { useState, useEffect } from "react";
import { useAuth } from "../../MainContext/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import scss from "./Register.module.scss";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const particlesContainer = document.querySelector(
      `.${scss.animatedBackground}`,
    );
    if (particlesContainer) {
      const createParticle = () => {
        const particle = document.createElement("div");
        particle.className = scss.particle;

        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const duration = Math.random() * 20 + 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.opacity = Math.random() * 0.3 + 0.1;

        particlesContainer.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, duration * 1000);
      };

      for (let i = 0; i < 20; i++) {
        createParticle();
      }

      const interval = setInterval(createParticle, 300);

      return () => clearInterval(interval);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailTrim = (email || "").trim();
    const nameTrim = (name || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setError(t("auth_register_invalid_email"));
      return;
    }

    if (!password || password.length < 6) {
      setError(t("auth_register_short_password"));
      return;
    }

    setLoading(true);

    try {
      await signup(emailTrim, password, nameTrim);

      setEmail("");
      setPassword("");
      setName("");

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);

      switch (err.code) {
        case "auth/email-already-in-use":
          setError(t("auth_register_email_in_use"));
          break;
        case "auth/invalid-email":
          setError(t("auth_register_invalid_email_format"));
          break;
        case "auth/weak-password":
          setError(t("auth_register_weak_password"));
          break;
        default:
          setError(t("auth_register_default_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError(t("auth_register_google_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={scss.registerContainer}>
      <div className={scss.animatedBackground}>
        <div className={scss.wave}></div>
        <div className={scss.wave}></div>
        <div className={scss.wave}></div>

        <div className={scss.lightEffect}></div>
        <div className={scss.lightEffect}></div>
      </div>

      <div className={scss.registerCard}>
        <div className={scss.cardHeader}>
          <div className={scss.logo}>
            <span className={scss.logoIcon}>
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path
                  fill="currentColor"
                  d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                />
              </svg>
            </span>
            <h1 className={scss.logoText}>{t("auth_register_page_title")}</h1>
          </div>
          <h2>{t("auth_register_title")}</h2>
          <p className={scss.cardSubtitle}>{t("auth_register_subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className={scss.form}>
          <div className={scss.formGroup}>
            <label htmlFor="name" className={scss.inputLabel}>
              {t("auth_register_name")}
            </label>
            <div className={scss.inputWrapper}>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("auth_register_name_placeholder")}
                disabled={loading}
                className={scss.inputField}
              />
              <span className={scss.inputIcon}>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="#9ca3af"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className={scss.formGroup}>
            <label htmlFor="email" className={scss.inputLabel}>
              {t("auth_email")} *
            </label>
            <div className={scss.inputWrapper}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth_email_placeholder")}
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
              {t("auth_password")} *
            </label>
            <div className={scss.inputWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth_register_password_placeholder")}
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
                {t("auth_register_loading")}
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
                    d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                  />
                </svg>
                {t("auth_register_button")}
              </>
            )}
          </button>
        </form>

        <div className={scss.divider}>
          <span className={scss.dividerLine}></span>
          <span className={scss.dividerText}>{t("auth_register_or")}</span>
          <span className={scss.dividerLine}></span>
        </div>

        <button
          onClick={handleGoogleSignup}
          className={scss.googleButton}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className={scss.googleText}>
            {t("auth_register_google_button")}
          </span>
        </button>

        <div className={scss.links}>
          <p className={scss.linkItem}>
            {t("auth_register_have_account")}{" "}
            <Link to="/login" className={scss.link}>
              {t("auth_login_button")}
            </Link>
          </p>
        </div>

        <div className={scss.terms}>
          <p>
            {t("auth_register_agreement_part1")}{" "}
            <Link to="/terms" className={scss.termsLink}>
              {t("auth_agreement_terms")}
            </Link>{" "}
            {t("auth_register_agreement_part2")}{" "}
            <Link to="/privacy" className={scss.termsLink}>
              {t("auth_agreement_privacy")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
