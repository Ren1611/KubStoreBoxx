import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
import { formatPrice } from "../utils/priceFormatter";

const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);

// Используем только MockAPI
const API_BASE_URL = "https://695c65b779f2f34749d414ce.mockapi.io/Kub";

const initialState = {
  products: [],
  product: null,
  editingProduct: null,
  error: null,
  pagination: {
    current_page: 1,
    per_page: 100, // Показываем все товары на одной странице
    total_pages: 1,
    total_items: 0,
  },
  loading: false,
  allProductsLoaded: false, // Флаг, что все товары загружены
};

function reducer(state, action) {
  switch (action.type) {
    case "GET_PRODUCTS_START":
      return { ...state, loading: true };
    case "GET_PRODUCTS_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
        allProductsLoaded: action.payload.allProductsLoaded,
      };
    case "GET_PRODUCTS_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "GET_ONE_PRODUCT":
      return { ...state, product: action.payload };
    case "SET_EDITING_PRODUCT":
      return { ...state, editingProduct: action.payload };
    case "CLEAR_EDITING_PRODUCT":
      return { ...state, editingProduct: null };
    case "ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "ADD_PRODUCT":
      return { ...state, products: [action.payload, ...state.products] };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

const MainContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [order, setOrder] = useState([]);
  const [favorit, setFavorit] = useState([]);
  const [card, setCard] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState("ru");

  // Используем ref для предотвращения множественных запросов
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);
  const productsLoadedRef = useRef(false); // Флаг, что товары уже загружены

  // Функция для очистки данных продукта
  const cleanProductData = useCallback((productData) => {
    if (!productData) return null;

    // Приводим данные к единому формату
    return {
      id: productData.id || Date.now().toString(),
      name: productData.name || productData.title || "Без названия",
      title: productData.title || productData.name || "Без названия",
      description: productData.description || "Описание отсутствует",
      price: formatPrice(productData.price || 0),
      oldPrice: productData.oldPrice
        ? formatPrice(productData.oldPrice)
        : undefined,
      discount: productData.discount || 0,
      brand: productData.brand || "Неизвестный",
      category: productData.category || "Неизвестная категория",
      sku: productData.sku || `SKU-${Date.now()}`,
      images: Array.isArray(productData.images)
        ? productData.images
        : productData.image
          ? [productData.image]
          : ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300"],
      inStock: Boolean(productData.inStock !== false),
      rating: productData.rating ? parseFloat(productData.rating) : 0,
      reviews: productData.reviews || 0,
      countInStock: productData.countInStock || 0,
      createdAt: productData.createdAt || new Date().toISOString(),
      updatedAt: productData.updatedAt || new Date().toISOString(),
      isFeatured: Boolean(productData.isFeatured),
      isActive: Boolean(productData.isActive !== false),
      specifications: productData.specifications || {},
      tags: productData.tags || [],
      features: productData.features || [],
      weight: productData.weight || 0,
      dimensions: productData.dimensions || {},
      warranty: productData.warranty || 0,
      quantity: productData.quantity || 1,
    };
  }, []);

  // Функция для отмены предыдущего запроса
  const cancelPreviousRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("🛑 Отменен предыдущий запрос");
    }
    abortControllerRef.current = new AbortController();
  }, []);

  // Получение ВСЕХ продуктов из MockAPI
  const getAllProducts = useCallback(async () => {
    // Если товары уже загружены, не делаем повторный запрос
    if (productsLoadedRef.current && state.products.length > 0) {
      console.log("📦 Товары уже загружены, используем кэш");
      return {
        products: state.products,
        pagination: state.pagination,
        allProductsLoaded: true,
      };
    }

    // Отменяем предыдущий запрос
    cancelPreviousRequest();

    dispatch({ type: "GET_PRODUCTS_START" });

    try {
      console.log("📡 Загружаем ВСЕ товары из MockAPI...");

      // 1. Сначала получаем общее количество товаров
      const countResponse = await axios.get(API_BASE_URL, {
        params: {
          page: 1,
          limit: 1,
        },
        signal: abortControllerRef.current?.signal,
        timeout: 5000,
      });

      // MockAPI возвращает общее количество в заголовке x-total-count
      const totalItems =
        parseInt(countResponse.headers["x-total-count"]) || 100;
      console.log(`📊 Всего товаров в базе: ${totalItems}`);

      // 2. Загружаем ВСЕ товары за один запрос
      const response = await axios.get(API_BASE_URL, {
        params: {
          page: 1,
          limit: totalItems, // Запрашиваем ВСЕ товары
          sortBy: "createdAt",
          order: "desc",
        },
        signal: abortControllerRef.current?.signal,
        timeout: 15000, // Увеличиваем таймаут для большого запроса
      });

      console.log(`✅ Загружено ${response.data.length} товаров`);

      const cleanedData = response.data.map((product) =>
        cleanProductData(product),
      );

      dispatch({
        type: "GET_PRODUCTS_SUCCESS",
        payload: {
          products: cleanedData,
          pagination: {
            current_page: 1,
            per_page: totalItems,
            total_pages: 1,
            total_items: totalItems,
          },
          allProductsLoaded: true,
        },
      });

      // Устанавливаем флаг, что товары загружены
      productsLoadedRef.current = true;

      return {
        products: cleanedData,
        pagination: {
          current_page: 1,
          per_page: totalItems,
          total_pages: 1,
          total_items: totalItems,
        },
        allProductsLoaded: true,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("🛑 Запрос отменен");
        return;
      }

      console.error("❌ Ошибка загрузки всех товаров:", error.message);

      // Если не удалось загрузить все сразу, пробуем загрузить порциями
      console.log("🔄 Пробуем загрузить товары порциями...");
      return loadProductsInChunks();
    }
  }, [
    cancelPreviousRequest,
    cleanProductData,
    state.products,
    state.pagination,
  ]);

  // Загрузка товаров порциями (fallback метод)
  const loadProductsInChunks = useCallback(async () => {
    const CHUNK_SIZE = 20; // загружаем по 20 товаров за раз
    let allProducts = [];
    let page = 1;
    let hasMore = true;
    let totalItems = 0;

    try {
      while (hasMore) {
        console.log(`🔄 Загружаем порцию ${page}...`);

        const response = await axios.get(API_BASE_URL, {
          params: {
            page: page,
            limit: CHUNK_SIZE,
            sortBy: "createdAt",
            order: "desc",
          },
          signal: abortControllerRef.current?.signal,
          timeout: 5000,
        });

        const chunkData = response.data.map(cleanProductData);
        allProducts = [...allProducts, ...chunkData];

        // Получаем общее количество из заголовка
        if (page === 1) {
          totalItems = parseInt(response.headers["x-total-count"]) || 100;
        }

        // Проверяем, есть ли еще товары
        hasMore =
          chunkData.length === CHUNK_SIZE && allProducts.length < totalItems;
        page++;

        // Обновляем состояние после каждой порции
        dispatch({
          type: "GET_PRODUCTS_SUCCESS",
          payload: {
            products: allProducts,
            pagination: {
              current_page: 1,
              per_page: allProducts.length,
              total_pages: 1,
              total_items: totalItems,
            },
            allProductsLoaded: !hasMore,
          },
        });

        // Небольшая пауза между запросами
        if (hasMore) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      console.log(`✅ Итого загружено ${allProducts.length} товаров`);
      productsLoadedRef.current = true;

      return {
        products: allProducts,
        pagination: {
          current_page: 1,
          per_page: allProducts.length,
          total_pages: 1,
          total_items: totalItems,
        },
        allProductsLoaded: true,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("🛑 Запрос отменен");
        return;
      }

      console.error("loadProductsInChunks error:", error.message);

      // Возвращаем то, что успели загрузить
      return {
        products: allProducts,
        pagination: {
          current_page: 1,
          per_page: allProducts.length,
          total_pages: 1,
          total_items: allProducts.length,
        },
        allProductsLoaded: false,
      };
    }
  }, [cleanProductData]);

  // Получение одного продукта по ID
  const getOneProduct = useCallback(
    async (id) => {
      if (!id) {
        console.error("❌ ID продукта не указан");
        return null;
      }

      try {
        console.log(`📡 Запрашиваем продукт ${id}...`);

        const response = await axios.get(`${API_BASE_URL}/${id}`, {
          timeout: 5000,
        });

        console.log(`✅ Продукт получен`);

        const cleanedData = cleanProductData(response.data);
        dispatch({
          type: "GET_ONE_PRODUCT",
          payload: cleanedData,
        });
        return cleanedData;
      } catch (error) {
        console.error("getOneProduct error:", error.message);

        // Ищем в локальных данных
        const localProduct = state.products.find((p) => p.id === id);

        if (localProduct) {
          console.log("✅ Найден товар в локальных данных");
          dispatch({
            type: "GET_ONE_PRODUCT",
            payload: localProduct,
          });
          return localProduct;
        }

        dispatch({
          type: "ERROR",
          payload: error.message,
        });
        return null;
      }
    },
    [cleanProductData, state.products],
  );

  // Создание нового продукта
  const createProduct = useCallback(
    async (newProduct) => {
      try {
        // Подготовка данных для отправки
        const productToSend = {
          ...newProduct,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        console.log(`📤 Создаем новый товар...`);

        const response = await axios.post(API_BASE_URL, productToSend, {
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(`✅ Товар создан`);

        const cleanedData = cleanProductData(response.data);

        dispatch({
          type: "ADD_PRODUCT",
          payload: cleanedData,
        });

        // Сбрасываем флаг загрузки, так как добавился новый товар
        productsLoadedRef.current = false;

        return cleanedData;
      } catch (error) {
        console.error("createProduct error:", error.message);
        dispatch({
          type: "ERROR",
          payload: error.message,
        });
        throw error;
      }
    },
    [cleanProductData],
  );

  // Удаление продукта
  const deleteProduct = useCallback(async (id) => {
    if (!id) {
      console.error("❌ ID продукта не указан");
      return;
    }

    try {
      console.log(`🗑️ Удаляем товар ${id}...`);

      await axios.delete(`${API_BASE_URL}/${id}`, {
        timeout: 5000,
      });

      console.log(`✅ Товар удален`);

      dispatch({
        type: "DELETE_PRODUCT",
        payload: id,
      });
    } catch (error) {
      console.error("deleteProduct error:", error.message);
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  }, []);

  // Обновление продукта
  const updateProduct = useCallback(
    async (id, updatedData) => {
      if (!id) {
        console.error("❌ ID продукта не указан");
        return;
      }

      try {
        const cleanedData = cleanProductData(updatedData);

        console.log(`✏️ Обновляем товар ${id}...`);

        const response = await axios.put(`${API_BASE_URL}/${id}`, cleanedData, {
          timeout: 5000,
        });

        console.log(`✅ Товар обновлен`);

        const updatedProduct = cleanProductData(response.data);

        dispatch({
          type: "UPDATE_PRODUCT",
          payload: updatedProduct,
        });

        dispatch({
          type: "CLEAR_EDITING_PRODUCT",
        });

        return updatedProduct;
      } catch (error) {
        console.error("updateProduct error:", error.message);
        dispatch({
          type: "ERROR",
          payload: error.message,
        });
        throw error;
      }
    },
    [cleanProductData],
  );

  // Функции редактирования
  const setEditingProduct = useCallback(
    (product) => {
      const cleanedProduct = cleanProductData(product);
      dispatch({
        type: "SET_EDITING_PRODUCT",
        payload: cleanedProduct,
      });
    },
    [cleanProductData],
  );

  const clearEditingProduct = useCallback(() => {
    dispatch({
      type: "CLEAR_EDITING_PRODUCT",
    });
  }, []);

  // Перезагрузка всех товаров
  const refreshProducts = useCallback(() => {
    console.log("🔄 Перезагружаем товары...");
    productsLoadedRef.current = false;
    getAllProducts();
  }, [getAllProducts]);

  // Функции для работы с корзиной
  const addOrder = useCallback((newProduct) => {
    try {
      let data = JSON.parse(localStorage.getItem("orders")) || [];

      const cleanedProduct = {
        ...newProduct,
        id: newProduct.id || Date.now().toString(),
        price: formatPrice(newProduct.price),
        oldPrice: newProduct.oldPrice
          ? formatPrice(newProduct.oldPrice)
          : undefined,
        discount: newProduct.discount
          ? formatPrice(newProduct.discount)
          : undefined,
        quantity: parseInt(newProduct.quantity) || 1,
      };

      const existingIndex = data.findIndex(
        (item) => item.id === cleanedProduct.id,
      );

      if (existingIndex > -1) {
        data[existingIndex].quantity += cleanedProduct.quantity;
      } else {
        data.push(cleanedProduct);
      }

      localStorage.setItem("orders", JSON.stringify(data));
      readOrder();
      return cleanedProduct;
    } catch (error) {
      console.error("Error adding to order:", error);
      return null;
    }
  }, []);

  const readOrder = useCallback(() => {
    try {
      let data = JSON.parse(localStorage.getItem("orders")) || [];

      const cleanedData = data.map((item) => ({
        ...item,
        price: formatPrice(item.price),
        oldPrice: item.oldPrice ? formatPrice(item.oldPrice) : undefined,
        discount: item.discount ? formatPrice(item.discount) : undefined,
        quantity: parseInt(item.quantity) || 1,
      }));

      setOrder(cleanedData);
      return cleanedData;
    } catch (error) {
      console.error("Error reading order:", error);
      setOrder([]);
      return [];
    }
  }, []);

  const deleteOrder = useCallback(
    (id) => {
      try {
        let data = JSON.parse(localStorage.getItem("orders")) || [];
        data = data.filter((item) => item.id !== id);
        localStorage.setItem("orders", JSON.stringify(data));
        readOrder();
      } catch (error) {
        console.error("Error deleting from order:", error);
      }
    },
    [readOrder],
  );

  const calculateItemTotal = useCallback((item) => {
    const price = formatPrice(item.price);
    const discount = item.discount ? formatPrice(item.discount) : 0;
    const quantity = parseInt(item.quantity) || 1;

    if (discount > 0) {
      const discountedPrice = price * (1 - discount / 100);
      return Math.round(discountedPrice * quantity * 100) / 100;
    }

    return Math.round(price * quantity * 100) / 100;
  }, []);

  const calculateCartTotal = useCallback(() => {
    const items = readOrder();
    return items.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  }, [readOrder, calculateItemTotal]);

  // Функции для избранного
  const addFavorit = useCallback((product) => {
    try {
      let data = JSON.parse(localStorage.getItem("favorit")) || [];

      const existingIndex = data.findIndex((item) => item.id === product.id);

      if (existingIndex === -1) {
        const cleanedProduct = {
          ...product,
          price: formatPrice(product.price),
        };

        data.push(cleanedProduct);
        localStorage.setItem("favorit", JSON.stringify(data));
        readFavorit();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding to favorit:", error);
      return false;
    }
  }, []);

  const readFavorit = useCallback(() => {
    try {
      let data = JSON.parse(localStorage.getItem("favorit")) || [];

      const cleanedData = data.map((item) => ({
        ...item,
        price: formatPrice(item.price),
      }));

      setFavorit(cleanedData);
      return cleanedData;
    } catch (error) {
      console.error("Error reading favorit:", error);
      setFavorit([]);
      return [];
    }
  }, []);

  const deleteFavorit = useCallback(
    (id) => {
      try {
        let data = JSON.parse(localStorage.getItem("favorit")) || [];
        data = data.filter((item) => item.id !== id);
        localStorage.setItem("favorit", JSON.stringify(data));
        readFavorit();
      } catch (error) {
        console.error("Error deleting from favorit:", error);
      }
    },
    [readFavorit],
  );

  // Функции для временной корзины
  const addCard = useCallback((product) => {
    try {
      let data = JSON.parse(localStorage.getItem("card")) || [];

      const cleanedProduct = {
        ...product,
        id: product.id || Date.now().toString(),
        price: formatPrice(product.price),
        quantity: parseInt(product.quantity) || 1,
      };

      data.push(cleanedProduct);
      localStorage.setItem("card", JSON.stringify(data));
      readCard();
      return cleanedProduct;
    } catch (error) {
      console.error("Error adding to card:", error);
      return null;
    }
  }, []);

  const readCard = useCallback(() => {
    try {
      let data = JSON.parse(localStorage.getItem("card")) || [];

      const cleanedData = data.map((item) => ({
        ...item,
        price: formatPrice(item.price),
        quantity: parseInt(item.quantity) || 1,
      }));

      setCard(cleanedData);
      return cleanedData;
    } catch (error) {
      console.error("Error reading card:", error);
      setCard([]);
      return [];
    }
  }, []);

  const deleteCard = useCallback(
    (id) => {
      try {
        let data = JSON.parse(localStorage.getItem("card")) || [];
        data = data.filter((item) => item.id !== id);
        localStorage.setItem("card", JSON.stringify(data));
        readCard();
      } catch (error) {
        console.error("Error deleting from card:", error);
      }
    },
    [readCard],
  );

  // Языковые функции
  const changeLanguage = useCallback((lng) => {
    setCurrentLanguage(lng);
    localStorage.setItem("preferredLanguage", lng);
  }, []);

  // Инициализация приложения
  useEffect(() => {
    isMountedRef.current = true;

    const savedLanguage = localStorage.getItem("preferredLanguage") || "ru";
    setCurrentLanguage(savedLanguage);

    // Загружаем локальные данные
    readOrder();
    readFavorit();
    readCard();

    // Загружаем все продукты только один раз при монтировании
    if (isMountedRef.current && !productsLoadedRef.current) {
      console.log("🚀 Начальная загрузка всех товаров...");
      getAllProducts();
    }

    // Очистка при размонтировании
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Пустой массив зависимостей

  // Мемоизированные значения для контекста
  const values = useMemo(
    () => ({
      // Язык
      currentLanguage,
      changeLanguage,

      // API функции
      getProducts: getAllProducts, // Переименовываем для обратной совместимости
      getOneProduct,
      createProduct,
      deleteProduct,
      updateProduct,
      refreshProducts,

      // Функции редактирования
      setEditingProduct,
      clearEditingProduct,

      // Состояния
      products: state.products,
      oneProduct: state.product,
      editingProduct: state.editingProduct,
      pagination: state.pagination,
      loading: state.loading,
      error: state.error,
      allProductsLoaded: state.allProductsLoaded,

      // Корзина
      order,
      addOrder,
      readOrder,
      deleteOrder,
      calculateItemTotal,
      calculateCartTotal,

      // Избранное
      favorit,
      addFavorit,
      readFavorit,
      deleteFavorit,

      // Временная корзина
      card,
      addCard,
      readCard,
      deleteCard,

      // Очистка ошибки
      clearError: () => {
        dispatch({ type: "CLEAR_ERROR" });
      },
    }),
    [
      currentLanguage,
      changeLanguage,
      getAllProducts,
      getOneProduct,
      createProduct,
      deleteProduct,
      updateProduct,
      refreshProducts,
      setEditingProduct,
      clearEditingProduct,
      state.products,
      state.product,
      state.editingProduct,
      state.pagination,
      state.loading,
      state.error,
      state.allProductsLoaded,
      order,
      addOrder,
      readOrder,
      deleteOrder,
      calculateItemTotal,
      calculateCartTotal,
      favorit,
      addFavorit,
      readFavorit,
      deleteFavorit,
      card,
      addCard,
      readCard,
      deleteCard,
    ],
  );

  return (
    <ProductContext.Provider value={values}>{children}</ProductContext.Provider>
  );
};

export default MainContext;
