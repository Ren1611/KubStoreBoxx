import scss from "./Service.module.scss";
import { useTranslation } from "react-i18next";

const Service = () => {
  const { t } = useTranslation();

  return (
    <div className={scss.servicePage}>
      <div className={scss.hero}>
        <div className="container">
          <div className={scss.heroContent}>
            <div className={scss.heroText}>
              <h1 className={scss.heroTitle}>
                <span className={scss.titleHighlight}>
                  {t("service_title")}
                </span>
              </h1>
              <p className={scss.heroSubtitle}>{t("service_subtitle")}</p>
            </div>
            <div className={scss.heroDecoration}>
              <div className={scss.circle}></div>
              <div className={scss.circle}></div>
              <div className={scss.circle}></div>
            </div>
          </div>
        </div>
      </div>

      <div id={scss.service}>
        <div className="container">
          <div className={scss.service}>
            <div className={scss.nomer1}>
              <div className={scss.card}>
                <div className={scss.cardHeader}>
                  <div className={scss.iconWrapper}>
                    <svg className={scss.icon} viewBox="0 0 24 24">
                      <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                    </svg>
                  </div>
                  <h2 className={scss.sectionTitle}>
                    {t("service_centers_title")}
                  </h2>
                </div>

                <p className={scss.description}>
                  {t("service_centers_description")}
                </p>

                <div className={scss.features}>
                  <div className={scss.feature}>
                    <div className={scss.featureIcon}>✓</div>
                    <span>{t("service_centers_feature1")}</span>
                  </div>
                  <div className={scss.feature}>
                    <div className={scss.featureIcon}>✓</div>
                    <span>{t("service_centers_feature2")}</span>
                  </div>
                  <div className={scss.feature}>
                    <div className={scss.featureIcon}>✓</div>
                    <span>{t("service_centers_feature3")}</span>
                  </div>
                </div>

                <div className={scss.serviceImg}>
                  <div className={scss.imgContainer}>
                    <img
                      src="./src/assets/images/ServicesImg.webp"
                      alt={t("service_image_alt1")}
                      className={scss.img}
                    />
                    <div className={scss.imgOverlay}></div>
                  </div>
                  <div className={scss.imgContainer}>
                    <img
                      src="./src/assets/images/ServicesImg (1).webp"
                      alt={t("service_image_alt2")}
                      className={scss.img}
                    />
                    <div className={scss.imgOverlay}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className={scss.nomer2}>
              <div className={`${scss.card} ${scss.servicesCard}`}>
                <div className={scss.cardHeader}>
                  <div className={scss.rux}>
                    <h1 className={scss.servicesTitle}>
                      <span className={scss.titleAccent}>
                        {t("service_our_services_title")}
                      </span>
                    </h1>
                    <p className={scss.servicesSubtitle}>
                      {t("service_our_services_subtitle")}
                    </p>
                  </div>
                </div>

                <div className={scss.servicesGrid}>
                  <div className={scss.serviceItem}>
                    <div className={scss.serviceIcon}>🛠️</div>
                    <div className={scss.serviceContent}>
                      <h3>{t("service_maintenance")}</h3>
                      <p>{t("service_maintenance_desc")}</p>
                    </div>
                  </div>

                  <div className={scss.serviceItem}>
                    <div className={scss.serviceIcon}>🔍</div>
                    <div className={scss.serviceContent}>
                      <h3>{t("service_diagnostics")}</h3>
                      <p>{t("service_diagnostics_desc")}</p>
                    </div>
                  </div>

                  <div className={scss.serviceItem}>
                    <div className={scss.serviceIcon}>⚙️</div>
                    <div className={scss.serviceContent}>
                      <h3>{t("service_engine")}</h3>
                      <p>{t("service_engine_desc")}</p>
                    </div>
                  </div>

                  <div className={scss.serviceItem}>
                    <div className={scss.serviceIcon}>🔄</div>
                    <div className={scss.serviceContent}>
                      <h3>{t("service_transmission")}</h3>
                      <p>{t("service_transmission_desc")}</p>
                    </div>
                  </div>

                  <div className={scss.serviceItem}>
                    <div className={scss.serviceIcon}>🧩</div>
                    <div className={scss.serviceContent}>
                      <h3>{t("service_suspension")}</h3>
                      <p>{t("service_suspension_desc")}</p>
                    </div>
                  </div>

                  <div className={scss.serviceItem}>
                    <div className={scss.serviceIcon}>🛑</div>
                    <div className={scss.serviceContent}>
                      <h3>{t("service_brakes")}</h3>
                      <p>{t("service_brakes_desc")}</p>
                    </div>
                  </div>

                  <div className={scss.serviceItem}>
                    <div className={scss.serviceIcon}>🔌</div>
                    <div className={scss.serviceContent}>
                      <h3>{t("service_electrical")}</h3>
                      <p>{t("service_electrical_desc")}</p>
                    </div>
                  </div>

                  <div className={scss.serviceItem}>
                    <div className={scss.serviceIcon}>🛞</div>
                    <div className={scss.serviceContent}>
                      <h3>{t("service_tire_service")}</h3>
                      <p>{t("service_tire_service_desc")}</p>
                    </div>
                  </div>

                  <div className={scss.serviceItem}>
                    <div className={scss.serviceIcon}>📅</div>
                    <div className={scss.serviceContent}>
                      <h3>{t("service_seasonal")}</h3>
                      <p>{t("service_seasonal_desc")}</p>
                    </div>
                  </div>

                  <div className={scss.serviceItem}>
                    <div className={scss.serviceIcon}>➕</div>
                    <div className={scss.serviceContent}>
                      <h3>{t("service_accessories")}</h3>
                      <p>{t("service_accessories_desc")}</p>
                    </div>
                  </div>
                </div>

                <button className={scss.ctaButton}>
                  <span>{t("service_book_service")}</span>
                  <svg className={scss.arrowIcon} viewBox="0 0 24 24">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id={scss.HomeSer}>
        <div className="container">
          <div className={scss.HomeSer}>
            <div className={scss.sectionHeader}>
              <h2 className={scss.locationsTitle}>
                {t("service_locations_title")}
              </h2>
              <p className={scss.locationsSubtitle}>
                {t("service_locations_subtitle")}
              </p>
            </div>

            <div className={scss.locationsGrid}>
              <div className={scss.locationCard}>
                <h3 className={scss.locationTitle}>
                  {t("service_location_prospekt_mira_title")}
                </h3>

                <div className={scss.locationInfo}>
                  <div className={scss.infoItem}>
                    <div className={scss.infoIcon}>📍</div>
                    <div className={scss.infoContent}>
                      <h4>{t("service_address")}</h4>
                      <p className={scss.top}>
                        {t("service_prospekt_mira_address")}
                      </p>
                    </div>
                  </div>

                  <div className={scss.infoItem}>
                    <div className={scss.infoIcon}>📞</div>
                    <div className={scss.infoContent}>
                      <h4>{t("service_phone")}</h4>
                      <div className={scss.pop}>
                        <p>{t("service_prospekt_mira_phone")}</p>
                        <p className={scss.extension}>
                          {t("service_extension", { number: "1119" })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={scss.infoItem}>
                    <div className={scss.infoIcon}>✉️</div>
                    <div className={scss.infoContent}>
                      <h4>{t("service_email")}</h4>
                      <a
                        href="mailto:murza@gmail.com"
                        className={scss.emailLink}
                      >
                        {t("service_prospekt_mira_email")}
                      </a>
                    </div>
                  </div>
                </div>

                <button className={scss.locationButton}>
                  {t("service_build_route")}
                </button>
              </div>

              <div className={scss.locationCard}>
                <h3 className={scss.locationTitle}>
                  {t("service_location_saint_petersburg_title")}
                </h3>

                <div className={scss.locationInfo}>
                  <div className={scss.infoItem}>
                    <div className={scss.infoIcon}>📍</div>
                    <div className={scss.infoContent}>
                      <h4>{t("service_address")}</h4>
                      <p className={scss.top}>
                        {t("service_saint_petersburg_address")}
                      </p>
                    </div>
                  </div>

                  <div className={scss.infoItem}>
                    <div className={scss.infoIcon}>📞</div>
                    <div className={scss.infoContent}>
                      <h4>{t("service_phone")}</h4>
                      <div className={scss.poop}>
                        <p>{t("service_saint_petersburg_phone")}</p>
                        <p className={scss.extension}>
                          {t("service_extension", { number: "2106" })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={scss.infoItem}>
                    <div className={scss.infoIcon}>✉️</div>
                    <div className={scss.infoContent}>
                      <h4>{t("service_email")}</h4>
                      <a
                        href="mailto:Kuba@gmail.com"
                        className={scss.emailLink}
                      >
                        {t("service_saint_petersburg_email")}
                      </a>
                    </div>
                  </div>
                </div>

                <button className={scss.locationButton}>
                  {t("service_build_route")}
                </button>
              </div>

              <div className={scss.locationCard}>
                <h3 className={scss.locationTitle}>
                  {t("service_location_krasnodar_title")}
                </h3>

                <div className={scss.locationInfo}>
                  <div className={scss.infoItem}>
                    <div className={scss.infoIcon}>📍</div>
                    <div className={scss.infoContent}>
                      <h4>{t("service_address")}</h4>
                      <p className={scss.top}>
                        {t("service_krasnodar_address")}
                      </p>
                    </div>
                  </div>

                  <div className={scss.infoItem}>
                    <div className={scss.infoIcon}>📞</div>
                    <div className={scss.infoContent}>
                      <h4>{t("service_phone")}</h4>
                      <div className={scss.lox}>
                        <p>{t("service_krasnodar_phone")}</p>
                        <p className={scss.extension}>
                          {t("service_extension", { number: "1205" })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={scss.infoItem}>
                    <div className={scss.infoIcon}>✉️</div>
                    <div className={scss.infoContent}>
                      <h4>{t("service_email")}</h4>
                      <a
                        href="mailto:murmur@gmail.com"
                        className={scss.emailLink}
                      >
                        {t("service_krasnodar_email")}
                      </a>
                    </div>
                  </div>
                </div>

                <button className={scss.locationButton}>
                  {t("service_build_route")}
                </button>
              </div>
            </div>

            <div className={scss.contactBanner}>
              <div className={scss.bannerContent}>
                <div className={scss.bannerText}>
                  <h3>{t("service_consultation_title")}</h3>
                  <p>{t("service_consultation_description")}</p>
                </div>
                <button className={scss.bannerButton}>
                  <a target="blank" href="https://wa.me/qr/NCXYMJDEIVNGP1">
                    {t("service_contact_us")}
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
