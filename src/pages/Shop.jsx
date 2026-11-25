import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { CATEGORIES } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import { rupee } from "../lib/format.js";

export default function Shop() {
  const { products, ratingOf } = useApp();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(5000);

  // Fake loading (skeleton dikhane ke liye). Real API aane par yahan fetch hoga.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Debounce: user ruk jaye tab hi search chale
  useEffect(() => {
    const t = setTimeout(() => setSearch(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const list = useMemo(() => {
    let l = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        p.price <= maxPrice &&
        p.name.toLowerCase().includes(search.trim().toLowerCase())
    );
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => ratingOf(b).avg - ratingOf(a).avg);
    return l;
  }, [products, category, search, sort, maxPrice]);

  return (
    <>
      <section className="hero">
        <h1>Everything you need, in one zone.</h1>
        <p>Electronics, fashion, home and accessories at honest prices. Use code <b>ALTUZZ10</b> for 10% off your first order.</p>
      </section>

      <div className="filters">
        <div className="chips">
          {CATEGORIES.map((c) => (
            <button key={c} className={category === c ? "chip on" : "chip"} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <div className="tools">
          <input type="search" placeholder="Search products" aria-label="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
          <select aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Sort: Featured</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
            <option value="rating">Top rated</option>
          </select>
          <label className="range">
            Up to {rupee(maxPrice)}
            <input type="range" min="200" max="5000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="grid">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" />)}
        </div>
      ) : list.length === 0 ? (
        <p className="empty">No products match your filters. Try a higher price limit or another category.</p>
      ) : (
        <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </>
  );
}
