import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../MainContext/AuthContext";
import styles from "./Profile.module.scss";
import { useTranslation } from "react-i18next";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaShoppingCart,
  FaHeart,
  FaSignOutAlt,
  FaShieldAlt,
  FaBell,
  FaBox,
  FaStar,
  FaTruck,
  FaLock,
  FaTrash,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaKey,
  FaUserShield,
  FaReceipt,
  FaUsers,
  FaChartBar,
  FaCog,
  FaFileInvoice,
  FaClipboardCheck,
  FaChartPie,
  FaTachometerAlt,
  FaEye,
  FaPlus,
  FaSearch,
  FaFilter,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const Profile = () => {
  const { currentUser, userData, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [adminStats, setAdminStats] = useState({
    totalUsers: 157,
    totalOrders: 423,
    totalRevenue: 2854000,
    pendingOrders: 23,
    lowStockProducts: 12,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminFilter, setAdminFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    if (currentUser && userData) {
      setFormData({
        name: userData.name || currentUser?.displayName || "",
        email: userData.email || currentUser?.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        postalCode: userData.postalCode || "",
      });

      loadOrders();
      loadFavorites();
      loadNotifications();

      if (isAdmin()) {
        loadAdminData();
      }
    }
  }, [userData, currentUser, isAdmin]);

  const loadOrders = () => {
    try {
      const ordersData = JSON.parse(localStorage.getItem("orders")) || [];
      const ordersWithStatus = ordersData.map((order, index) => ({
        ...order,
        id: order.id || `order_${index}`,
        orderNumber: `ORD-${Date.now()}-${index}`,
        date: new Date(Date.now() - index * 86400000).toISOString(),
        status:
          index % 4 === 0
            ? "delivered"
            : index % 3 === 0
              ? "shipped"
              : index % 2 === 0
                ? "processing"
                : "pending",
        total: order.price ? Number(order.price) * (order.quantity || 1) : 0,
        items: [order],
      }));
      setOrders(ordersWithStatus.slice(0, 5));
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    }
  };

  const loadFavorites = () => {
    try {
      const favoritesData = JSON.parse(localStorage.getItem("favorit")) || [];
      setFavorites(favoritesData.slice(0, 8));
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavorites([]);
    }
  };

  const loadNotifications = () => {
    const demoNotifications = [
      {
        id: 1,
        title: t("profile.notifications.orderShipped"),
        message: t("profile.notifications.orderShippedMessage", {
          orderNumber: "#ORD-12345",
        }),
        date: new Date(Date.now() - 86400000).toISOString(),
        read: false,
        type: "order",
        icon: <FaTruck />,
      },
      {
        id: 2,
        title: t("profile.notifications.helmetSale"),
        message: t("profile.notifications.helmetSaleMessage"),
        date: new Date(Date.now() - 172800000).toISOString(),
        read: true,
        type: "promo",
        icon: <FaStar />,
      },
      {
        id: 3,
        title: t("profile.notifications.passwordChanged"),
        message: t("profile.notifications.passwordChangedMessage"),
        date: new Date(Date.now() - 259200000).toISOString(),
        read: true,
        type: "security",
        icon: <FaKey />,
      },
    ];
    setNotifications(demoNotifications);
  };

  const loadAdminData = async () => {
    try {
      setRecentUsers([
        {
          id: 1,
          name: t("profile.admin.users.user1.name"),
          email: "alex@mail.com",
          joinDate: "2024-01-15",
          orders: 5,
          status: "active",
        },
        {
          id: 2,
          name: t("profile.admin.users.user2.name"),
          email: "maria@mail.com",
          joinDate: "2024-01-14",
          orders: 2,
          status: "active",
        },
        {
          id: 3,
          name: t("profile.admin.users.user3.name"),
          email: "dmitry@mail.com",
          joinDate: "2024-01-13",
          orders: 8,
          status: "active",
        },
        {
          id: 4,
          name: t("profile.admin.users.user4.name"),
          email: "ekaterina@mail.com",
          joinDate: "2024-01-12",
          orders: 1,
          status: "inactive",
        },
        {
          id: 5,
          name: t("profile.admin.users.user5.name"),
          email: "ivan@mail.com",
          joinDate: "2024-01-11",
          orders: 3,
          status: "active",
        },
      ]);

      setRecentOrders([
        {
          id: 1,
          orderNumber: "ORD-001",
          customer: t("profile.admin.users.user1.name"),
          amount: 45000,
          status: "processing",
          date: "2024-01-15",
        },
        {
          id: 2,
          orderNumber: "ORD-002",
          customer: t("profile.admin.users.user2.name"),
          amount: 28900,
          status: "shipped",
          date: "2024-01-15",
        },
        {
          id: 3,
          orderNumber: "ORD-003",
          customer: t("profile.admin.users.user3.name"),
          amount: 125000,
          status: "pending",
          date: "2024-01-14",
        },
        {
          id: 4,
          orderNumber: "ORD-004",
          customer: t("profile.admin.users.user4.name"),
          amount: 56000,
          status: "delivered",
          date: "2024-01-14",
        },
        {
          id: 5,
          orderNumber: "ORD-005",
          customer: t("profile.admin.users.user5.name"),
          amount: 78000,
          status: "processing",
          date: "2024-01-13",
        },
      ]);
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditing(false);
      alert(t("profile.profileUpdated"));
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(t("profile.profileUpdateError"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t("profile.deleteAccountConfirm"))) {
      logout();
      navigate("/");
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favorites.filter((item) => item.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorit", JSON.stringify(updatedFavorites));
  };

  const handleAdminSearch = (e) => {
    setAdminSearch(e.target.value);
  };

  const handleAdminFilter = (e) => {
    setAdminFilter(e.target.value);
  };

  const handleExportData = () => {
    alert(t("profile.admin.exportStarted"));
  };

  const getOrderStatusInfo = (status) => {
    const statuses = {
      pending: {
        text: t("profile.orderStatus.pending"),
        color: "#F5A623",
        icon: <FaExclamationTriangle />,
        bgColor: "#FFF9E6",
      },
      processing: {
        text: t("profile.orderStatus.processing"),
        color: "#4A90E2",
        icon: <FaBox />,
        bgColor: "#E8F4FF",
      },
      shipped: {
        text: t("profile.orderStatus.shipped"),
        color: "#50E3C2",
        icon: <FaTruck />,
        bgColor: "#E6FFF9",
      },
      delivered: {
        text: t("profile.orderStatus.delivered"),
        color: "#7ED321",
        icon: <FaCheckCircle />,
        bgColor: "#F0FFE6",
      },
      cancelled: {
        text: t("profile.orderStatus.cancelled"),
        color: "#FF3860",
        icon: <FaTimes />,
        bgColor: "#FFE6E6",
      },
    };
    return statuses[status] || statuses.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return (
      new Intl.NumberFormat("ru-RU").format(amount) +
      " " +
      t("profile.currency")
    );
  };

  if (!currentUser) {
    return (
      <div className={styles.notLoggedInContainer}>
        <div className="container">
          <div className={styles.breadcrumbs}>
            <Link to="/">{t("profile.breadcrumbs.home")}</Link>
            <span className={styles.divider}>/</span>
            <span className={styles.current}>
              {t("profile.breadcrumbs.profile")}
            </span>
          </div>

          <div className={styles.notLoggedInContent}>
            <div className={styles.authCard}>
              <div className={styles.authIcon}>
                <FaUser />
              </div>

              <h2 className={styles.authTitle}>
                {t("profile.auth.accessTitle")}
              </h2>

              <p className={styles.authDescription}>
                {t("profile.auth.description")}
              </p>

              <div className={styles.authButtons}>
                <Link to="/login" className={styles.loginButton}>
                  <FaSignInAlt /> {t("profile.auth.login")}
                </Link>

                <Link to="/register" className={styles.registerButton}>
                  <FaUserPlus /> {t("profile.auth.register")}
                </Link>
              </div>

              <div className={styles.authBenefits}>
                <h3>{t("profile.auth.benefitsTitle")}</h3>
                <div className={styles.benefitsGrid}>
                  <div className={styles.benefitItem}>
                    <FaShoppingCart className={styles.benefitIcon} />
                    <h4>{t("profile.auth.benefit1.title")}</h4>
                    <p>{t("profile.auth.benefit1.description")}</p>
                  </div>

                  <div className={styles.benefitItem}>
                    <FaHeart className={styles.benefitIcon} />
                    <h4>{t("profile.auth.benefit2.title")}</h4>
                    <p>{t("profile.auth.benefit2.description")}</p>
                  </div>

                  <div className={styles.benefitItem}>
                    <FaBell className={styles.benefitIcon} />
                    <h4>{t("profile.auth.benefit3.title")}</h4>
                    <p>{t("profile.auth.benefit3.description")}</p>
                  </div>

                  <div className={styles.benefitItem}>
                    <FaShieldAlt className={styles.benefitIcon} />
                    <h4>{t("profile.auth.benefit4.title")}</h4>
                    <p>{t("profile.auth.benefit4.description")}</p>
                  </div>
                </div>
              </div>

              <div className={styles.authFooter}>
                <p>
                  {t("profile.auth.noAccount")}{" "}
                  <Link to="/register" className={styles.footerLink}>
                    {t("profile.auth.registerNow")}
                  </Link>
                </p>
                <p>
                  {t("profile.auth.adminQuestion")}{" "}
                  <Link to="/login" className={styles.footerLink}>
                    {t("profile.auth.adminLogin")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userIsAdmin = isAdmin();

  return (
    <div className={styles.profilePage}>
      <div className="container">
        <div className={styles.breadcrumbs}>
          <Link to="/">{t("profile.breadcrumbs.home")}</Link>
          <span className={styles.divider}>/</span>
          <span className={styles.current}>
            {userIsAdmin
              ? t("profile.breadcrumbs.adminPanel")
              : t("profile.breadcrumbs.profile")}
          </span>
        </div>

        <div className={styles.profileLayout}>
          <aside className={styles.sidebar}>
            <div className={styles.userCard}>
              <div className={styles.avatar}>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={t("profile.avatarAlt")}
                  />
                ) : (
                  <div
                    className={`${styles.avatarPlaceholder} ${
                      userIsAdmin ? styles.adminAvatar : ""
                    }`}
                  >
                    {userIsAdmin ? <FaUserShield /> : <FaUser />}
                  </div>
                )}
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>
                  {formData.name ||
                    currentUser.displayName ||
                    t("profile.defaultUserName")}
                </h3>
                <p className={styles.userEmail}>{currentUser.email}</p>
                {userIsAdmin && (
                  <span className={styles.adminBadge}>
                    <FaUserShield /> {t("profile.adminBadge")}
                  </span>
                )}
              </div>
            </div>

            <nav className={styles.navMenu}>
              <button
                className={`${styles.navItem} ${
                  activeTab === "profile" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <FaUser /> {t("profile.tabs.personalData")}
              </button>

              {!userIsAdmin && (
                <>
                  <button
                    className={`${styles.navItem} ${
                      activeTab === "orders" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("orders")}
                  >
                    <FaShoppingCart /> {t("profile.tabs.myOrders")}
                    {orders.length > 0 && (
                      <span className={styles.navBadge}>{orders.length}</span>
                    )}
                  </button>

                  <button
                    className={`${styles.navItem} ${
                      activeTab === "favorites" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("favorites")}
                  >
                    <FaHeart /> {t("profile.tabs.favorites")}
                    {favorites.length > 0 && (
                      <span className={styles.navBadge}>
                        {favorites.length}
                      </span>
                    )}
                  </button>
                </>
              )}

              <button
                className={`${styles.navItem} ${
                  activeTab === "security" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("security")}
              >
                <FaLock /> {t("profile.tabs.security")}
              </button>

              {userIsAdmin && (
                <>
                  <div className={styles.navDivider}></div>
                  <div className={styles.navSectionLabel}>
                    {t("profile.tabs.adminPanel")}
                  </div>

                  <Link to="/products">
                    <button
                      className={`${styles.navItem} ${
                        activeTab === "admin-users" ? styles.active : ""
                      }`}
                    >
                      <FaUsers /> {t("profile.tabs.adminAddProduct")}
                    </button>
                  </Link>

                  <button
                    className={`${styles.navItem} ${
                      activeTab === "admin-analytics" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("admin-analytics")}
                  >
                    <FaChartPie /> {t("profile.tabs.adminAnalytics")}
                  </button>

                  <button
                    className={`${styles.navItem} ${
                      activeTab === "admin-settings" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("admin-settings")}
                  >
                    <FaCog /> {t("profile.tabs.adminSettings")}
                  </button>
                </>
              )}

              <div className={styles.navDivider}></div>

              <button
                className={`${styles.navItem} ${styles.logout}`}
                onClick={handleLogout}
              >
                <FaSignOutAlt /> {t("profile.tabs.logout")}
              </button>
            </nav>
          </aside>

          <main className={styles.mainContent}>
            <div className={styles.contentHeader}>
              <h1 className={styles.pageTitle}>
                {activeTab === "profile" && t("profile.tabs.personalData")}
                {activeTab === "orders" && t("profile.tabs.myOrders")}
                {activeTab === "favorites" && t("profile.tabs.favorites")}
                {activeTab === "security" && t("profile.tabs.security")}
                {activeTab === "admin-dashboard" &&
                  t("profile.admin.tabs.dashboard")}
                {activeTab === "admin-orders" &&
                  t("profile.admin.tabs.orderManagement")}
                {activeTab === "admin-products" &&
                  t("profile.admin.tabs.productManagement")}
                {activeTab === "admin-users" &&
                  t("profile.admin.tabs.userManagement")}
                {activeTab === "admin-analytics" &&
                  t("profile.admin.tabs.analytics")}
                {activeTab === "admin-settings" &&
                  t("profile.admin.tabs.storeSettings")}
              </h1>

              {activeTab === "profile" && (
                <div className={styles.headerActions}>
                  {!isEditing ? (
                    <button
                      className={styles.editButton}
                      onClick={() => setIsEditing(true)}
                    >
                      <FaEdit /> {t("profile.buttons.edit")}
                    </button>
                  ) : (
                    <>
                      <button
                        className={styles.saveButton}
                        onClick={handleSaveProfile}
                        disabled={loading}
                      >
                        <FaSave />{" "}
                        {loading
                          ? t("profile.buttons.saving")
                          : t("profile.buttons.save")}
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={() => {
                          setIsEditing(false);
                          if (userData) {
                            setFormData({
                              name:
                                userData.name || currentUser?.displayName || "",
                              email: userData.email || currentUser?.email || "",
                              phone: userData.phone || "",
                              address: userData.address || "",
                              city: userData.city || "",
                              postalCode: userData.postalCode || "",
                            });
                          }
                        }}
                      >
                        <FaTimes /> {t("profile.buttons.cancel")}
                      </button>
                    </>
                  )}
                </div>
              )}

              {activeTab === "admin-orders" && (
                <div className={styles.headerActions}>
                  <button
                    className={styles.adminButton}
                    onClick={handleExportData}
                  >
                    <FaDownload /> {t("profile.admin.buttons.exportOrders")}
                  </button>
                  <Link
                    to="/admin/orders/new"
                    className={styles.adminButtonPrimary}
                  >
                    <FaPlus /> {t("profile.admin.buttons.newOrder")}
                  </Link>
                </div>
              )}

              {activeTab === "admin-products" && (
                <div className={styles.headerActions}>
                  <Link
                    to="/admin/products/new"
                    className={styles.adminButtonPrimary}
                  >
                    <FaPlus /> {t("profile.admin.buttons.addProduct")}
                  </Link>
                </div>
              )}

              {activeTab === "admin-users" && (
                <div className={styles.headerActions}>
                  <button className={styles.adminButton}>
                    <FaUsers /> {t("profile.admin.buttons.exportUsers")}
                  </button>
                  <Link
                    to="/admin/users/invite"
                    className={styles.adminButtonPrimary}
                  >
                    <FaPlus /> {t("profile.admin.buttons.inviteUser")}
                  </Link>
                </div>
              )}
            </div>

            <div className={styles.contentArea}>
              {activeTab === "profile" && (
                <div className={styles.profileForm}>
                  <form onSubmit={handleSaveProfile}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <FaUser /> {t("profile.form.name")}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            required
                          />
                        ) : (
                          <div className={styles.formValue}>
                            {formData.name || t("profile.form.notSpecified")}
                          </div>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <FaEnvelope /> {t("profile.form.email")}
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            required
                            disabled
                          />
                        ) : (
                          <div className={styles.formValue}>
                            {formData.email}
                          </div>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <FaPhone /> {t("profile.form.phone")}
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            placeholder={t("profile.form.phonePlaceholder")}
                          />
                        ) : (
                          <div className={styles.formValue}>
                            {formData.phone || t("profile.form.notSpecified")}
                          </div>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <FaMapMarkerAlt /> {t("profile.form.city")}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            placeholder={t("profile.form.cityPlaceholder")}
                          />
                        ) : (
                          <div className={styles.formValue}>
                            {formData.city || t("profile.form.notSpecified")}
                          </div>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <FaMapMarkerAlt /> {t("profile.form.address")}
                        </label>
                        {isEditing ? (
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className={styles.formTextarea}
                            placeholder={t("profile.form.addressPlaceholder")}
                            rows="3"
                          />
                        ) : (
                          <div className={styles.formValue}>
                            {formData.address || t("profile.form.notSpecified")}
                          </div>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <FaMapMarkerAlt /> {t("profile.form.postalCode")}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            placeholder={t(
                              "profile.form.postalCodePlaceholder",
                            )}
                          />
                        ) : (
                          <div className={styles.formValue}>
                            {formData.postalCode ||
                              t("profile.form.notSpecified")}
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className={styles.formActions}>
                        <button
                          type="submit"
                          className={styles.saveButton}
                          disabled={loading}
                        >
                          <FaSave />{" "}
                          {loading
                            ? t("profile.buttons.saving")
                            : t("profile.buttons.saveChanges")}
                        </button>
                      </div>
                    )}
                  </form>

                  <div className={styles.accountInfo}>
                    <h3>{t("profile.accountInfo.title")}</h3>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>
                          {t("profile.accountInfo.userId")}:
                        </span>
                        <span className={styles.infoValue}>
                          {currentUser.uid?.substring(0, 8) || "N/A"}...
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>
                          {t("profile.accountInfo.registrationDate")}:
                        </span>
                        <span className={styles.infoValue}>
                          {userData?.createdAt
                            ? formatDate(userData.createdAt)
                            : formatDate(new Date().toISOString())}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>
                          {t("profile.accountInfo.lastLogin")}:
                        </span>
                        <span className={styles.infoValue}>
                          {formatDateTime(new Date().toISOString())}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>
                          {t("profile.accountInfo.role")}:
                        </span>
                        <span className={styles.infoValue}>
                          {userIsAdmin
                            ? t("profile.accountInfo.admin")
                            : t("profile.accountInfo.user")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "orders" && !userIsAdmin && (
                <div className={styles.ordersSection}>
                  {orders.length === 0 ? (
                    <div className={styles.emptyState}>
                      <FaShoppingCart className={styles.emptyIcon} />
                      <h3>{t("profile.orders.empty.title")}</h3>
                      <p>{t("profile.orders.empty.description")}</p>
                      <Link to="/catalog" className={styles.actionButton}>
                        {t("profile.orders.empty.goToCatalog")}
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className={styles.ordersList}>
                        {orders.map((order) => {
                          const statusInfo = getOrderStatusInfo(order.status);
                          return (
                            <div key={order.id} className={styles.orderCard}>
                              <div className={styles.orderHeader}>
                                <div className={styles.orderInfo}>
                                  <h4 className={styles.orderNumber}>
                                    <FaReceipt /> {t("profile.orders.order")} #
                                    {order.orderNumber}
                                  </h4>
                                  <span className={styles.orderDate}>
                                    <FaCalendarAlt /> {formatDate(order.date)}
                                  </span>
                                </div>
                                <div
                                  className={styles.orderStatus}
                                  style={{
                                    color: statusInfo.color,
                                    backgroundColor: statusInfo.bgColor,
                                  }}
                                >
                                  {statusInfo.icon} {statusInfo.text}
                                </div>
                              </div>

                              <div className={styles.orderItems}>
                                {order.items?.map((item, index) => (
                                  <div key={index} className={styles.orderItem}>
                                    <img
                                      src={
                                        item.image ||
                                        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100"
                                      }
                                      alt={item.name}
                                      className={styles.itemImage}
                                    />
                                    <div className={styles.itemInfo}>
                                      <h5 className={styles.itemName}>
                                        {item.name || item.title}
                                      </h5>
                                      <div className={styles.itemDetails}>
                                        <span className={styles.itemBrand}>
                                          {item.brand}
                                        </span>
                                        <span className={styles.itemQuantity}>
                                          {t("profile.orders.quantity")}:{" "}
                                          {item.quantity || 1}
                                        </span>
                                      </div>
                                    </div>
                                    <div className={styles.itemPrice}>
                                      {item.price?.toLocaleString("ru-RU")}{" "}
                                      {t("profile.currency")}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className={styles.orderFooter}>
                                <div className={styles.orderTotal}>
                                  {t("profile.orders.total")}:{" "}
                                  <strong>
                                    {order.total?.toLocaleString("ru-RU")}{" "}
                                    {t("profile.currency")}
                                  </strong>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className={styles.ordersFooter}>
                        <Link to="/card" className={styles.viewAllButton}>
                          <FaShoppingCart /> {t("profile.orders.goToCart")}
                        </Link>
                        <Link to="/catalog" className={styles.continueShopping}>
                          {t("profile.orders.continueShopping")}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
              {activeTab === "favorites" && !userIsAdmin && (
                <div className={styles.favoritesSection}>
                  {favorites.length === 0 ? (
                    <div className={styles.emptyState}>
                      <FaHeart className={styles.emptyIcon} />
                      <h3>{t("profile.favorites.empty.title")}</h3>
                      <p>{t("profile.favorites.empty.description")}</p>
                      <Link to="/catalog" className={styles.actionButton}>
                        {t("profile.favorites.empty.goToCatalog")}
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className={styles.favoritesGrid}>
                        {favorites.map((item) => (
                          <div key={item.id} className={styles.favoriteCard}>
                            <div className={styles.favoriteImage}>
                              <img
                                src={
                                  item.image ||
                                  "https://images.unsplash.com/photo-1558981806-ec527fa84c39"
                                }
                                alt={item.name}
                              />
                              <button
                                className={styles.removeFavorite}
                                onClick={() => handleRemoveFavorite(item.id)}
                              >
                                <FaTimes />
                              </button>
                            </div>
                            <div className={styles.favoriteContent}>
                              <h4 className={styles.favoriteName}>
                                <Link to={`/product/${item.id}`}>
                                  {item.name || item.title}
                                </Link>
                              </h4>
                              <div className={styles.favoriteMeta}>
                                <span className={styles.favoriteBrand}>
                                  {item.brand}
                                </span>
                                <span className={styles.favoriteCategory}>
                                  {item.category}
                                </span>
                              </div>
                              <div className={styles.favoritePrice}>
                                {item.price?.toLocaleString("ru-RU")}{" "}
                                {t("profile.currency")}
                              </div>
                              <div className={styles.favoriteActions}>
                                <button className={styles.addToCartButton}>
                                  <FaShoppingCart />{" "}
                                  {t("profile.favorites.addToCart")}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className={styles.favoritesFooter}>
                        <button
                          className={styles.clearFavorites}
                          onClick={() => {
                            if (
                              window.confirm(
                                t("profile.favorites.clearConfirm"),
                              )
                            ) {
                              setFavorites([]);
                              localStorage.setItem("favorit", "[]");
                            }
                          }}
                        >
                          <FaTrash /> {t("profile.favorites.clearAll")}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
              {activeTab === "notifications" && (
                <div className={styles.notificationsSection}>
                  <div className={styles.notificationsHeader}>
                    <h3>{t("profile.notifications.title")}</h3>
                    <button
                      className={styles.markAllRead}
                      onClick={handleMarkAllNotificationsRead}
                    >
                      {t("profile.notifications.markAllRead")}
                    </button>
                  </div>

                  <div className={styles.notificationsList}>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`${styles.notificationItem} ${
                          !notification.read ? styles.unread : ""
                        }`}
                      >
                        <div className={styles.notificationIcon}>
                          {notification.icon}
                        </div>
                        <div className={styles.notificationContent}>
                          <h4 className={styles.notificationTitle}>
                            {notification.title}
                          </h4>
                          <p className={styles.notificationMessage}>
                            {notification.message}
                          </p>
                          <span className={styles.notificationDate}>
                            {formatDateTime(notification.date)}
                          </span>
                        </div>
                        {!notification.read && (
                          <div className={styles.unreadIndicator}></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={styles.notificationSettings}>
                    <h3>{t("profile.notifications.settings")}</h3>
                    <div className={styles.settingsGrid}>
                      <label className={styles.settingItem}>
                        <input type="checkbox" defaultChecked />
                        <span>
                          {t("profile.notifications.orderNotifications")}
                        </span>
                      </label>
                      <label className={styles.settingItem}>
                        <input type="checkbox" defaultChecked />
                        <span>{t("profile.notifications.promotions")}</span>
                      </label>
                      <label className={styles.settingItem}>
                        <input type="checkbox" defaultChecked />
                        <span>
                          {t("profile.notifications.securityNotifications")}
                        </span>
                      </label>
                      <label className={styles.settingItem}>
                        <input type="checkbox" />
                        <span>{t("profile.notifications.storeNews")}</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "security" && (
                <div className={styles.securitySection}>
                  <div className={styles.securityCard}>
                    <h3>
                      <FaLock /> {t("profile.security.changePassword")}
                    </h3>
                    <form className={styles.securityForm}>
                      <div className={styles.formGroup}>
                        <label>{t("profile.security.currentPassword")}</label>
                        <input
                          type="password"
                          className={styles.formInput}
                          placeholder={t(
                            "profile.security.currentPasswordPlaceholder",
                          )}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>{t("profile.security.newPassword")}</label>
                        <input
                          type="password"
                          className={styles.formInput}
                          placeholder={t(
                            "profile.security.newPasswordPlaceholder",
                          )}
                          minLength="6"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>{t("profile.security.repeatPassword")}</label>
                        <input
                          type="password"
                          className={styles.formInput}
                          placeholder={t(
                            "profile.security.repeatPasswordPlaceholder",
                          )}
                          minLength="6"
                        />
                      </div>
                      <button type="submit" className={styles.securityButton}>
                        <FaLock /> {t("profile.security.changePasswordButton")}
                      </button>
                    </form>
                  </div>

                  <div className={styles.securityCard}>
                    <h3>
                      <FaShieldAlt /> {t("profile.security.activeSessions")}
                    </h3>
                    <div className={styles.sessionsList}>
                      <div className={styles.sessionItem}>
                        <div className={styles.sessionInfo}>
                          <h4>{t("profile.security.currentDevice")}</h4>
                          <p>
                            {t("profile.security.currentDeviceDescription")}
                          </p>
                          <span className={styles.sessionTime}>
                            {t("profile.security.activeNow")}
                          </span>
                        </div>
                        <div className={styles.sessionStatus}>
                          <FaCheckCircle style={{ color: "#7ED321" }} />
                        </div>
                      </div>
                      <div className={styles.sessionItem}>
                        <div className={styles.sessionInfo}>
                          <h4>{t("profile.security.mobileDevice")}</h4>
                          <p>{t("profile.security.mobileDeviceDescription")}</p>
                          <span className={styles.sessionTime}>
                            {t("profile.security.daysAgo", { days: 2 })}
                          </span>
                        </div>
                        <button className={styles.sessionButton}>
                          {t("profile.security.endSession")}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.securityCard}>
                    <h3>
                      <FaKey /> {t("profile.security.twoFactor")}
                    </h3>
                    <div className={styles.twoFactor}>
                      <div className={styles.twoFactorInfo}>
                        <p>{t("profile.security.twoFactorDescription")}</p>
                        <span className={styles.twoFactorStatus}>
                          {t("profile.security.notConnected")}
                        </span>
                      </div>
                      <button className={styles.twoFactorButton}>
                        {t("profile.security.connect")}
                      </button>
                    </div>
                  </div>

                  <div className={styles.dangerZone}>
                    <h3>
                      <FaExclamationTriangle />{" "}
                      {t("profile.security.dangerZone")}
                    </h3>
                    <div className={styles.dangerActions}>
                      <button
                        className={styles.deleteButton}
                        onClick={handleDeleteAccount}
                      >
                        <FaTrash /> {t("profile.security.deleteAccount")}
                      </button>
                      <p className={styles.dangerWarning}>
                        {t("profile.security.deleteWarning")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {userIsAdmin && (
                <>
                  {activeTab === "admin-dashboard" && (
                    <div className={styles.adminDashboard}>
                      <div className={styles.statsGrid}>
                        <div
                          className={`${styles.statCard} ${styles.statCardPrimary}`}
                        >
                          <div className={styles.statIcon}>
                            <FaUsers />
                          </div>
                          <div className={styles.statContent}>
                            <h3>{adminStats.totalUsers}</h3>
                            <p>{t("profile.admin.stats.totalUsers")}</p>
                          </div>
                        </div>

                        <div
                          className={`${styles.statCard} ${styles.statCardSuccess}`}
                        >
                          <div className={styles.statIcon}>
                            <FaShoppingCart />
                          </div>
                          <div className={styles.statContent}>
                            <h3>{adminStats.totalOrders}</h3>
                            <p>{t("profile.admin.stats.totalOrders")}</p>
                          </div>
                        </div>

                        <div
                          className={`${styles.statCard} ${styles.statCardWarning}`}
                        >
                          <div className={styles.statIcon}>
                            <FaReceipt />
                          </div>
                          <div className={styles.statContent}>
                            <h3>{formatCurrency(adminStats.totalRevenue)}</h3>
                            <p>{t("profile.admin.stats.totalRevenue")}</p>
                          </div>
                        </div>

                        <div
                          className={`${styles.statCard} ${styles.statCardDanger}`}
                        >
                          <div className={styles.statIcon}>
                            <FaExclamationTriangle />
                          </div>
                          <div className={styles.statContent}>
                            <h3>{adminStats.pendingOrders}</h3>
                            <p>{t("profile.admin.stats.pendingOrders")}</p>
                          </div>
                        </div>
                      </div>

                      <div className={styles.dashboardContent}>
                        <div className={styles.dashboardSection}>
                          <div className={styles.sectionHeader}>
                            <h3>{t("profile.admin.recentOrders")}</h3>
                            <Link
                              to="/admin/orders"
                              className={styles.viewAllLink}
                            >
                              {t("profile.admin.allOrders")} →
                            </Link>
                          </div>
                          <div className={styles.tableContainer}>
                            <table className={styles.adminTable}>
                              <thead>
                                <tr>
                                  <th>{t("profile.admin.orderNumber")}</th>
                                  <th>{t("profile.admin.customer")}</th>
                                  <th>{t("profile.admin.amount")}</th>
                                  <th>{t("profile.admin.status")}</th>
                                  <th>{t("profile.admin.date")}</th>
                                  <th>{t("profile.admin.actions")}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recentOrders.map((order) => {
                                  const statusInfo = getOrderStatusInfo(
                                    order.status,
                                  );
                                  return (
                                    <tr key={order.id}>
                                      <td>
                                        <Link
                                          to={`/admin/orders/${order.id}`}
                                          className={styles.tableLink}
                                        >
                                          {order.orderNumber}
                                        </Link>
                                      </td>
                                      <td>{order.customer}</td>
                                      <td>{formatCurrency(order.amount)}</td>
                                      <td>
                                        <span
                                          className={styles.statusBadge}
                                          style={{
                                            color: statusInfo.color,
                                            backgroundColor: statusInfo.bgColor,
                                          }}
                                        >
                                          {statusInfo.icon} {statusInfo.text}
                                        </span>
                                      </td>
                                      <td>{formatDate(order.date)}</td>
                                      <td>
                                        <div className={styles.tableActions}>
                                          <button
                                            className={styles.tableButton}
                                            title={t("profile.admin.view")}
                                          >
                                            <FaEye />
                                          </button>
                                          <button
                                            className={styles.tableButton}
                                            title={t("profile.admin.edit")}
                                          >
                                            <FaEdit />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className={styles.dashboardSection}>
                          <div className={styles.sectionHeader}>
                            <h3>{t("profile.admin.newUsers")}</h3>
                            <Link
                              to="/admin/users"
                              className={styles.viewAllLink}
                            >
                              {t("profile.admin.allUsers")} →
                            </Link>
                          </div>
                          <div className={styles.usersList}>
                            {recentUsers.map((user) => (
                              <div key={user.id} className={styles.userItem}>
                                <div className={styles.userAvatar}>
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className={styles.userInfo}>
                                  <h4>{user.name}</h4>
                                  <p>{user.email}</p>
                                  <small>
                                    {t("profile.admin.orders")}: {user.orders} •{" "}
                                    {t("profile.admin.registration")}:{" "}
                                    {formatDate(user.joinDate)}
                                  </small>
                                </div>
                                <span
                                  className={`${styles.userStatus} ${
                                    user.status === "active"
                                      ? styles.active
                                      : styles.inactive
                                  }`}
                                >
                                  {user.status === "active"
                                    ? t("profile.admin.active")
                                    : t("profile.admin.inactive")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "admin-orders" && (
                    <div className={styles.adminOrders}>
                      <div className={styles.ordersFilters}>
                        <div className={styles.searchWrapper}>
                          <FaSearch className={styles.searchIcon} />
                          <input
                            type="text"
                            placeholder={t("profile.admin.searchOrders")}
                            className={styles.searchInput}
                            value={adminSearch}
                            onChange={handleAdminSearch}
                          />
                        </div>
                        <div className={styles.filterWrapper}>
                          <FaFilter className={styles.filterIcon} />
                          <select
                            className={styles.filterSelect}
                            value={adminFilter}
                            onChange={handleAdminFilter}
                          >
                            <option value="all">
                              {t("profile.admin.allStatuses")}
                            </option>
                            <option value="pending">
                              {t("profile.orderStatus.pending")}
                            </option>
                            <option value="processing">
                              {t("profile.orderStatus.processing")}
                            </option>
                            <option value="shipped">
                              {t("profile.orderStatus.shipped")}
                            </option>
                            <option value="delivered">
                              {t("profile.orderStatus.delivered")}
                            </option>
                            <option value="cancelled">
                              {t("profile.orderStatus.cancelled")}
                            </option>
                          </select>
                        </div>
                        <input
                          type="date"
                          className={styles.dateInput}
                          placeholder={t("profile.admin.dateFrom")}
                        />
                        <input
                          type="date"
                          className={styles.dateInput}
                          placeholder={t("profile.admin.dateTo")}
                        />
                      </div>

                      <div className={styles.tableContainer}>
                        <table className={styles.adminTable}>
                          <thead>
                            <tr>
                              <th>
                                <input type="checkbox" />
                              </th>
                              <th>{t("profile.admin.orderNumber")}</th>
                              <th>{t("profile.admin.customer")}</th>
                              <th>{t("profile.admin.phone")}</th>
                              <th>{t("profile.admin.amount")}</th>
                              <th>{t("profile.admin.status")}</th>
                              <th>{t("profile.admin.date")}</th>
                              <th>{t("profile.admin.actions")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentOrders.map((order) => {
                              const statusInfo = getOrderStatusInfo(
                                order.status,
                              );
                              return (
                                <tr key={order.id}>
                                  <td>
                                    <input type="checkbox" />
                                  </td>
                                  <td>
                                    <Link
                                      to={`/admin/orders/${order.id}`}
                                      className={styles.tableLink}
                                    >
                                      {order.orderNumber}
                                    </Link>
                                  </td>
                                  <td>{order.customer}</td>
                                  <td>+996 XXX XXX XXX</td>
                                  <td>{formatCurrency(order.amount)}</td>
                                  <td>
                                    <span
                                      className={styles.statusBadge}
                                      style={{
                                        color: statusInfo.color,
                                        backgroundColor: statusInfo.bgColor,
                                      }}
                                    >
                                      {statusInfo.icon} {statusInfo.text}
                                    </span>
                                  </td>
                                  <td>{formatDate(order.date)}</td>
                                  <td>
                                    <div className={styles.tableActions}>
                                      <button
                                        className={styles.tableButton}
                                        title={t("profile.admin.view")}
                                      >
                                        <FaEye />
                                      </button>
                                      <button
                                        className={styles.tableButton}
                                        title={t("profile.admin.edit")}
                                      >
                                        <FaEdit />
                                      </button>
                                      <button
                                        className={`${styles.tableButton} ${styles.danger}`}
                                        title={t("profile.admin.delete")}
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className={styles.pagination}>
                        <button className={styles.pageButton} disabled>
                          <FaChevronLeft /> {t("profile.admin.previous")}
                        </button>
                        <span className={styles.pageInfo}>
                          {t("profile.admin.pageInfo", {
                            current: 1,
                            total: 5,
                          })}
                        </span>
                        <button className={styles.pageButton}>
                          {t("profile.admin.next")} <FaChevronRight />
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "admin-products" && (
                    <div className={styles.adminProducts}>
                      <div className={styles.productsHeader}>
                        <div className={styles.productsSearch}>
                          <FaSearch className={styles.searchIcon} />
                          <input
                            type="text"
                            placeholder={t("profile.admin.searchProducts")}
                            className={styles.searchInput}
                          />
                        </div>
                        <div className={styles.productsActions}>
                          <select className={styles.filterSelect}>
                            <option value="">
                              {t("profile.admin.allCategories")}
                            </option>
                            <option value="helmets">
                              {t("profile.admin.categories.helmets")}
                            </option>
                            <option value="accessories">
                              {t("profile.admin.categories.accessories")}
                            </option>
                            <option value="parts">
                              {t("profile.admin.categories.parts")}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.productsGrid}>
                        <div className={styles.emptyProducts}>
                          <FaBox className={styles.emptyIcon} />
                          <h3>{t("profile.admin.productsNotFound")}</h3>
                          <p>
                            {t("profile.admin.productsNotFoundDescription")}
                          </p>
                          <Link
                            to="/admin/products/new"
                            className={styles.adminButtonPrimary}
                          >
                            <FaPlus /> {t("profile.admin.buttons.addProduct")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "admin-users" && (
                    <div className={styles.adminUsers}>
                      <div className={styles.usersFilters}>
                        <div className={styles.searchWrapper}>
                          <FaSearch className={styles.searchIcon} />
                          <input
                            type="text"
                            placeholder={t("profile.admin.searchUsers")}
                            className={styles.searchInput}
                          />
                        </div>
                        <select className={styles.filterSelect}>
                          <option value="all">
                            {t("profile.admin.allUsers")}
                          </option>
                          <option value="active">
                            {t("profile.admin.activeUsers")}
                          </option>
                          <option value="inactive">
                            {t("profile.admin.inactiveUsers")}
                          </option>
                          <option value="admin">
                            {t("profile.admin.admins")}
                          </option>
                        </select>
                      </div>

                      <div className={styles.tableContainer}>
                        <table className={styles.adminTable}>
                          <thead>
                            <tr>
                              <th>{t("profile.admin.name")}</th>
                              <th>{t("profile.admin.email")}</th>
                              <th>{t("profile.admin.phone")}</th>
                              <th>{t("profile.admin.role")}</th>
                              <th>{t("profile.admin.registrationDate")}</th>
                              <th>{t("profile.admin.orders")}</th>
                              <th>{t("profile.admin.status")}</th>
                              <th>{t("profile.admin.actions")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentUsers.map((user) => (
                              <tr key={user.id}>
                                <td>
                                  <div className={styles.userCell}>
                                    <div className={styles.userAvatarSmall}>
                                      {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{user.name}</span>
                                  </div>
                                </td>
                                <td>{user.email}</td>
                                <td>+996 XXX XXX XXX</td>
                                <td>
                                  <span
                                    className={`${styles.roleBadge} ${
                                      user.email === currentUser.email
                                        ? styles.roleAdmin
                                        : styles.roleUser
                                    }`}
                                  >
                                    {user.email === currentUser.email
                                      ? t("profile.admin.admin")
                                      : t("profile.admin.user")}
                                  </span>
                                </td>
                                <td>{formatDate(user.joinDate)}</td>
                                <td>{user.orders}</td>
                                <td>
                                  <span
                                    className={`${styles.statusBadge} ${
                                      user.status === "active"
                                        ? styles.statusActive
                                        : styles.statusInactive
                                    }`}
                                  >
                                    {user.status === "active"
                                      ? t("profile.admin.active")
                                      : t("profile.admin.inactive")}
                                  </span>
                                </td>
                                <td>
                                  <div className={styles.tableActions}>
                                    <button
                                      className={styles.tableButton}
                                      title={t("profile.admin.view")}
                                    >
                                      <FaEye />
                                    </button>
                                    <button
                                      className={styles.tableButton}
                                      title={t("profile.admin.edit")}
                                    >
                                      <FaEdit />
                                    </button>
                                    {user.email !== currentUser.email && (
                                      <button
                                        className={`${styles.tableButton} ${styles.danger}`}
                                        title={t("profile.admin.delete")}
                                      >
                                        <FaTrash />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === "admin-analytics" && (
                    <div className={styles.adminAnalytics}>
                      <h3>{t("profile.admin.salesAnalytics")}</h3>
                      <div className={styles.analyticsGrid}>
                        <div className={styles.analyticsCard}>
                          <h4>{t("profile.admin.dailyStatistics")}</h4>
                          <div className={styles.chartPlaceholder}>
                            <p>{t("profile.admin.chartLoading")}</p>
                          </div>
                        </div>
                        <div className={styles.analyticsCard}>
                          <h4>{t("profile.admin.popularCategories")}</h4>
                          <div className={styles.chartPlaceholder}>
                            <p>{t("profile.admin.chartLoading")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "admin-settings" && (
                    <div className={styles.adminSettings}>
                      <h3>{t("profile.admin.storeSettings")}</h3>
                      <div className={styles.settingsGrid}>
                        <div className={styles.settingCard}>
                          <h4>{t("profile.admin.basicSettings")}</h4>
                          <form className={styles.settingsForm}>
                            <div className={styles.formGroup}>
                              <label>{t("profile.admin.storeName")}</label>
                              <input
                                type="text"
                                className={styles.formInput}
                                placeholder="MotoShop"
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label>{t("profile.admin.supportEmail")}</label>
                              <input
                                type="email"
                                className={styles.formInput}
                                placeholder="support@motoshop.com"
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label>{t("profile.admin.phone")}</label>
                              <input
                                type="tel"
                                className={styles.formInput}
                                placeholder="+996 555 123 456"
                              />
                            </div>
                            <button type="submit" className={styles.saveButton}>
                              {t("profile.admin.saveSettings")}
                            </button>
                          </form>
                        </div>
                        <div className={styles.settingCard}>
                          <h4>{t("profile.admin.shippingSettings")}</h4>
                          <form className={styles.settingsForm}>
                            <div className={styles.formGroup}>
                              <label>{t("profile.admin.shippingCost")}</label>
                              <input
                                type="number"
                                className={styles.formInput}
                                placeholder="300"
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label>
                                {t("profile.admin.freeShippingFrom")}
                              </label>
                              <input
                                type="number"
                                className={styles.formInput}
                                placeholder="5000"
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label>{t("profile.admin.deliveryTime")}</label>
                              <input
                                type="number"
                                className={styles.formInput}
                                placeholder="3-5"
                              />
                            </div>
                            <button type="submit" className={styles.saveButton}>
                              {t("profile.admin.saveSettings")}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
