import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../../MainContext/MainContext";
import { useTranslation } from "react-i18next";
import {
  formatPriceWithCurrency,
  formatPrice,
  calculateItemTotal,
} from "../../utils/priceFormatter";
import styles from "./Home.module.scss";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaFire,
  FaTruck,
  FaShieldAlt,
  FaCreditCard,
  FaHeadset,
  FaGift,
  FaUndo,
  FaArrowRight,
  FaChevronRight,
  FaChevronLeft,
  FaEye,
} from "react-icons/fa";

const Home = () => {
  const {
    products,
    getProducts,
    loading,
    addOrder,
    addFavorit,
    deleteFavorit,
    favorit,
  } = useProduct();

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentBrandSlide, setCurrentBrandSlide] = useState(0);
  const [isFavoriteMap, setIsFavoriteMap] = useState({});
  const [notification, setNotification] = useState("");

  useEffect(() => {
    console.log("=== HOME TRANSLATIONS DEBUG ===");
    console.log("Current language:", i18n.language);
    console.log("Is i18n initialized:", i18n.isInitialized);

    const translations = i18n.getResourceBundle(i18n.language, "translation");
    console.log(
      "Total translations available:",
      Object.keys(translations || {}).length,
    );

    const keysToCheck = [
      "home_new_collection",
      "products_add_cart",
      "home_new",
      "home_best_seller",
      "notifications_added_to_cart",
    ];

    keysToCheck.forEach((key) => {
      const exists = translations && key in translations;
      console.log(`Key "${key}": ${exists ? "✓ FOUND" : "✗ NOT FOUND"}`);
      if (exists) {
        console.log(`  Value: "${translations[key]}"`);
      }
    });

    console.log("Testing flat keys:");
    console.log('t("home_new_collection"):', t("home_new_collection"));
    console.log('t("products_add_cart"):', t("products_add_cart"));

    console.log("Testing dotted keys:");
    console.log('t("home.new_collection"):', t("home.new_collection"));
    console.log('t("products.add_to_cart"):', t("products.add_to_cart"));
  }, [i18n, t]);

  const heroSlides = [
    {
      id: 1,
      title: t("home_new_collection"),
      subtitle: t("home_modern_equipment"),
      description: t("home_discounts_40"),
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: t("home_view_collection"),
      buttonLink: "/catalog?collection=new2024",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: 2,
      title: t("home_summer_sales"),
      subtitle: t("home_prepare_sleigh"),
      description: t("home_special_prices"),
      image:
        "https://images.unsplash.com/photo-1531310197839-ccf54634509e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: t("home_buy_with_discount"),
      buttonLink: "/catalog?discount=true",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: 3,
      title: t("home_free_delivery"),
      subtitle: t("home_order_over_3000"),
      description: t("home_fast_delivery"),
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: t("home_choose_products"),
      buttonLink: "/catalog",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  const categories = [
    {
      id: 1,
      name: t("categories_motorcycle_helmets"),
      image:
        "https://rurocshop.ru/wa-data/public/shop/img/18449539_1453659301344694_3681491518116120770_o.png",
      color: "#4A90E2",
      category: "motorcycle_helmets",
    },
    {
      id: 2,
      name: t("categories_motorcycle_equipment"),
      image:
        "https://image.fonwall.ru/o/se/helmet-ktm-bikes-motorcycle.jpeg?auto=compress&fit=resize&w=500&display=thumb&domain=img2.fonwall.ru",
      color: "#50E3C2",
      category: "motorcycle_equipment",
    },
    {
      id: 3,
      name: t("home_consumables_parts"),
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/S96958718e4854888bcae33a8fadd3820H.jpg",
      color: "#F5A623",
      category: "spare_parts",
    },
    {
      id: 4,
      name: t("categories_motorcycle_tires"),
      image: "https://99px.ru/sstorage/53/2012/07/tmb_44918_9964.jpg",
      color: "#9013FE",
      category: "motorcycle_tires",
    },
    {
      id: 5,
      name: t("home_tuning_accessories"),
      image: "https://motoxmoto.ru/wp-content/uploads/2019/01/motogirl.jpg",
      color: "#D0021B",
      category: "tuning",
    },
    {
      id: 6,
      name: t("categories_motochemistry"),
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjLBpEK-DSWFflPppEb2T_mo7GFPMnl4fE6A&s",
      color: "#7ED321",
      category: "motochemistry",
    },
  ];

  const additionalCategories = [
    {
      id: 7,
      name: t("home_discounted_items"),
      image:
        "https://via.placeholder.com/400x300/F39C12/FFFFFF?text=Discounted+Products",
      color: "#F39C12",
      category: "discounted",
    },
    {
      id: 8,
      name: t("home_winter_equipment"),
      image:
        "https://via.placeholder.com/400x300/3498DB/FFFFFF?text=Winter+Gear",
      color: "#3498DB",
      category: "winter",
    },
  ];

  const brands = [
    {
      id: 1,
      name: "AGV",
      logo: "data:image/png;base64,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",
      link: "/catalog?brand=AGV",
    },
    {
      id: 2,
      name: "HJC",
      logo: "data:image/png;base64,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",
      link: "/catalog?brand=HJC",
    },
    {
      id: 3,
      name: "Shark",
      logo: "data:image/png;base64,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",
      link: "/catalog?brand=SHARK",
    },
    {
      id: 4,
      name: "Arai",
      logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAbFBMVEX///8AAADw8PD5+fnR0dHz8/P29vbGxsbr6+vn5+fh4eHe3t68vLzk5OT8/PzBwcG2trZHR0eTk5NdXV0NDQ2MjIzX19chISF7e3tYWFhSUlIxMTFiYmKioqIsLCw9PT1vb28aGhqDg4Otra04ROScAAAKrElEQVR4nO2c57ajKhSAE0uw915R3/8drzXCBk05yTmz7uL7NZNBZFc2xblcBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEgl/HkVVJ023DNM2EwDQNW9ckVXb+eoBP4Ei2qSDL8oY67jMcFn7bNmkXzXRp2fpFiLM+rgfPspBi2tI/KZVkKNZQBz3O2+76HGmb4z4YBksx1L8e/h1N8YI4q/z0SSEgjV9lceAp2h/LcVOGHod+86YYtEgh7gfl9keCoCAv2nfNwSdtizBA8i9LkgRFmUZPD7IbebZ1lJZ+YP6aJF74UMN5FgxuwktWqp2goc6q8kEXlfv1RCdLQ3us0qbx+wHpz3amo6EvmubQwoUnf8/jVMPL+a/tSr/AtSK91asyZLl/EHyhpX8jbd9MN+MbxK9wjaa8KiXKzqsS1Zif3KPMNT5sHw0FXPcqq75WVt3dYvJfXn+HnAwx9jkv8Wv0ls35GB7XKH5fu3uAOAM53fTvvUlDQ8xx5agf7M+IYtYVzya9R8cIokyH3n6dnHgBxz5V/YF0bcYFRxTsJcDyJj2AH9UmY3zGe/yEQR1MYyiCH1pHzThK6mqT8WGNtl7707JEtb3lzVVy0xLjlvhTqol/0m3NmdpKpLLTmRzQjeKfJyBHNUcFxZekKsvSR+oUtlFTv9sd4ojiJ9ymLmj2fshQSMPF29Qj4cUt3upaZ8M+qg6C0IYtjZ+IQIK2HlMPrZUCfjlP3zymru+qI6XcYNPiU2sTaZ8TsLb9ufRec2KzZ8ySD0eV342ZGYJPLUvsPan5SX3/c/xKXnOZHFYGh/WjE8DGV+sDcsyYxAjQLsw1dJ/uombqWHzy8NDB1tGLldkxB5YZF6ZPpjWV0XQUnMQAYhfN4YdqDzpmJKr2u8bPrHc0Jlx87+Q5ZfFIypYfCxki56eeAkrd/vFbdKamDJMTWYwlgZeU1ryPyXJxNt+KHQ3OFdkjaSRWlrM0K61mtMkXpR+aMhdp3MkgnTtmY5WR5jxF02uSifysubzqzZAo8V+obz1cRlEZn86Djra5Btx8iE8fq0Hra3E+lKWRe7GoV2zmty3XRSuKMo7oRg/axvszsuyHM8VItaZDA/cj8UQ/+y6c0c5yGiyxrv6pLMrSKLg4mHxoWP9ZolJJJjtm2RJGk6isWZF6zFfXJjtYxg0mwOh4RjNhZdmcmt/cRnmRyYfKbU5KqPSj6NNwW2/tUnIPNkfmLtceiJ/WClcC+wTFURXoMMF/GsnaIvpU9xnkQ9XWP2XnaFgHn1mJrtG7I11Lz9JRsGqD+C2UOZ2OBAdJQIGyBGeyqItrhVOZQ4Vav4brjXIjQqM+xuTqNQ8Gd6D0WK5KJH/cjHWBU/pBtQELMv+09l06LWbrU0XApgKdt9PCEC1bsSrpPv6630PYq9sC8aKBbivuLMgY5rRcXOq3dtahQz5Vbo8lsD8u9eompDAh20G5Zw4L9MBdLsKNi/Bsn9WaX54u+kLkY1tIsmmeB940SVhhCxkyl7X7q2ElgC8sKnzPWVGy7iutb8W8vtWnvGwLX3Lg28qYTIbkiD3QB2d8A2hSntTx5mLFav0rlS637T9GOTzuKYZ0i2aJAoXsdiDengA1cQaK6RbX/niOWSuxbUZNyMR6n2VoL8v5dtoMk5Az3OpSZC6LyFwEay7O7incSz6uFLRF7ugi3yboleY9BVKjH2vPuii7KOpKUt94E6buiF9Xc5HGSqkBACdqLxAZCjMwTVa2KiULgrFmCuKAqhu2wpTe5JgnUqWO49olPeC+fqVienEbaqMro0ZggfUgq25QyqRHiVll9zpINpvTUbovCxNS4Vu+1KlMurSlfIkejAJ8lhmjAYQpD1b90rks3fYYXXntPkuG0t0lqX2tZv7pRhmLXoYloKxjpk0bCNPwhbHPZbmm20EX9at/L/J00svu23mUFZZFCnWo0K3tnCXGTCAMM0oVxEzHnWZMmPMgWzBS8yixCYnI+M/Wn1Wq1yVkqGS4hUy9mDIB8zs7zmcSQLLZfkxL02WYGariXUNGol+3J08qlNrVzegYmLWvUpXn4iVqvO5h0EdBINXNwOVFwBZw7tJJVEvaHcmj/HPxJ5Ne36Z3xdCV9JbNKCuUy3ipXmffNattegSpubowwNI6gzWzvHk2vTKgZzCe5q7+vUrUgJsGpqwNdG6aQ4Ze10WTsbzo2qsc4bk+ZNAtrs2oBr+9l6TywH9WpvxhsjhbYe6qsx/eh5hsK8Me9IsxSpeuhtGBRnhrALgziWallwEydMO9JzGYGOhg7C8SYgqXaN9EsXlnimDgKtztG5nHtmkR0etStgC4MMVoL7GbyNsChnyKqjL9mnPC3uzP2CcL/xXeweMMXqdYEHcHyy5q7JXNUdC1YCpU9giAgTjghDHzAv726oR2oZK/CUAmCd80OBrCzPYeuwN6ZUpkIttArT7PfRKXQc18UHbd9jE0SGJPAdOY3RSAlcU8eIXWP1l/w4XVwcjZuLsXJPR0fK2O7tbc20UeR+Oty3kO1nzTbQqNXj1F5PLbZNJZ1DFvChEsmvYTH1CpHO9r35NqwHGHnnvowlimRCo4rOqoB5isUlnw/k+gwcO4YndvoIz6+IRiPQPNHcYbWpN/fgA9uJ7KLfo3ei0Cx5ndwMKxMGXojcO+6AUm688ucM2zRsms38vje5MumVuWExODDjfoCNSMOIUCWQT7ClOakZEKNPHgiG7Kx8XY30DURiH/IsPKsHpJlG47pd56K3uBU6D30eSH0bVYM9E69Kjp7+Glxt30S1ch0o+OvY/PXFfFmnPRh8wfwQ8P3bUhwzj2iMtajiOPqCPSCO8ZHVkuORIJWRaic6WTeBa9Kw491H98DryUI9g1tFmKm5789e3pFRWEZ37qMCvK6vJFFtR1jJsrfuaprwPXhdVzR9oGnGOKD564vosHStTs2Rs0zE2A7qX7HV/AnvPBTnp0LMMD6uFaHW6j/QYeqK1y66Ub3MxNoDT7s8hJMlAj8IuRE24WPOAs+z9Ja1IMN8GsN64Zqkyt+ZKnfgY5gJXbuzcmbXZ59rviMJsB1/YH17WtsoPd9dovfbBz0+B1kY5ZtL/IUDA39EPX/ro8so7gCjvNfz7dyQNmbpQ1ATK++XmLrTAbIyUePqJB1YvZ/YC8tszvyGO7QwWvIvqx9TFncJSBt9YPBuXDX7c4pldjxq+r+mP3JBdMC+b7ibEY9T42mWpunYWMJG1gfeyW9I5qWrxdr6bAmWf+NGNrKMBhy36wlbkH6/WfI+lcea5NW4Sx9+Y3IdNXTblfcr48w9/5SGtHvvHlGWeBtClxjezn04KaePHhF3QZUn9ngjb5H23dDRX2taXoB/4hawk6+CBrow2+ECYn3FBcPvHdaVS2RZ6HuMrzvGjZegI2T8s2/uR91edRx6gdvf3RCJ+jK/189NJfL2Up7DGh4tB/9EXsmTlKP8TZGG1/KseOrlj19B19wUtKx8Zoi+nr+TG+/pENIBLJSFxvqKf/46DK/bbhCdY1rZ9X0//WUA8eUowPfoH5HW6SbpiJgpBrTXgz8x8tFyElMW1N+qMP/wUCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBIL/C/8BeW+kH87vSG0AAAAASUVORK5CYII=",
      link: "/catalog?brand=Arai",
    },
    {
      id: 5,
      name: "Shoei",
      logo: "data:image/png;base64,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",
      link: "/catalog?brand=Shoei",
    },
    {
      id: 6,
      name: "Alpinestars",
      logo: "data:image/png;base64,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",
      link: "/catalog?brand=Alpinestars",
    },
    {
      id: 7,
      name: "Dainese",
      logo: "data:image/png;base64,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",
      link: "/catalog?brand=Dainese",
    },
    {
      id: 8,
      name: "Nolan",
      logo: "data:image/png;base64,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",
      link: "/catalog?brand=Nolan",
    },
  ];

  const benefits = [
    {
      id: 1,
      icon: <FaTruck />,
      title: t("home_free_delivery"),
      description: t("home_order_over_3000"),
      color: "#4A90E2",
    },
    {
      id: 2,
      icon: <FaShieldAlt />,
      title: t("home_warranty_year"),
      description: t("home_official_warranty"),
      color: "#50E3C2",
    },
    {
      id: 3,
      icon: <FaCreditCard />,
      title: t("home_payment_delivery"),
      description: t("home_cash_card"),
      color: "#F5A623",
    },
    {
      id: 4,
      icon: <FaHeadset />,
      title: t("home_support"),
      description: t("home_always_available"),
      color: "#9013FE",
    },
    {
      id: 5,
      icon: <FaGift />,
      title: t("home_bonus_program"),
      description: t("home_cashback"),
      color: "#D0021B",
    },
    {
      id: 6,
      icon: <FaUndo />,
      title: t("home_easy_return"),
      description: t("home_14_days_return"),
      color: "#7ED321",
    },
  ];

  const promoBanners = [
    {
      id: 1,
      title: t("home_instagram"),
      subtitle: t("home_see_news"),
      href: "https://www.instagram.com/ku.bat2398?igsh=MXFhZDJ1Y3I0dGpteg==",
      className: "instagram",
      target: "_blank",
      rel: "noopener noreferrer",
    },
    {
      id: 2,
      title: t("home_facebook"),
      subtitle: t("home_see_news"),
      href: "https://www.facebook.com/profile.php?id=61560514741224&mibextid=ZbWKwL",
      className: "facebook",
      target: "_blank",
      rel: "noopener noreferrer",
    },
  ];

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const featured = [...products]
        .filter((p) => p.rating >= 4)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);

      const arrivals = [...products]
        .sort(
          (a, b) =>
            new Date(b.createdAt || "2024-01-01") -
            new Date(a.createdAt || "2024-01-01"),
        )
        .slice(0, 8);

      const discounted = [...products]
        .filter((p) => p.discount && p.discount > 0)
        .sort((a, b) => b.discount - a.discount)
        .slice(0, 6);

      setFeaturedProducts(featured);
      setNewArrivals(arrivals);
      setDiscountedProducts(discounted);
    }
  }, [products]);

  useEffect(() => {
    if (favorit && favorit.length > 0) {
      const favoriteMap = {};
      favorit.forEach((item) => {
        if (item.id) favoriteMap[item.id] = true;
      });
      setIsFavoriteMap(favoriteMap);
    }
  }, [favorit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const productToAdd = {
      ...product,
      quantity: 1,
      addedAt: new Date().toISOString(),
    };
    addOrder(productToAdd);
    showNotification(t("notifications_added_cart", { name: product.name }));
  };

  const handleToggleFavorite = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isFavoriteMap[product.id]) {
      deleteFavorit(product.id);
      setIsFavoriteMap((prev) => ({ ...prev, [product.id]: false }));
      showNotification(t("notifications_removed_from_favorites"));
    } else {
      addFavorit(product);
      setIsFavoriteMap((prev) => ({ ...prev, [product.id]: true }));
      showNotification(t("notifications_added_favorites"));
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const nextBrandSlide = () => {
    setCurrentBrandSlide((prev) => {
      if (prev + 4 >= brands.length) return 0;
      return prev + 4;
    });
  };

  const prevBrandSlide = () => {
    setCurrentBrandSlide((prev) => {
      if (prev === 0) return brands.length - 4;
      return prev - 4;
    });
  };

  const navigateToCatalogWithFilter = (filterParams) => {
    const queryString = new URLSearchParams(filterParams).toString();
    navigate(`/catalog${queryString ? `?${queryString}` : ""}`);
  };

  const CategoryCard = ({ category }) => {
    return (
      <button
        onClick={() =>
          navigateToCatalogWithFilter({ category: category.category })
        }
        className={styles.categoryCard}
        style={{
          "--category-color": category.color,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div className={styles.categoryImage}>
          <img src={category.image} alt={category.name} />
          <div className={styles.categoryOverlay} />
        </div>
        <div className={styles.categoryContent}>
          <h3 className={styles.categoryName}>{category.name}</h3>
        </div>
      </button>
    );
  };

  const ProductCard = ({ product, variant = "default" }) => {
    const hasDiscount = product.discount && product.discount > 0;
    const discountPrice = hasDiscount
      ? calculateItemTotal(product.price, product.discount)
      : formatPrice(product.price);

    const rating = product.rating || 4.5;

    return (
      <div className={`${styles.productCard} ${styles[variant]}`}>
        <Link to={`/product/${product.id}`} className={styles.cardLink}>
          <div className={styles.imageContainer}>
            <img
              src={
                product.image || product.imageUrl || "/placeholder-image.jpg"
              }
              alt={product.name || product.title}
              className={styles.productImage}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
              }}
            />

            <div className={styles.imageOverlay}>
              <button
                className={`${styles.favoriteButton} ${
                  isFavoriteMap[product.id] ? styles.active : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleFavorite(product, e);
                }}
              >
                <FaHeart />
              </button>

              <button
                className={styles.quickViewButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/product/${product.id}`);
                }}
              >
                <FaEye />
              </button>
            </div>

            <div className={styles.badges}>
              {hasDiscount && (
                <span className={styles.discountBadge}>
                  -{product.discount}%
                </span>
              )}
              {variant === "new" && (
                <span className={styles.newBadge}>{t("home_new")}</span>
              )}
              {variant === "hot" && (
                <span className={styles.hotBadge}>
                  <FaFire /> {t("home_best_seller")}
                </span>
              )}
            </div>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.productBrand}>{product.brand}</div>
            <h3 className={styles.productName}>
              {product.name || product.title}
            </h3>

            <div className={styles.productCategory}>{product.category}</div>

            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>
                {formatPriceWithCurrency(discountPrice)}
              </span>
              {hasDiscount && (
                <span className={styles.originalPrice}>
                  {formatPriceWithCurrency(product.price)}
                </span>
              )}
            </div>

            <div className={styles.ratingSection}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.floor(rating)
                        ? styles.filledStar
                        : styles.emptyStar
                    }
                  />
                ))}
                <span className={styles.ratingValue}>({rating})</span>
              </div>
            </div>
          </div>
        </Link>

        <button
          className={styles.addToCartButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart(product, e);
          }}
          disabled={!product.inStock}
        >
          <FaShoppingCart />
          {product.inStock ? t("products_add_cart") : t("products_out_stock")}
        </button>
      </div>
    );
  };

  const PromoBanner = ({ banner }) => {
    return (
      <a
        href={banner.href}
        className={`${styles.promoBanner} ${
          styles[banner.className || banner.theme]
        }`}
        target={banner.target || "_blank"}
        rel={banner.rel || "noopener noreferrer"}
      >
        <div className={styles.promoContent}>
          <h3>{banner.title}</h3>
          <p>{banner.subtitle}</p>
          <button className={styles.promoButton}>
            {t("home_details")} <FaArrowRight />
          </button>
        </div>
      </a>
    );
  };

  if (loading && products.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>{t("home_loading_products")}</p>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      {notification && (
        <div className={styles.notification}>
          {notification}
          <button
            className={styles.closeNotification}
            onClick={() => setNotification("")}
          >
            ×
          </button>
        </div>
      )}

      <section className={styles.heroSection}>
        <div className={styles.heroSlider}>
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.heroSlide} ${
                index === currentHeroSlide ? styles.active : ""
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className={`container ${styles.heroContainer}`}>
                <div className={styles.heroContent}>
                  <h1 className={styles.heroTitle}>{slide.title}</h1>
                  <h2 className={styles.heroSubtitle}>{slide.subtitle}</h2>
                  <p className={styles.heroDescription}>{slide.description}</p>
                  <Link to={slide.buttonLink} className={styles.heroButton}>
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}

          <div className={styles.heroControls}>
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`${styles.heroDot} ${
                  index === currentHeroSlide ? styles.active : ""
                }`}
                onClick={() => setCurrentHeroSlide(index)}
                aria-label={`${t("home_go_to_slide")} ${index + 1}`}
              />
            ))}
          </div>

          <button
            className={`${styles.heroNav} ${styles.prev}`}
            onClick={() =>
              setCurrentHeroSlide((prev) =>
                prev === 0 ? heroSlides.length - 1 : prev - 1,
              )
            }
          >
            <FaChevronLeft />
          </button>
          <button
            className={`${styles.heroNav} ${styles.next}`}
            onClick={() =>
              setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)
            }
          >
            <FaChevronRight />
          </button>
        </div>
      </section>

      <section className={styles.categoriesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {t("home_popular_categories")}
            </h2>
            <Link to="/catalog" className={styles.viewAllLink}>
              {t("home_all_categories")} <FaArrowRight />
            </Link>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <FaFire /> {t("home_best_sellers")}
            </h2>
            <button
              onClick={() => navigateToCatalogWithFilter({ sort: "popular" })}
              className={styles.viewAllLink}
              style={{ cursor: "pointer", background: "none", border: "none" }}
            >
              {t("home_view_all")} <FaArrowRight />
            </button>
          </div>

          <div className={styles.productsGrid}>
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} variant="hot" />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.promoSection}>
        <div className="container">
          <div className={styles.promoGrid}>
            {promoBanners.map((banner) => (
              <PromoBanner key={banner.id} banner={banner} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.newArrivalsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("home_new_arrivals")}</h2>
            <button
              onClick={() => navigateToCatalogWithFilter({ sort: "newest" })}
              className={styles.viewAllLink}
              style={{ cursor: "pointer", background: "none", border: "none" }}
            >
              {t("home_all_new")} <FaArrowRight />
            </button>
          </div>

          <div className={styles.productsGrid}>
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} variant="new" />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.benefitsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{t("home_why_choose")}</h2>

          <div className={styles.benefitsGrid}>
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className={styles.benefitCard}
                style={{ "--benefit-color": benefit.color }}
              >
                <div className={styles.benefitIcon}>{benefit.icon}</div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {discountedProducts.length > 0 && (
        <section className={styles.discountSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t("home_hot_offers")}</h2>
              <button
                onClick={() =>
                  navigateToCatalogWithFilter({ discount: "true" })
                }
                className={styles.viewAllLink}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                }}
              >
                {t("home_all_discounts")} <FaArrowRight />
              </button>
            </div>

            <div className={styles.discountProducts}>
              {discountedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.brandsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{t("home_our_brands")}</h2>

          <div className={styles.brandsSlider}>
            <button
              className={`${styles.brandNav} ${styles.prev}`}
              onClick={prevBrandSlide}
              disabled={currentBrandSlide === 0}
            >
              <FaChevronLeft />
            </button>

            <div className={styles.brandsTrack}>
              <div
                className={styles.brandsContainer}
                style={{ transform: `translateX(-${currentBrandSlide * 25}%)` }}
              >
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() =>
                      navigateToCatalogWithFilter({ brand: brand.name })
                    }
                    className={styles.brandCard}
                    style={{
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                    }}
                  >
                    <div className={styles.brandLogo}>
                      {brand.logo && <img src={brand.logo} alt={brand.name} />}
                    </div>
                    <span className={styles.brandName}>{brand.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              className={`${styles.brandNav} ${styles.next}`}
              onClick={nextBrandSlide}
              disabled={currentBrandSlide >= brands.length - 4}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
