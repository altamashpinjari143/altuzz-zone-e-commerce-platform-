import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { CATEGORIES } from "../data/products.js";
import { ORDER_STEPS, rupee } from "../lib/format.js";

const blank = { name: "", category: "Electronics", price: "", mrp: "", stock: "", emoji: "📦", desc: "" };

export default function Admin() {
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useApp();
  const [tab, setTab] = useState("products");
  const [f, setF] = useState(blank);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const valid = f.name.trim() && Number(f.price) > 0 && Number(f.mrp) >= Number(f.price) && Number(f.stock) >= 0 && f.stock !== "";

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    addProduct({ ...f, name: f.name.trim(), price: Number(f.price), mrp: Number(f.mrp), stock: Number(f.stock), color: "#e3e8f7" });
    setF(blank);
  };

  const revenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <>
      <h1>Admin panel</h1>
      <div className="stats">
        <div><b>{products.length}</b><span>Products</span></div>
        <div><b>{orders.length}</b><span>Orders</span></div>
        <div><b>{rupee(revenue)}</b><span>Total sales</span></div>
      </div>
      <div className="chips">
        <button className={tab === "products" ? "chip on" : "chip"} onClick={() => setTab("products")}>Products</button>
        <button className={tab === "orders" ? "chip on" : "chip"} onClick={() => setTab("orders")}>Orders</button>
      </div>

      {tab === "products" ? (
        <>
          <form className="form" onSubmit={submit}>
            <h2>Add a product</h2>
            <div className="pair">
              <label>Name<input value={f.name} onChange={set("name")} /></label>
              <label>Category
                <select value={f.category} onChange={set("category")}>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
            </div>
            <div className="pair">
              <label>Price (₹)<input type="number" min="1" value={f.price} onChange={set("price")} /></label>
              <label>MRP (₹, not less than price)<input type="number" min="1" value={f.mrp} onChange={set("mrp")} /></label>
            </div>
            <div className="pair">
              <label>Stock<input type="number" min="0" value={f.stock} onChange={set("stock")} /></label>
              <label>Emoji icon<input value={f.emoji} onChange={set("emoji")} maxLength={4} /></label>
            </div>
            <label>Description<textarea rows="2" value={f.desc} onChange={set("desc")} /></label>
            <button className="btn" disabled={!valid}>Add product</button>
          </form>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th></th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.emoji} {p.name}</td>
                    <td><input className="mini" type="number" min="1" value={p.price} aria-label={"Price of " + p.name} onChange={(e) => updateProduct(p.id, { price: Number(e.target.value) })} /></td>
                    <td><input className="mini" type="number" min="0" value={p.stock} aria-label={"Stock of " + p.name} onChange={(e) => updateProduct(p.id, { stock: Number(e.target.value) })} /></td>
                    <td><button className="link danger" onClick={() => window.confirm("Delete " + p.name + "?") && deleteProduct(p.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : orders.length === 0 ? (
        <p className="empty">No orders yet. Orders placed by customers will appear here.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}<div className="muted">{new Date(o.date).toLocaleDateString("en-IN")}</div></td>
                  <td>{o.userName}<div className="muted">{o.address.city}</div></td>
                  <td>{rupee(o.total)}</td>
                  <td>
                    <select value={o.status} aria-label={"Status of order " + o.id} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>
                      {ORDER_STEPS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
