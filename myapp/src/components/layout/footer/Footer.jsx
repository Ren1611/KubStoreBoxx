import styles from "./Footer.module.scss";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import { SiMastercard, SiVisa, SiPaypal } from "react-icons/si";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div>
      <footer className={styles.homeFooter}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3 className={styles.footerTitle}>{t("footer_title")}</h3>
              <p className={styles.footerDescription}>
                {t("footer_description")}
              </p>
              <div className={styles.socialLinks}>
                <a
                  target="blank"
                  href="https://www.facebook.com/profile.php?id=61560514741224&mibextid=ZbWKwL"
                  className={styles.socialLink}
                  aria-label={t("footer_social_facebook")}
                >
                  <FaFacebookF />
                </a>
                <a
                  target="blank"
                  href="https://www.instagram.com/ku.bat2398?igsh=MXFhZDJ1Y3I0dGpteg=="
                  className={styles.socialLink}
                  aria-label={t("footer_social_instagram")}
                >
                  <FaInstagram />
                </a>
                <a
                  target="blank"
                  href="t.me/Kioshi_A15"
                  className={styles.socialLink}
                  aria-label={t("footer_social_telegram")}
                >
                  <FaTelegram />
                </a>
                <a
                  target="blank"
                  href="https://wa.me/qr/NCXYMJDEIVNGP1"
                  className={styles.socialLink}
                  aria-label={t("footer_social_whatsapp")}
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>

            <div className={styles.footerSection}>
              <h4 className={styles.footerSubtitle}>{t("footer_catalog")}</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link to="/Motorcycle_helmets">
                    {t("footer_motorcycle_helmets")}
                  </Link>
                </li>
                <li>
                  <Link to="/Motorcycle_equipment">
                    {t("footer_motorcycle_equipment")}
                  </Link>
                </li>
                <li>
                  <Link to="/spare_parts">{t("footer_spare_parts")}</Link>
                </li>
                <li>
                  <Link to="/Tuning">{t("footer_accessories")}</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h4 className={styles.footerSubtitle}>{t("footer_help")}</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link to="/register">{t("footer_register")}</Link>
                </li>
                <li>
                  <Link to="/login">{t("footer_login")}</Link>
                </li>
                <li>
                  <Link to="/contacts">{t("footer_contacts")}</Link>
                </li>
                <li>
                  <Link to="/faq">{t("footer_faq")}</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h4 className={styles.footerSubtitle}>
                {t("footer_payment_methods")}
              </h4>
              <div className={styles.paymentMethods}>
                <SiVisa className={styles.paymentIcon} />
                <SiMastercard className={styles.paymentIcon} />
                <SiPaypal className={styles.paymentIcon} />
              </div>
              <p className={styles.contactInfo}>
                {t("footer_phone")}
                <br />
                {t("footer_email")}
              </p>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.copyright}>
              {t("footer_copyright", { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
