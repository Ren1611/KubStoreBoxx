import React, { createContext, useContext, useReducer, useState } from "react";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);

const API = "https://api-crud.elcho.dev/api/v1/90c7e-fe326-a4f13/kuba";

const initialState = {
  products: [],
  product: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "GET_PRODUCTS":
      return { ...state, products: action.payload };
    case "GET_ONE_PRODUCT":
      return { ...state, product: action.payload };
    case "ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

const MainContext = ({ children }) => {
  const [product, setProduct] = useState([]);
  const [order, setOrder] = useState([]);
  const [card, setCard] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const googleProvider = new GoogleAuthProvider();

  async function signUpWithGoogle() {
    try {
      await signInWithPopup(googleProvider);
    } catch (error) {
      console.log("error" + error.massege);
    }
  }

  async function reducer2(email, password) {
    return createUserWithEmailAndPassword(email, password);
  }

  async function getProduts() {
    setLoading(true);
    setError(null);
    try {
      let { data } = await axios.get(API);
      dispatch({
        type: "GET_PRODUCTS",
        payload: data.data,
      });
    } catch (e) {
      console.error("getProduts error", e);
      setError(e.message);
      dispatch({
        type: "ERROR",
        payload: e.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function getOneProduct(id) {
    setLoading(true);
    setError(null);
    try {
      let { data } = await axios.get(`${API}/${id}`);
      dispatch({
        type: "GET_ONE_PRODUCT",
        payload: data.data,
      });
    } catch (e) {
      console.error("getOneProduct error", e);
      setError(e.message);
      dispatch({
        type: "ERROR",
        payload: e.message,
      });
    } finally {
      setLoading(false);
    }
  }
  async function createProduct(newProduct) {
    setLoading(true);
    setError(null);
    try {
      await axios.post(API, newProduct);
      getProduts();
    } catch (e) {
      console.error("createProduct error", e);
      setError(e.message);
      dispatch({
        type: "ERROR",
        payload: e.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API}/${id}`);
      getProduts();
    } catch (e) {
      console.error("deleteProduct error", e);
      setError(e.message);
      dispatch({
        type: "ERROR",
        payload: e.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const addTask = (newTask) => {
    let data = JSON.parse(localStorage.getItem("p")) || [];
    data.push(newTask);
    localStorage.setItem("p", JSON.stringify(data));
  };

  const readTask = () => {
    let data = JSON.parse(localStorage.getItem("p")) || [];
    setProduct(data);
  };

  const deleteTask = (id) => {
    let data = JSON.parse(localStorage.getItem("p")) || [];
    data = data.filter((item) => item.id !== id);
    localStorage.setItem("p", JSON.stringify(data));
    readTask();
  };

  const addOrder = (newTask) => {
    let data = JSON.parse(localStorage.getItem("orders")) || [];
    data.push(newTask);
    localStorage.setItem("orders", JSON.stringify(data));
    readOrder();
  };

  const readOrder = () => {
    let data = JSON.parse(localStorage.getItem("orders")) || [];
    setOrder(data);
  };

  const deleteOrder = (id) => {
    let data = JSON.parse(localStorage.getItem("orders")) || [];
    data = data.filter((item) => item.id !== id);
    localStorage.setItem("orders", JSON.stringify(data));
    readOrder();
  };
  const addCard = (newTask) => {
    let data = JSON.parse(localStorage.getItem("card")) || [];
    data.push(newTask);
    localStorage.setItem("card", JSON.stringify(data));
    readCard();
  };

  const readCard = () => {
    let data = JSON.parse(localStorage.getItem("card")) || [];
    setCard(data);
  };

  const deleteCard = (id) => {
    let data = JSON.parse(localStorage.getItem("card")) || [];
    data = data.filter((item) => item.id !== id);
    localStorage.setItem("card", JSON.stringify(data));
    readCard();
  };

  const valus = {
    product,
    deleteTask,
    addTask,
    readTask,
    getProduts,
    getOneProduct,
    deleteProduct,
    createProduct,
    products: state.products,
    product: state.product,
    loading,
    error,
    reducer2,
    signUpWithGoogle,
    order,
    readOrder,
    deleteOrder,
    addOrder,
    deleteCard,
    readCard,
    addCard,
    card,
  };
  return (
    <ProductContext.Provider value={valus}>{children}</ProductContext.Provider>
  );
};

export default MainContext;
