import React, { useState } from "react";
import { Link } from "react-router-dom";
import scss from "./FAQ.module.scss";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [openQuestions, setOpenQuestions] = useState(new Set());

  const categories = [
    { id: "all", name: t("faq_category_all"), count: 25 },
    { id: "delivery", name: t("faq_category_delivery"), count: 8 },
    { id: "returns", name: t("faq_category_returns"), count: 5 },
    { id: "products", name: t("faq_category_products"), count: 6 },
    { id: "service", name: t("faq_category_service"), count: 4 },
    { id: "other", name: t("faq_category_other"), count: 2 },
  ];

  const faqItems = [
    {
      id: 1,
      category: "delivery",
      question: t("faq_delivery_question_1"),
      answer: t("faq_delivery_answer_1"),
      popular: true,
    },
    {
      id: 2,
      category: "delivery",
      question: t("faq_delivery_question_2"),
      answer: t("faq_delivery_answer_2"),
      popular: true,
    },
    {
      id: 3,
      category: "delivery",
      question: t("faq_delivery_question_3"),
      answer: t("faq_delivery_answer_3"),
      popular: false,
    },
    {
      id: 4,
      category: "delivery",
      question: t("faq_delivery_question_4"),
      answer: t("faq_delivery_answer_4"),
      popular: false,
    },
    {
      id: 5,
      category: "delivery",
      question: t("faq_delivery_question_5"),
      answer: t("faq_delivery_answer_5"),
      popular: true,
    },
    {
      id: 6,
      category: "delivery",
      question: t("faq_delivery_question_6"),
      answer: t("faq_delivery_answer_6"),
      popular: false,
    },
    {
      id: 7,
      category: "delivery",
      question: t("faq_delivery_question_7"),
      answer: t("faq_delivery_answer_7"),
      popular: false,
    },
    {
      id: 8,
      category: "delivery",
      question: t("faq_delivery_question_8"),
      answer: t("faq_delivery_answer_8"),
      popular: true,
    },

    {
      id: 9,
      category: "returns",
      question: t("faq_returns_question_1"),
      answer: t("faq_returns_answer_1"),
      popular: true,
    },
    {
      id: 10,
      category: "returns",
      question: t("faq_returns_question_2"),
      answer: t("faq_returns_answer_2"),
      popular: false,
    },
    {
      id: 11,
      category: "returns",
      question: t("faq_returns_question_3"),
      answer: t("faq_returns_answer_3"),
      popular: false,
    },
    {
      id: 12,
      category: "returns",
      question: t("faq_returns_question_4"),
      answer: t("faq_returns_answer_4"),
      popular: true,
    },
    {
      id: 13,
      category: "returns",
      question: t("faq_returns_question_5"),
      answer: t("faq_returns_answer_5"),
      popular: false,
    },

    {
      id: 14,
      category: "products",
      question: t("faq_products_question_1"),
      answer: t("faq_products_answer_1"),
      popular: true,
    },
    {
      id: 15,
      category: "products",
      question: t("faq_products_question_2"),
      answer: t("faq_products_answer_2"),
      popular: true,
    },
    {
      id: 16,
      category: "products",
      question: t("faq_products_question_3"),
      answer: t("faq_products_answer_3"),
      popular: false,
    },
    {
      id: 17,
      category: "products",
      question: t("faq_products_question_4"),
      answer: t("faq_products_answer_4"),
      popular: false,
    },
    {
      id: 18,
      category: "products",
      question: t("faq_products_question_5"),
      answer: t("faq_products_answer_5"),
      popular: true,
    },
    {
      id: 19,
      category: "products",
      question: t("faq_products_question_6"),
      answer: t("faq_products_answer_6"),
      popular: false,
    },

    {
      id: 20,
      category: "service",
      question: t("faq_service_question_1"),
      answer: t("faq_service_answer_1"),
      popular: true,
    },
    {
      id: 21,
      category: "service",
      question: t("faq_service_question_2"),
      answer: t("faq_service_answer_2"),
      popular: true,
    },
    {
      id: 22,
      category: "service",
      question: t("faq_service_question_3"),
      answer: t("faq_service_answer_3"),
      popular: false,
    },
    {
      id: 23,
      category: "service",
      question: t("faq_service_question_4"),
      answer: t("faq_service_answer_4"),
      popular: false,
    },

    {
      id: 24,
      category: "other",
      question: t("faq_other_question_1"),
      answer: t("faq_other_answer_1"),
      popular: true,
    },
    {
      id: 25,
      category: "other",
      question: t("faq_other_question_2"),
      answer: t("faq_other_answer_2"),
      popular: true,
    },
  ];

  const filteredItems =
    activeCategory === "all"
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setOpenQuestions(new Set());
  };

  const toggleQuestion = (questionId) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(questionId)) {
      newOpenQuestions.delete(questionId);
    } else {
      newOpenQuestions.add(questionId);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const openAllQuestions = () => {
    const allIds = filteredItems.map((item) => item.id);
    setOpenQuestions(new Set(allIds));
  };

  const closeAllQuestions = () => {
    setOpenQuestions(new Set());
  };

  const popularQuestions = faqItems.filter((item) => item.popular);

  return (
    <div className={scss.faqPage}>
      <div className="container">
        <div className={scss.breadcrumbs}>
          <Link to="/">{t("header_home")}</Link>
          <span> / </span>
          <span className={scss.current}>{t("faq_page_title")}</span>
        </div>

        <div className={scss.pageHeader}>
          <h1>{t("faq_page_title")}</h1>
          <p className={scss.subtitle}>{t("faq_page_subtitle")}</p>
        </div>

        <div className={scss.faqContent}>
          <aside className={scss.sidebar}>
            <div className={scss.categories}>
              <h3>{t("faq_categories_title")}</h3>
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`${scss.categoryBtn} ${
                        activeCategory === category.id ? scss.active : ""
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <span className={scss.categoryName}>{category.name}</span>
                      <span className={scss.categoryCount}>
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={scss.popularQuestions}>
              <h3>{t("faq_popular_questions")}</h3>
              <ul>
                {popularQuestions.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <button
                      className={scss.popularQuestion}
                      onClick={() => {
                        setActiveCategory(item.category);
                        setTimeout(() => toggleQuestion(item.id), 100);
                      }}
                    >
                      {item.question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={scss.supportCard}>
              <h3>{t("faq_support_title")}</h3>
              <p>{t("faq_support_description")}</p>
              <div className={scss.contacts}>
                <a href="tel:+996555123456" className={scss.phone}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92C11.61 20.92 3.08 12.39 3.08 3C3.08 2.45 3.53 2 4.08 2H7.08C7.63 2 8.08 2.45 8.08 3C8.08 5.85 8.99 8.53 10.6 10.77L9.23 12.14C7.25 10.19 6 7.88 6 5.34C6 4.79 6.45 4.34 7 4.34H10C10.55 4.34 11 4.79 11 5.34C11 9.46 13.54 12 17.66 12C18.21 12 18.66 12.45 18.66 13V16C18.66 16.55 18.21 17 17.66 17C15.12 17 12.81 15.75 10.86 13.77L12.23 12.4C14.47 14.01 17.15 14.92 20 14.92C20.55 14.92 21 15.37 21 15.92V19.92"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t("faq_phone")}
                </a>
                <a href="mailto:support@kubstore.kg" className={scss.email}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 6L12 13L2 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t("faq_email")}
                </a>
              </div>
              <button className={scss.contactBtn}>
                <Link to="/contact">{t("faq_contact_support")}</Link>
              </button>
            </div>
          </aside>

          <main className={scss.main}>
            <div className={scss.controls}>
              <div className={scss.results}>
                <span className={scss.count}>{filteredItems.length}</span>{" "}
                {t("faq_questions_count")}
              </div>
              <div className={scss.actions}>
                <button className={scss.actionBtn} onClick={openAllQuestions}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t("faq_open_all")}
                </button>
                <button className={scss.actionBtn} onClick={closeAllQuestions}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 15L12 9L6 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t("faq_close_all")}
                </button>
              </div>
            </div>

            <div className={scss.questionsList}>
              {filteredItems.length === 0 ? (
                <div className={scss.noResults}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="#CBD5E1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13"
                      stroke="#CBD5E1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 17H12.01"
                      stroke="#CBD5E1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h3>{t("faq_no_questions_title")}</h3>
                  <p>{t("faq_no_questions_description")}</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`${scss.questionItem} ${
                      openQuestions.has(item.id) ? scss.open : ""
                    }`}
                  >
                    <div
                      className={scss.questionHeader}
                      onClick={() => toggleQuestion(item.id)}
                    >
                      <div className={scss.questionContent}>
                        <h3 className={scss.questionTitle}>
                          {item.question}
                          {item.popular && (
                            <span className={scss.popularBadge}>
                              {t("faq_popular")}
                            </span>
                          )}
                        </h3>
                        <div className={scss.questionMeta}>
                          <span className={scss.categoryTag}>
                            {
                              categories.find((c) => c.id === item.category)
                                ?.name
                            }
                          </span>
                        </div>
                      </div>
                      <div className={scss.toggleIcon}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          {openQuestions.has(item.id) ? (
                            <path
                              d="M18 15L12 9L6 15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          ) : (
                            <path
                              d="M6 9L12 15L18 9"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}
                        </svg>
                      </div>
                    </div>

                    {openQuestions.has(item.id) && (
                      <div className={scss.answer}>
                        <div className={scss.answerContent}>
                          <p>{item.answer}</p>
                          <div className={scss.answerFooter}>
                            <span className={scss.helpfulText}>
                              {t("faq_helpful_question")}
                            </span>
                            <div className={scss.feedback}>
                              <button className={scss.feedbackBtn}>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M14 9V5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3L7 10V21H17.28C17.7623 21.0055 18.2304 20.8364 18.5979 20.524C18.9654 20.2116 19.2077 19.7769 19.28 19.3L20.66 10.3C20.7035 10.0134 20.6842 9.72068 20.6033 9.44225C20.5225 9.16382 20.3821 8.90629 20.1919 8.68751C20.0016 8.46873 19.7661 8.29393 19.5016 8.17522C19.2371 8.0565 18.9499 7.99672 18.66 8H14Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M7 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {t("faq_yes")}
                              </button>
                              <button className={scss.feedbackBtn}>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M10 15V19C10 19.5304 10.2107 20.0391 10.5858 20.4142C10.9609 20.7893 11.4696 21 12 21L17 14V3H6.72C6.2377 2.9945 5.7696 3.1636 5.4021 3.476C5.0346 3.7884 4.7923 4.2231 4.72 4.7L3.34 13.7C3.2965 13.9866 3.3158 14.2793 3.3967 14.5578C3.4775 14.8362 3.6179 15.0937 3.8081 15.3125C3.9984 15.5313 4.2339 15.7061 4.4984 15.8248C4.7629 15.9435 5.0501 16.0033 5.34 16H10Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M17 3H20C20.5304 3 21.0391 3.21071 21.4142 3.58579C21.7893 3.96086 22 4.46957 22 5V11C22 11.5304 21.7893 12.0391 21.4142 12.4142C21.0391 12.7893 20.5304 13 20 13H17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {t("faq_no")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className={scss.askQuestion}>
              <h2>{t("faq_ask_question_title")}</h2>
              <p>{t("faq_ask_question_description")}</p>

              <form className={scss.questionForm}>
                <div className={scss.formGrid}>
                  <div className={scss.formGroup}>
                    <label htmlFor="name">{t("faq_form_name")} *</label>
                    <input
                      type="text"
                      id="name"
                      placeholder={t("faq_form_name_placeholder")}
                      required
                    />
                  </div>
                  <div className={scss.formGroup}>
                    <label htmlFor="email">{t("faq_form_email")} *</label>
                    <input
                      type="email"
                      id="email"
                      placeholder={t("faq_form_email_placeholder")}
                      required
                    />
                  </div>
                  <div className={scss.formGroup}>
                    <label htmlFor="phone">{t("faq_form_phone")}</label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder={t("faq_form_phone_placeholder")}
                    />
                  </div>
                  <div className={scss.formGroup}>
                    <label htmlFor="category">{t("faq_form_category")} *</label>
                    <select id="category" required>
                      <option value="">
                        {t("faq_form_category_placeholder")}
                      </option>
                      {categories
                        .filter((c) => c.id !== "all")
                        .map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className={scss.formGroup}>
                  <label htmlFor="question">{t("faq_form_question")} *</label>
                  <textarea
                    id="question"
                    rows="4"
                    placeholder={t("faq_form_question_placeholder")}
                    required
                  />
                </div>

                <div className={scss.formFooter}>
                  <div className={scss.agreement}>
                    <input type="checkbox" id="agreement" required />
                    <label htmlFor="agreement">{t("faq_form_agreement")}</label>
                  </div>
                  <button type="submit" className={scss.submitBtn}>
                    {t("faq_form_submit")}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>

        <div className={scss.helpBanner}>
          <div className={scss.helpContent}>
            <h2>{t("faq_emergency_title")}</h2>
            <p>{t("faq_emergency_description")}</p>
            <div className={scss.helpContacts}>
              <a href="tel:+996555123456" className={scss.emergencyPhone}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92C11.61 20.92 3.08 12.39 3.08 3C3.08 2.45 3.53 2 4.08 2H7.08C7.63 2 8.08 2.45 8.08 3C8.08 5.85 8.99 8.53 10.6 10.77L9.23 12.14C7.25 10.19 6 7.88 6 5.34C6 4.79 6.45 4.34 7 4.34H10C10.55 4.34 11 4.79 11 5.34C11 9.46 13.54 12 17.66 12C18.21 12 18.66 12.45 18.66 13V16C18.66 16.55 18.21 17 17.66 17C15.12 17 12.81 15.75 10.86 13.77L12.23 12.4C14.47 14.01 17.15 14.92 20 14.92C20.55 14.92 21 15.37 21 15.92V19.92"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("faq_emergency_phone")}
              </a>
              <div className={scss.helpHours}>
                <span>{t("faq_emergency_hours_1")}</span>
                <span>{t("faq_emergency_hours_2")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
