import React, { useEffect, useState } from "react";
import { useProduct } from "../../MainContext/MainContext";
import { useAuth } from "../../MainContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import scss from "./Products.module.scss";

const Products = () => {
  const {
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    products,
    loading,
    error,
  } = useProduct();

  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!currentUser) {
      navigate("/admin-login");
    } else if (!isAdmin()) {
      navigate("/");
    }
  }, [currentUser, isAdmin, navigate]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [form, setForm] = useState({
    name: "",
    price: "",
    brand: "",
    category: "",
    description: "",
    image: "",

    inStock: true,
    rating: 5,
    countInStock: 1,
    discount: 0,

    color: "",
    size: "",
    weight: "",
    material: "",
    volume: "",
    viscosity: "",
    type: "",
    compatibility: "",
    season: "",
    diameter: "",
    teeth: "",
    links: "",
    standard: "",
    protection: "",
    waterproof: false,
    ventilation: false,
    resistance: "",
    voltage: "",
    capacity: "",
    length: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    getProducts();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      if (!form.name.trim()) {
        setFormError(t("products_admin_form_error_name"));
        return;
      }
      if (!form.price || parseFloat(form.price) <= 0) {
        setFormError(t("products_admin_form_error_price"));
        return;
      }
      if (!form.category) {
        setFormError(t("products_admin_form_error_category"));
        return;
      }

      const productData = {
        ...form,
        name: form.name.trim(),
        brand: form.brand.trim(),
        price: parseFloat(form.price) || 0,
        rating: parseInt(form.rating) || 5,
        countInStock: parseInt(form.countInStock) || 1,
        discount: parseFloat(form.discount) || 0,
        teeth: form.teeth ? parseInt(form.teeth) : undefined,
        links: form.links ? parseInt(form.links) : undefined,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.email || "admin",
      };

      Object.keys(productData).forEach((key) => {
        if (productData[key] === "" || productData[key] === undefined) {
          delete productData[key];
        }
      });

      await createProduct(productData);

      setForm({
        name: "",
        price: "",
        brand: "",
        category: "",
        description: "",
        image: "",
        inStock: true,
        rating: 5,
        countInStock: 1,
        discount: 0,
        color: "",
        size: "",
        weight: "",
        material: "",
        volume: "",
        viscosity: "",
        type: "",
        compatibility: "",
        season: "",
        diameter: "",
        teeth: "",
        links: "",
        standard: "",
        protection: "",
        waterproof: false,
        ventilation: false,
        resistance: "",
        voltage: "",
        capacity: "",
        length: "",
      });

      alert(t("products_admin_success_added"));
      setCurrentPage(1);
    } catch (error) {
      console.error("Error adding product:", error);
      setFormError(`${t("products_admin_error_add")}: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    if (formError) setFormError("");
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("products_admin_confirm_delete"))) {
      try {
        await deleteProduct(id);
        alert(t("products_admin_success_deleted"));

        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        alert(t("products_admin_error_delete"));
      }
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name || "",
      price: product.price || "",
      brand: product.brand || "",
      category: product.category || "",
      description: product.description || "",
      image: product.image || "",
      inStock: product.inStock !== undefined ? product.inStock : true,
      rating: product.rating || 5,
      countInStock: product.countInStock || 1,
      discount: product.discount || 0,
      color: product.color || "",
      size: product.size || "",
      weight: product.weight || "",
      material: product.material || "",
      volume: product.volume || "",
      viscosity: product.viscosity || "",
      type: product.type || "",
      compatibility: product.compatibility || "",
      season: product.season || "",
      diameter: product.diameter || "",
      teeth: product.teeth || "",
      links: product.links || "",
      standard: product.standard || "",
      protection: product.protection || "",
      waterproof: product.waterproof || false,
      ventilation: product.ventilation || false,
      resistance: product.resistance || "",
      voltage: product.voltage || "",
      capacity: product.capacity || "",
      length: product.length || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveEdit = async (id) => {
    try {
      if (!editForm.name.trim()) {
        alert(t("products_admin_form_error_name"));
        return;
      }
      if (!editForm.price || parseFloat(editForm.price) <= 0) {
        alert(t("products_admin_form_error_price"));
        return;
      }

      const productData = {
        ...editForm,
        name: editForm.name.trim(),
        brand: editForm.brand.trim(),
        price: parseFloat(editForm.price) || 0,
        rating: parseInt(editForm.rating) || 5,
        countInStock: parseInt(editForm.countInStock) || 1,
        discount: parseFloat(editForm.discount) || 0,
        teeth: editForm.teeth ? parseInt(editForm.teeth) : undefined,
        links: editForm.links ? parseInt(editForm.links) : undefined,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.email || "admin",
      };

      Object.keys(productData).forEach((key) => {
        if (productData[key] === "" || productData[key] === undefined) {
          delete productData[key];
        }
      });

      await updateProduct(id, productData);
      setEditingId(null);
      setEditForm({});
      alert(t("products_admin_success_updated"));
    } catch (error) {
      console.error("Update error:", error);
      alert(`${t("products_admin_error_update")}: ${error.message}`);
    }
  };

  const cancelEdit = () => {
    if (window.confirm(t("products_admin_confirm_cancel_edit"))) {
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleLogout = async () => {
    if (window.confirm(t("products_admin_confirm_logout"))) {
      try {
        await logout();
        navigate("/");
      } catch (error) {
        console.error("Logout error:", error);
        alert(t("products_admin_error_logout"));
      }
    }
  };

  const handleRefresh = () => {
    getProducts();
    setCurrentPage(1);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `products_${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const categories = [
    "Мотошлемы",
    "Мотоэкипировка",
    "Моторасходники и З/Ч",
    "Моторезина",
    "Тюнинг и Аксессуары",
    "Мотохимия",
    "Уцененные товары",
    "Зимняя экипировка",
  ];

  if (!currentUser) {
    return (
      <div className={scss.loading}>{t("products_admin_checking_auth")}</div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className={scss.accessDenied}>
        <h2>⛔ {t("products_admin_access_denied")}</h2>
        <p>{t("products_admin_no_permission")}</p>
        <button onClick={() => navigate("/")} className={scss.primaryButton}>
          {t("products_admin_go_home")}
        </button>
      </div>
    );
  }

  if (loading && !products.length) {
    return (
      <div className={scss.loading}>{t("products_admin_loading_products")}</div>
    );
  }

  if (error && !products.length) {
    return (
      <div className={scss.errorContainer}>
        <h2>{t("products_admin_error_loading")}</h2>
        <p>{error}</p>
        <button onClick={handleRefresh} className={scss.primaryButton}>
          {t("products_admin_try_again")}
        </button>
      </div>
    );
  }

  return (
    <div className={scss.container}>
      <div className={scss.adminHeader}>
        <div className={scss.adminInfo}>
          <h2>{t("products_admin_panel")}</h2>
          <div className={scss.userInfo}>
            <span className={scss.userEmail}>👤 {currentUser?.email}</span>
            <span className={scss.adminBadge}>
              🛡️ {t("products_admin_admin")}
            </span>
            <span className={scss.productCount}>
              📦 {t("products_admin_products_count")}: {products.length}
            </span>
          </div>
        </div>
        <div className={scss.adminActions}>
          <button
            onClick={handleRefresh}
            className={scss.refreshButton}
            title={t("products_admin_refresh_list")}
          >
            🔄 {t("products_admin_refresh")}
          </button>
          <button
            onClick={handleExport}
            className={scss.exportButton}
            title={t("products_admin_export_json")}
          >
            📥 {t("products_admin_export")}
          </button>
          <button onClick={() => navigate("/")} className={scss.homeButton}>
            🏠 {t("products_admin_to_site")}
          </button>
          <button onClick={handleLogout} className={scss.logoutButton}>
            🚪 {t("products_admin_logout")}
          </button>
        </div>
      </div>

      <div className={scss.formContainer}>
        <h2>➕ {t("products_admin_add_new_product")}</h2>
        {formError && <div className={scss.formError}>{formError}</div>}

        <form onSubmit={handleSubmit} className={scss.form}>
          <div className={scss.formSection}>
            <h3>{t("products_admin_basic_info")}</h3>
            <div className={scss.formGrid}>
              <div className={scss.formGroup}>
                <label>{t("products_admin_product_name")} </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder={t("products_admin_placeholder_name")}
                />
              </div>

              <div className={scss.formGroup}>
                <label>{t("products_admin_price_som")}</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="799.99"
                />
              </div>

              <div className={scss.formGroup}>
                <label>{t("products_admin_brand")} </label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                  placeholder="AGV"
                />
              </div>

              <div className={scss.formGroup}>
                <label>{t("products_admin_category")} </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    {t("products_admin_select_category")}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className={scss.formGroup}>
                <label>{t("products_admin_color")}</label>
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  placeholder={t("products_admin_placeholder_color")}
                />
              </div>

              <div className={scss.formGroup}>
                <label>{t("products_admin_size")}</label>
                <input
                  type="text"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  placeholder={t("products_admin_placeholder_size")}
                />
              </div>

              <div className={scss.formGroup}>
                <label>{t("products_admin_weight")}</label>
                <input
                  type="text"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="1350г"
                />
              </div>

              <div className={scss.formGroup}>
                <label>{t("products_admin_material")}</label>
                <input
                  type="text"
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  placeholder={t("products_admin_placeholder_material")}
                />
              </div>

              <div className={scss.formGroup}>
                <label>{t("products_admin_type")}</label>
                <input
                  type="text"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder={t("products_admin_placeholder_type")}
                />
              </div>

              <div className={scss.formGroup}>
                <label>{t("products_admin_volume")}</label>
                <input
                  type="text"
                  name="volume"
                  value={form.volume}
                  onChange={handleChange}
                  placeholder="4л, 500мл"
                />
              </div>

              <div className={scss.formGroup}>
                <label>{t("products_admin_season")}</label>
                <input
                  type="text"
                  name="season"
                  value={form.season}
                  onChange={handleChange}
                  placeholder={t("products_admin_placeholder_season")}
                />
              </div>

              <div className={scss.formGroup}>
                <label>{t("products_admin_diameter")}</label>
                <input
                  type="text"
                  name="diameter"
                  value={form.diameter}
                  onChange={handleChange}
                  placeholder="320мм"
                />
              </div>
            </div>
          </div>

          <div className={scss.formSection}>
            <h3>{t("products_admin_additional_info")}</h3>
            <div className={scss.formGrid}>
              <div className={scss.formGroupFull}>
                <label>{t("products_admin_description")}</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder={t("products_admin_placeholder_description")}
                />
              </div>

              <div className={scss.formGroupFull}>
                <label>{t("products_admin_image_url")}</label>
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                {form.image && (
                  <div className={scss.imagePreview}>
                    <img
                      src={form.image}
                      alt={t("products_admin_preview")}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={scss.formSection}>
            <h3>{t("products_admin_status_inventory")}</h3>
            <div className={scss.formGrid}>
              <div className={scss.formGroup}>
                <label>{t("products_admin_stock_quantity")}</label>
                <input
                  type="number"
                  name="countInStock"
                  value={form.countInStock}
                  onChange={handleChange}
                  min="0"
                  placeholder="10"
                />
              </div>

              <div className={scss.formGroup}>
                <label>{t("products_admin_rating_1_5")}</label>
                <select
                  name="rating"
                  value={form.rating}
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
                <label>{t("products_admin_discount_percent")}</label>
                <input
                  type="number"
                  name="discount"
                  value={form.discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="0"
                />
              </div>
              <div className={scss.formGroup}>
                <label>{t("products_admin_protection")}</label>
                <input
                  type="text"
                  name="protection"
                  value={form.protection}
                  onChange={handleChange}
                  placeholder="IP67"
                />
              </div>
            </div>

            <div className={scss.checkboxGroup}>
              <label className={scss.checkbox}>
                <input
                  type="checkbox"
                  name="inStock"
                  checked={form.inStock}
                  onChange={handleChange}
                />
                {t("products_admin_in_stock")}
              </label>
              <label className={scss.checkbox}>
                <input
                  type="checkbox"
                  name="waterproof"
                  checked={form.waterproof}
                  onChange={handleChange}
                />
                {t("products_admin_waterproof")}
              </label>
            </div>
          </div>

          <button type="submit" className={scss.submitButton}>
            📦 {t("products_admin_add_product")}
          </button>
        </form>
      </div>

      <div className={scss.productsContainer}>
        <div className={scss.productsHeader}>
          <h2>
            📋 {t("products_admin_products_list")} ({products.length})
          </h2>
          <div className={scss.productsStats}>
            <span>
              ✅ {t("products_admin_in_stock")}:{" "}
              {products.filter((p) => p.inStock).length}
            </span>
            <span>
              💰 {t("products_admin_with_discount")}:{" "}
              {products.filter((p) => p.discount > 0).length}
            </span>

            <div className={scss.paginationControl}>
              <label>
                {t("products_admin_items_per_page")}:
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className={scss.itemsPerPageSelect}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className={scss.paginationInfo}>
          {t("products_admin_showing_items")} {indexOfFirstItem + 1}–
          {Math.min(indexOfLastItem, products.length)} {t("products_admin_of")}{" "}
          {products.length}
          <span className={scss.pageInfo}>
            {t("products_admin_page")} {currentPage} {t("products_admin_of")}{" "}
            {totalPages}
          </span>
        </div>

        {currentItems.length === 0 ? (
          <div className={scss.empty}>
            <div className={scss.emptyIcon}>🛒</div>
            <h3>{t("products_admin_no_items_page")}</h3>
            <p>{t("products_admin_change_pagination")}</p>
          </div>
        ) : (
          <>
            <div className={scss.productsGrid}>
              {currentItems.map((item) => (
                <div key={item.id} className={scss.productCard}>
                  {editingId === item.id ? (
                    <div className={scss.editForm}>
                      <h3>✏️ {t("products_admin_editing_product")}</h3>

                      <div className={scss.editFormGrid}>
                        <div className={scss.formGroup}>
                          <label>{t("products_admin_product_name")}</label>
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            placeholder={t("products_admin_product_name")}
                          />
                        </div>

                        <div className={scss.formGroup}>
                          <label>{t("products_admin_price")} ($)</label>
                          <input
                            type="number"
                            name="price"
                            value={editForm.price}
                            onChange={handleEditChange}
                            step="0.01"
                            min="0"
                          />
                        </div>

                        <div className={scss.formGroup}>
                          <label>{t("products_admin_brand")}</label>
                          <input
                            type="text"
                            name="brand"
                            value={editForm.brand}
                            onChange={handleEditChange}
                            placeholder={t("products_admin_brand")}
                          />
                        </div>

                        <div className={scss.formGroup}>
                          <label>{t("products_admin_category")}</label>
                          <select
                            name="category"
                            value={editForm.category}
                            onChange={handleEditChange}
                          >
                            <option value="">
                              {t("products_admin_select_category")}
                            </option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className={scss.formGroup}>
                          <label>{t("products_admin_color")}</label>
                          <input
                            type="text"
                            name="color"
                            value={editForm.color}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className={scss.formGroup}>
                          <label>{t("products_admin_size")}</label>
                          <input
                            type="text"
                            name="size"
                            value={editForm.size}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className={scss.formGroup}>
                          <label>{t("products_admin_material")}</label>
                          <input
                            type="text"
                            name="material"
                            value={editForm.material}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className={scss.formGroup}>
                          <label>{t("products_admin_type")}</label>
                          <input
                            type="text"
                            name="type"
                            value={editForm.type}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className={scss.formGroup}>
                          <label>{t("products_admin_image_url")}</label>
                          <input
                            type="url"
                            name="image"
                            value={editForm.image}
                            onChange={handleEditChange}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>

                        <div className={scss.formGroup}>
                          <label>{t("products_admin_rating")}</label>
                          <select
                            name="rating"
                            value={editForm.rating}
                            onChange={handleEditChange}
                          >
                            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                            <option value="4">⭐⭐⭐⭐ (4)</option>
                            <option value="3">⭐⭐⭐ (3)</option>
                            <option value="2">⭐⭐ (2)</option>
                            <option value="1">⭐ (1)</option>
                          </select>
                        </div>

                        <div className={scss.formGroup}>
                          <label>{t("products_admin_quantity")}</label>
                          <input
                            type="number"
                            name="countInStock"
                            value={editForm.countInStock}
                            onChange={handleEditChange}
                            min="0"
                          />
                        </div>

                        <div className={scss.formGroup}>
                          <label>{t("products_admin_discount")} (%)</label>
                          <input
                            type="number"
                            name="discount"
                            value={editForm.discount}
                            onChange={handleEditChange}
                            min="0"
                            max="100"
                          />
                        </div>

                        <div className={scss.formGroup}>
                          <label>{t("products_admin_in_stock")}</label>
                          <select
                            name="inStock"
                            value={editForm.inStock}
                            onChange={handleEditChange}
                          >
                            <option value={true}>
                              {t("products_admin_yes")}
                            </option>
                            <option value={false}>
                              {t("products_admin_no")}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className={scss.formGroupFull}>
                        <label>{t("products_admin_description")}</label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          rows="3"
                        />
                      </div>

                      <div className={scss.editActions}>
                        <button
                          onClick={() => saveEdit(item.id)}
                          className={scss.saveButton}
                        >
                          💾 {t("products_admin_save_changes")}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className={scss.cancelButton}
                        >
                          ❌ {t("products_admin_cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={scss.productImage}>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%23f0f0f0"/><text x="100" y="75" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="%23999">' +
                                t("products_admin_no_image") +
                                "</text></svg>";
                            }}
                          />
                        ) : (
                          <div className={scss.noImage}>
                            <span>🛒</span>
                            <p>{t("products_admin_no_image")}</p>
                          </div>
                        )}
                        {item.discount > 0 && (
                          <div className={scss.discountBadge}>
                            -{item.discount}%
                          </div>
                        )}
                        {!item.inStock && (
                          <div className={scss.outOfStockBadge}>
                            {t("products_admin_out_of_stock")}
                          </div>
                        )}
                      </div>

                      <div className={scss.productInfo}>
                        <h3>{item.name}</h3>
                        <div className={scss.priceSection}>
                          <span className={scss.price}>${item.price}</span>
                          {item.discount > 0 && (
                            <span className={scss.originalPrice}>
                              $
                              {(
                                (item.price * 100) /
                                (100 - item.discount)
                              ).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className={scss.details}>
                          <p>
                            <strong>{t("products_admin_brand")}:</strong>{" "}
                            {item.brand || t("products_admin_not_specified")}
                          </p>
                          <p>
                            <strong>{t("products_admin_category")}:</strong>{" "}
                            {item.category}
                          </p>

                          {item.color && (
                            <p>
                              <strong>{t("products_admin_color")}:</strong>{" "}
                              {item.color}
                            </p>
                          )}
                          {item.size && (
                            <p>
                              <strong>{t("products_admin_size")}:</strong>{" "}
                              {item.size}
                            </p>
                          )}
                          {item.material && (
                            <p>
                              <strong>{t("products_admin_material")}:</strong>{" "}
                              {item.material}
                            </p>
                          )}
                          {item.type && (
                            <p>
                              <strong>{t("products_admin_type")}:</strong>{" "}
                              {item.type}
                            </p>
                          )}
                          {item.volume && (
                            <p>
                              <strong>{t("products_admin_volume")}:</strong>{" "}
                              {item.volume}
                            </p>
                          )}

                          <div className={scss.stockInfo}>
                            <p>
                              <strong>{t("products_admin_rating")}:</strong>{" "}
                              <span className={scss.rating}>
                                {"⭐".repeat(item.rating || 0)}
                              </span>
                            </p>
                            <p>
                              <strong>
                                {t("products_admin_availability")}:
                              </strong>
                              <span
                                className={
                                  item.inStock ? scss.inStock : scss.outOfStock
                                }
                              >
                                {item.inStock
                                  ? ` ✅ ${t("products_admin_in_stock")}`
                                  : ` ❌ ${t("products_admin_out_of_stock")}`}
                              </span>
                            </p>
                            <p>
                              <strong>{t("products_admin_in_stock")}:</strong>{" "}
                              {item.countInStock || 0}{" "}
                              {t("products_admin_pieces")}
                            </p>
                          </div>
                        </div>

                        {item.description && (
                          <div className={scss.description}>
                            <strong>{t("products_admin_description")}:</strong>
                            <p>
                              {item.description.length > 100
                                ? `${item.description.substring(0, 100)}...`
                                : item.description}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className={scss.productActions}>
                        <button
                          onClick={() => startEdit(item)}
                          className={scss.editButton}
                        >
                          ✏️ {t("products_admin_edit")}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className={scss.deleteButton}
                        >
                          🗑️ {t("products_admin_delete")}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={scss.pagination}>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={scss.paginationButton}
                >
                  ◀️ {t("products_admin_previous")}
                </button>

                <div className={scss.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => {
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            className={`${scss.pageButton} ${
                              pageNumber === currentPage ? scss.activePage : ""
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }

                      if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className={scss.pageDots}>
                            ...
                          </span>
                        );
                      }

                      return null;
                    },
                  )}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={scss.paginationButton}
                >
                  {t("products_admin_next")} ▶️
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <div className={scss.adminFooter}>
        <p>
          {t("products_admin_admin_panel")} •{" "}
          {t("products_admin_total_products")}: {products.length} •{" "}
          {t("products_admin_showing")}: {currentItems.length} •{" "}
          {t("products_admin_page")}: {currentPage}/{totalPages} •{" "}
          {new Date().toLocaleDateString()}
        </p>
        <p>
          {t("products_admin_support")}: admin@motoshop.com •{" "}
          {t("products_admin_phone")}: +7 (999) 123-45-67
        </p>
      </div>
    </div>
  );
};

export default Products;
