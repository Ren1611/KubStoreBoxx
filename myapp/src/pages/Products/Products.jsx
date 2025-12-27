import React, { useEffect, useState } from "react";
import { useProduct } from "../../MainContext/MainContext";
import scss from "./Products.module.scss";

const Products = () => {
  const { getProduts, createProduct, deleteProduct, products } = useProduct();
  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    brand: "",
    category: "",
    count: "",
  });

  useEffect(() => {
    getProduts();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    createProduct(form);
    setForm({
      title: "",
      price: "",
      image: "",
      brand: "",
      category: "",
      count: "",
    });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <>
      <div className={scss.inp}>
        <form onSubmit={handleSubmit}>
          <input
            value={form.title}
            name="title"
            onChange={handleChange}
            type="text"
            placeholder="Name"
          />
          <input
            value={form.price}
            name="price"
            onChange={handleChange}
            type="number"
            placeholder="Price"
          />
          <input
            value={form.brand}
            name="brand"
            onChange={handleChange}
            type="text"
            placeholder="Brand"
          />
          <input
            value={form.category}
            name="category"
            onChange={handleChange}
            type="text"
            placeholder="Category"
          />
          <input
            value={form.image}
            name="image"
            onChange={handleChange}
            type="text"
            placeholder="URL"
          />
          <input
            value={form.count}
            name="count"
            onChange={handleChange}
            type="number"
            placeholder="count"
          />

          <button onClick={() => handleSubmit}>create</button>
        </form>
      </div>
      {/* <div className={scss.products}>
        {products.map((item, index) => (
          <>
            <div key={index} className={scss.blog}>
              <h1>{item.title}</h1>
              <h2>{item.price} $</h2>
              {item.image && <img src={item.image} alt="" />} <br />
              <button onClick={() => deleteProduct(item._id)}>delete</button>
            </div>
          </>
        ))}
      </div> */}
    </>
  );
};

export default Products;
