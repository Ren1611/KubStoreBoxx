import React, { useState } from "react";
import { Link } from "react-router-dom";
import scss from "./Contacts.module.scss";
import { useTranslation } from "react-i18next";

const Contacts = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("store");

  const contactInfo = {
    store: {
      title: t("contacts_store_title"),
      shortTitle: t("contacts_store_short_title"),
      address: t("contacts_store_address"),
      description: t("contacts_store_description"),
      hours: [
        {
          day: t("contacts_hours_mon_fri"),
          time: t("contacts_store_hours_weekdays"),
        },
        {
          day: t("contacts_hours_sat"),
          time: t("contacts_store_hours_saturday"),
        },
        {
          day: t("contacts_hours_sun"),
          time: t("contacts_store_hours_sunday"),
        },
      ],
      features: [
        t("contacts_store_feature1"),
        t("contacts_store_feature2"),
        t("contacts_store_feature3"),
        t("contacts_store_feature4"),
        t("contacts_store_feature5"),
      ],
    },
    service: {
      title: t("contacts_service_title"),
      shortTitle: t("contacts_service_short_title"),
      address: t("contacts_service_address"),
      description: t("contacts_service_description"),
      hours: [
        {
          day: t("contacts_hours_mon_fri"),
          time: t("contacts_service_hours_weekdays"),
        },
        {
          day: t("contacts_hours_sat"),
          time: t("contacts_service_hours_saturday"),
        },
        {
          day: t("contacts_hours_sun"),
          time: t("contacts_service_hours_sunday"),
        },
      ],
      features: [
        t("contacts_service_feature1"),
        t("contacts_service_feature2"),
        t("contacts_service_feature3"),
        t("contacts_service_feature4"),
        t("contacts_service_feature5"),
      ],
    },
    warehouse: {
      title: t("contacts_warehouse_title"),
      shortTitle: t("contacts_warehouse_short_title"),
      address: t("contacts_warehouse_address"),
      description: t("contacts_warehouse_description"),
      hours: [
        {
          day: t("contacts_hours_mon_fri"),
          time: t("contacts_warehouse_hours_weekdays"),
        },
        {
          day: t("contacts_hours_sat"),
          time: t("contacts_warehouse_hours_saturday"),
        },
        {
          day: t("contacts_hours_sun"),
          time: t("contacts_warehouse_hours_sunday"),
        },
      ],
      features: [
        t("contacts_warehouse_feature1"),
        t("contacts_warehouse_feature2"),
        t("contacts_warehouse_feature3"),
        t("contacts_warehouse_feature4"),
        t("contacts_warehouse_feature5"),
      ],
    },
  };

  const subjects = [
    t("contacts_form_subject1"),
    t("contacts_form_subject2"),
    t("contacts_form_subject3"),
    t("contacts_form_subject4"),
    t("contacts_form_subject5"),
    t("contacts_form_subject6"),
    t("contacts_form_subject7"),
    t("contacts_form_subject8"),
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);

    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  const phoneNumbers = [
    {
      label: t("contacts_phone1_label"),
      number: t("contacts_phone1_number"),
    },
    {
      label: t("contacts_phone2_label"),
      number: t("contacts_phone2_number"),
    },
    {
      label: t("contacts_phone3_label"),
      number: t("contacts_phone3_number"),
    },
    {
      label: t("contacts_phone4_label"),
      number: t("contacts_phone4_number"),
    },
    {
      label: t("contacts_phone5_label"),
      number: t("contacts_phone5_number"),
    },
  ];

  const socialLinks = [
    {
      name: t("contacts_social_whatsapp"),
      icon: "💬",
      link: "https://wa.me/996555123456",
    },
    {
      name: t("contacts_social_telegram"),
      icon: "📱",
      link: "https://t.me/Kioshi_A15",
    },
    {
      name: t("contacts_social_instagram"),
      icon: "📸",
      link: "https://instagram.com/ku.bat2398",
    },
    {
      name: t("contacts_social_facebook"),
      icon: "👥",
      link: "https://facebook.com/profile.php?id=61560514741224",
    },
    { name: t("contacts_social_youtube"), icon: "🎥", link: "#" },
  ];

  return (
    <div className={scss.contactsPage}>
      <div className="container">
        <div className={scss.breadcrumbs}>
          <Link to="/">{t("header_home")}</Link>
          <span> / </span>
          <span className={scss.current}>{t("contacts_page_title")}</span>
        </div>

        <div className={scss.pageHeader}>
          <h1>{t("contacts_page_title")}</h1>
          <p className={scss.subtitle}>{t("contacts_page_subtitle")}</p>
        </div>

        <div className={scss.contactsContent}>
          <div className={scss.contactPhones}>
            <h2>{t("contacts_phones_title")}</h2>
            <div className={scss.phonesGrid}>
              {phoneNumbers.map((phone, index) => (
                <div key={index} className={scss.phoneCard}>
                  <div className={scss.phoneLabel}>{phone.label}</div>
                  <a
                    href={`tel:${phone.number.replace(/\s/g, "")}`}
                    className={scss.phoneNumber}
                  >
                    {phone.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className={scss.mainLayout}>
            <div className={scss.leftColumn}>
              <div className={scss.contactFormSection}>
                <h2>{t("contacts_form_title")}</h2>
                <p>{t("contacts_form_description")}</p>

                {submitted ? (
                  <div className={scss.successMessage}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 4L12 14.01L9 11.01"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <h3>{t("contacts_form_success_title")}</h3>
                    <p>{t("contacts_form_success_message")}</p>
                  </div>
                ) : (
                  <form className={scss.contactForm} onSubmit={handleSubmit}>
                    <div className={scss.formGrid}>
                      <div className={scss.formGroup}>
                        <label htmlFor="name">
                          {t("contacts_form_name")} *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={t("contacts_form_name_placeholder")}
                          required
                        />
                      </div>
                      <div className={scss.formGroup}>
                        <label htmlFor="email">
                          {t("contacts_form_email")} *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t("contacts_form_email_placeholder")}
                          required
                        />
                      </div>
                      <div className={scss.formGroup}>
                        <label htmlFor="phone">
                          {t("contacts_form_phone")}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={t("contacts_form_phone_placeholder")}
                        />
                      </div>
                      <div className={scss.formGroup}>
                        <label htmlFor="subject">
                          {t("contacts_form_subject")} *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">
                            {t("contacts_form_subject_placeholder")}
                          </option>
                          {subjects.map((subject, index) => (
                            <option key={index} value={subject}>
                              {subject}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={scss.formGroup}>
                      <label htmlFor="message">
                        {t("contacts_form_message")} *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="5"
                        placeholder={t("contacts_form_message_placeholder")}
                        required
                      />
                    </div>

                    <div className={scss.formFooter}>
                      <div className={scss.agreement}>
                        <input type="checkbox" id="agreement" required />
                        <label htmlFor="agreement">
                          {t("contacts_form_agreement")}
                        </label>
                      </div>
                      <button type="submit" className={scss.submitBtn}>
                        {t("contacts_form_submit")}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className={scss.socialSection}>
                <h2>{t("contacts_social_title")}</h2>
                <p>{t("contacts_social_description")}</p>
                <div className={scss.socialLinks}>
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={scss.socialLink}
                    >
                      <span className={scss.socialIcon}>{social.icon}</span>
                      <span className={scss.socialName}>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className={scss.rightColumn}>
              <div className={scss.locationsTabs}>
                <div className={scss.tabsHeader}>
                  {Object.keys(contactInfo).map((key) => (
                    <button
                      key={key}
                      className={`${scss.tabBtn} ${
                        activeTab === key ? scss.active : ""
                      }`}
                      onClick={() => setActiveTab(key)}
                      title={contactInfo[key].title}
                    >
                      {key === "store" && (
                        <>
                          <span className={scss.tabIcon}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9 22V12H15V22"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span className={scss.tabText}>
                            {contactInfo[key].shortTitle}
                          </span>
                        </>
                      )}
                      {key === "service" && (
                        <>
                          <span className={scss.tabIcon}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M14.7 6.3C14.5168 6.11675 14.3136 5.95555 14.0945 5.81999C13.2494 5.29543 12.1959 5.17219 11.2482 5.4806C10.3005 5.78901 9.55287 6.49808 9.212 7.40001C9.14906 7.55573 9.10669 7.71883 9.08575 7.88501M9.6 21H14.4C15.8856 21 16.6284 21 17.1635 20.7478C17.6368 20.524 18.024 20.1368 18.2478 19.6635C18.5 19.1284 18.5 18.3856 18.5 16.9V16.1C18.5 14.6144 18.5 13.8716 18.2478 13.3365C18.024 12.8632 17.6368 12.476 17.1635 12.2522C16.6284 12 15.8856 12 14.4 12H9.6C8.11438 12 7.37157 12 6.83648 12.2522C6.36321 12.476 5.97601 12.8632 5.7522 13.3365C5.5 13.8716 5.5 14.6144 5.5 16.1V16.9C5.5 18.3856 5.5 19.1284 5.7522 19.6635C5.97601 20.1368 6.36321 20.524 6.83648 20.7478C7.37157 21 8.11438 21 9.6 21Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 9V12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span className={scss.tabText}>
                            {contactInfo[key].shortTitle}
                          </span>
                        </>
                      )}
                      {key === "warehouse" && (
                        <>
                          <span className={scss.tabIcon}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M20 7L12 3L4 7M20 7V17L12 21M20 7L12 11M12 21V11M4 7L12 11M22 17V7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span className={scss.tabText}>
                            {contactInfo[key].shortTitle}
                          </span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
                <div className={scss.tabContent}>
                  <div className={scss.locationCard}>
                    <div className={scss.locationHeader}>
                      <h3>{contactInfo[activeTab].title}</h3>
                      <div className={scss.locationAddress}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {contactInfo[activeTab].address}
                      </div>
                    </div>

                    <p className={scss.locationDescription}>
                      {contactInfo[activeTab].description}
                    </p>

                    <div className={scss.locationDetails}>
                      <div className={scss.workingHours}>
                        <h4>{t("contacts_working_hours")}</h4>
                        <ul>
                          {contactInfo[activeTab].hours.map((item, index) => (
                            <li key={index}>
                              <span className={scss.day}>{item.day}</span>
                              <span className={scss.time}>{item.time}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className={scss.locationFeatures}>
                        <h4>{t("contacts_services")}</h4>
                        <ul>
                          {contactInfo[activeTab].features.map(
                            (feature, index) => (
                              <li key={index}>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {feature}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={scss.mapSection}>
            <h2>{t("contacts_map_title")}</h2>
            <div className={scss.mapContainer}>
              <div className={scss.mapWrapper}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d9485.543614175775!2d74.5867464547429!3d42.87735397444875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2skg!4v1767897449686!5m2!1sru!2skg"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="KubStore Location Map"
                  className={scss.mapIframe}
                ></iframe>
              </div>
              <div className={scss.mapLocations}>
                {Object.keys(contactInfo).map((key) => (
                  <div key={key} className={scss.mapLocation}>
                    <h4>{contactInfo[key].title}</h4>
                    <p>{contactInfo[key].address}</p>
                    <button
                      className={scss.mapBtn}
                      onClick={() => setActiveTab(key)}
                    >
                      {t("contacts_show_details")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={scss.faqPreview}>
            <div className={scss.faqContent}>
              <h2>{t("contacts_faq_title")}</h2>
              <p>{t("contacts_faq_description")}</p>
              <div className={scss.faqQuestions}>
                <div className={scss.faqQuestion}>
                  <h3>{t("contacts_faq_question1")}</h3>
                  <p>{t("contacts_faq_answer1")}</p>
                </div>
                <div className={scss.faqQuestion}>
                  <h3>{t("contacts_faq_question2")}</h3>
                  <p>{t("contacts_faq_answer2")}</p>
                </div>
                <div className={scss.faqQuestion}>
                  <h3>{t("contacts_faq_question3")}</h3>
                  <p>{t("contacts_faq_answer3")}</p>
                </div>
              </div>
              <Link to="/faq" className={scss.faqLink}>
                {t("contacts_view_all_questions")} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
