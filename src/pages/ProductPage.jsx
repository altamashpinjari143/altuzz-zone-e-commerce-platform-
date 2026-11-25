import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { percentOff, rupee } from "../lib/format.js";
import Stars from "../components/Stars.jsx";

export default function ProductPage() {
  const { id } = useParams();
  const { products, ratingOf, reviewsFor, addReview, addToCart, toggleWish, wishlist, user } = useApp();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const p = products.find((x) => String(x.id) === id);
  if (!p) return <p className="empty">This product is not available anymore. <Link to="/">Back to shop</Link></p>;

  const r = ratingOf(p);
  const reviews = reviewsFor(p.id);
  const saved = wishlist.includes(p.id);

  const submit = (e) => {
    e.preventDefault();
    if (text.trim().length < 5) return;
    addReview(p.id, rating, text.trim());
    setText("");
  };

  return (
    <>
      <Link to="/" className="back">Back to shop</Link>
      <div className="detail">
        <div className="big" style={{ background: p.color }}><span>{p.emoji}</span></div>
        <div>
          <p className="muted">{p.category}</p>
          <h1>{p.name}</h1>
          <Stars value={r.avg} count={r.count} />
          <div className="price lg">
            <strong>{rupee(p.price)}</strong>
            {p.mrp > p.price && <><s>{rupee(p.mrp)}</s><span className="off inline">{percentOff(p.price, p.mrp)}% off</span></>}
          </div>
          <p>{p.desc}</p>
          <p className={p.stock > 0 ? "stock ok" : "stock out"}>
            {p.stock > 0 ? (p.stock <= 5 ? "Only " + p.stock + " left" : "In stock") : "Out of stock"}
          </p>
          <div className="buy">
            <div className="qty">
              <button aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty(Math.min(p.stock || 1, qty + 1))}>+</button>
            </div>
            <button className="btn" disabled={p.stock <= 0} onClick={() => addToCart(p.id, qty)}>Add to cart</button>
            <button className="ghost solid" onClick={() => toggleWish(p.id)}>{saved ? "Saved ♥" : "Save ♡"}</button>
          </div>
        </div>
      </div>

      <section className="reviews">
        <h2>Customer reviews</h2>
        {reviews.length === 0 && <p className="muted">No written reviews yet. Be the first to review this product.</p>}
        {reviews.map((rv) => (
          <div className="review" key={rv.id}>
            <Stars value={rv.rating} />
            <p>{rv.text}</p>
            <small className="muted">{rv.userName}, {new Date(rv.date).toLocaleDateString("en-IN")}</small>
          </div>
        ))}
        {user ? (
          <form className="form" onSubmit={submit}>
            <h3>Write a review</h3>
            <label>Rating
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
              </select>
            </label>
            <label>Your review
              <textarea rows="3" value={text} onChange={(e) => setText(e.target.value)} placeholder="What did you like or dislike?" />
            </label>
            <button className="btn" disabled={text.trim().length < 5}>Post review</button>
          </form>
        ) : (
          <p><Link to="/login" state={{ from: "/product/" + p.id }}>Log in</Link> to write a review.</p>
        )}
      </section>
    </>
  );
}
