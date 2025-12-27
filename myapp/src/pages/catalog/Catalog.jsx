import React, { useEffect, useState } from "react";
import scss from "./Catalog.module.scss";
import { useProduct } from "../../MainContext/MainContext";

const Catalog = () => {
  const { getProduts, products, loading, addCard, addOrder } = useProduct();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  // filter state
  const [inStock, setInStock] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState(new Set());

  // categories (auto-detected from product fields, fallback to default list)
  const defaultCategories = [
    "Мотошлемы",
    "Мотоэкипировка",
    "Моторасходники и З/Ч",
    "Моторезина",
    "Тюнинг и Аксессуары",
    "Мотохимия",
    "Уцененные товары",
    "Зимняя экипировка",
  ];
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getProduts();
  }, []);

  useEffect(() => {
    if (!products) return;
    const b = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
    setBrands(b);

    // Try to detect category-like fields in products
    const cats = new Set();
    products.forEach((p) => {
      const c = p.category || p.categories || p.type || p.group || p.collection;
      if (Array.isArray(c)) c.forEach((x) => x && cats.add(x));
      else if (c) cats.add(c);
    });

    const catArray = Array.from(cats);
    if (catArray.length > 0) setCategories(catArray);
    else if (b.length > 0 && categories === defaultCategories) setCategories(b); // fallback to brands if no categories found
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  useEffect(() => {
    if (!products) return;
    const q = query.trim().toLowerCase();

    const res = products.filter((p) => {
      const title = (p.title || p.name || p.brand || "")
        .toString()
        .toLowerCase();
      if (q && !title.includes(q)) return false;
      if (inStock && !p.inStock) return false;
      if (discountOnly && !p.discount) return false;
      if (selectedBrands.size > 0 && !selectedBrands.has(p.brand)) return false;

      // category filter: match detected category fields or fallback to brand
      if (selectedCategory) {
        const c =
          p.category || p.categories || p.type || p.group || p.collection;
        let matches = false;
        if (Array.isArray(c)) matches = c.includes(selectedCategory);
        else if (c) matches = c === selectedCategory;
        if (!matches && p.brand !== selectedCategory) return false;
      }

      return true;
    });

    setFiltered(res);
  }, [
    products,
    query,
    inStock,
    discountOnly,
    selectedBrands,
    selectedCategory,
  ]);

  const toggleBrand = (b) => {
    const copy = new Set(selectedBrands);
    if (copy.has(b)) copy.delete(b);
    else copy.add(b);
    setSelectedBrands(copy);
  };

  const clearFilters = () => {
    setQuery("");
    setInStock(false);
    setDiscountOnly(false);
    setSelectedBrands(new Set());
    setSelectedCategory(null);
  };

  return (
    <div className={scss.catalog}>
      <div className="container">
        <div className={scss.catalogInner}>
          <aside className={scss.sidebar}>
            <h3 className={scss.title}>Категории</h3>
            <ul className={scss.catList}>
              {categories.map((c) => (
                <li
                  key={c}
                  className={selectedCategory === c ? scss.activeCategory : ""}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === c ? null : c)
                  }
                >
                  {c}
                </li>
              ))}
            </ul>
            <div className={scss.filterBlock}>
              <div className={scss.filterHeader}>
                <h4>Фильтр</h4>
                <button className={scss.clear} onClick={clearFilters}>
                  Очистить
                </button>
              </div>

              <label className={scss.searchLabel}>
                <span>Поиск</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Найти товар..."
                />
              </label>

              <div className={scss.checks}>
                <label className={scss.customCheck}>
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={() => setInStock(!inStock)}
                  />
                  <span>В наличии</span>
                </label>
                <label className={scss.customCheck}>
                  <input
                    type="checkbox"
                    checked={discountOnly}
                    onChange={() => setDiscountOnly(!discountOnly)}
                  />
                  <span>Только со скидкой</span>
                </label>
              </div>

              <div className={scss.brandSection}>
                <div className={scss.brandTitle}>Бренды</div>
                <ul className={scss.brandList}>
                  {brands.length === 0 && (
                    <li className={scss.brandEmpty}>Нет брендов</li>
                  )}
                  {brands.map((b) => (
                    <li key={b} className={scss.brandItem}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedBrands.has(b)}
                          onChange={() => toggleBrand(b)}
                        />
                        <span>{b}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <main className={scss.main}>
            <div className={scss.controls}>
              <div>
                <strong>{filtered.length}</strong> товаров
              </div>
              <div className={scss.sort}>
                Сортировать:
                <select>
                  <option>По умолчанию</option>
                  <option>По цене</option>
                </select>
              </div>
            </div>

            <section className={scss.grid}>
              {loading ? (
                <div className={scss.loading}>Загрузка...</div>
              ) : (
                filtered.map((p, index, item) => (
                  <article key={index} className={scss.card}>
                    <div className={scss.thumb}>
                      <img src={p.image} alt={p.title || p.name} />
                    </div>
                    <div className={scss.info}>
                      <h4 className={scss.name}>{p.title}</h4>
                      <div className={scss.priceRow}>
                        <div className={scss.price}>{p.price} $</div>
                      </div>
                    </div>
                    <div className={scss.actions}>
                      <button
                        onClick={() => {
                          addOrder({ ...item });
                        }}
                        className={scss.add}
                      >
                        В корзину
                      </button>
                      <button className={scss.view}>Подробнее</button>
                    </div>
                  </article>
                ))
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
