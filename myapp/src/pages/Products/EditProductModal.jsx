import React, { useState, useEffect } from "react";
import { useProduct } from "../../MainContext/MainContext";
import { useTranslation } from "react-i18next";
import scss from "./EditProductModal.module.scss";

const EditProductModal = ({ product, onClose, onSuccess }) => {
  const { updateProduct, loading } = useProduct();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    brand: "",
    category: "",
    description: "",
    image: "",
    inStock: true,
    rating: 5,
    countInStock: 1,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        brand: product.brand || "",
        category: product.category || "",
        description: product.description || "",
        image: product.image || "",
        inStock: product.inStock !== undefined ? product.inStock : true,
        rating: product.rating || 5,
        countInStock: product.countInStock || 1,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim())
      newErrors.name = t("edit_product_modal_error_name");
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = t("edit_product_modal_error_price");
    if (!formData.category)
      newErrors.category = t("edit_product_modal_error_category");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        rating: parseInt(formData.rating) || 5,
        countInStock: parseInt(formData.countInStock) || 1,
      };

      await updateProduct(product.id, productData);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      alert(t("edit_product_modal_error_update"));
    }
  };

  const handleCancel = () => {
    if (window.confirm(t("edit_product_modal_confirm_cancel"))) {
      onClose();
    }
  };

  if (!product) return null;

  return (
    <div className={scss.modalOverlay}>
      <div className={scss.modal}>
        <div className={scss.modalHeader}>
          <h2>{t("edit_product_modal_title")}</h2>
          <button className={scss.closeButton} onClick={handleCancel}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={scss.form}>
          <div className={scss.formGrid}>
            <div className={scss.formGroup}>
              <label>{t("edit_product_modal_label_name")} *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? scss.errorInput : ""}
              />
              {errors.name && <span className={scss.error}>{errors.name}</span>}
            </div>

            <div className={scss.formGroup}>
              <label>{t("edit_product_modal_label_price")} ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={errors.price ? scss.errorInput : ""}
              />
              {errors.price && (
                <span className={scss.error}>{errors.price}</span>
              )}
            </div>

            <div className={scss.formGroup}>
              <label>{t("edit_product_modal_label_brand")}</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>

            <div className={scss.formGroup}>
              <label>{t("edit_product_modal_label_category")} *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? scss.errorInput : ""}
              >
                <option value="">
                  {t("edit_product_modal_select_category")}
                </option>
                <option value="Мотошлемы">
                  {t("categories_motorcycle_helmets")}
                </option>
                <option value="Мотоэкипировка">
                  {t("categories_motorcycle_gear")}
                </option>
                <option value="Моторасходники и З/Ч">
                  {t("categories_motorcycle_consumables")}
                </option>
                <option value="Моторезина">
                  {t("categories_motorcycle_tires")}
                </option>
                <option value="Тюнинг и Аксессуары">
                  {t("categories_tuning_accessories")}
                </option>
                <option value="Мотохимия">
                  {t("categories_motorcycle_chemicals")}
                </option>
                <option value="Уцененные товары">
                  {t("categories_discounted_goods")}
                </option>
                <option value="Зимняя экипировка">
                  {t("categories_winter_gear")}
                </option>
              </select>
              {errors.category && (
                <span className={scss.error}>{errors.category}</span>
              )}
            </div>

            <div className={scss.formGroupFull}>
              <label>{t("edit_product_modal_label_description")}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className={scss.formGroupFull}>
              <label>{t("edit_product_modal_label_image_url")}</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            <div className={scss.formGroup}>
              <label>{t("edit_product_modal_label_rating")}</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>

            <div className={scss.formGroup}>
              <label>{t("edit_product_modal_label_quantity")}</label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className={scss.checkboxGroup}>
              <label>
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                />
                {t("edit_product_modal_label_in_stock")}
              </label>
            </div>
          </div>

          <div className={scss.modalFooter}>
            <button
              type="button"
              onClick={handleCancel}
              className={scss.cancelButton}
              disabled={loading}
            >
              {t("edit_product_modal_button_cancel")}
            </button>
            <button
              type="submit"
              className={scss.saveButton}
              disabled={loading}
            >
              {loading
                ? t("edit_product_modal_button_saving")
                : t("edit_product_modal_button_save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
