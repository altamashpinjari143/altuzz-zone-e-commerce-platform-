import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { percentOff, rupee } from "../lib/format.js";
import Stars from "./Stars.jsx";

export default function ProductCard({ p }) {
  const { addToCart, toggleWish, wishlist, ratingOf } = useApp();
  const r = ratingOf(p);
  const off = percentOff(p.price, p.mrp);
  const saved = wishlist.includes(p.id);
  return (
    <article className="card">
      <Link to={"/product/" + p.id} className="tile" style={{ background: p.color }} aria-label={"View " + p.name}>
        <span className="emoji">{p.emoji}</span>
        {off > 0 && <span className="off">{off}% off</span>}
      </Link>
      <button className={saved ? "heart on" : "heart"} onClick={() => toggleWish(p.id)} aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}>
        {saved ? "♥" : "♡"}
      </button>
      <div className="body">
        <Link to={"/product/" + p.id}><h3>{p.name}</h3></Link>
        <Stars value={r.avg} count={r.count} />
        <div className="price">
          <strong>{rupee(p.price)}</strong>
          {p.mrp > p.price && <s>{rupee(p.mrp)}</s>}
        </div>
        {p.stock > 0 ? (
          <button className="btn" onClick={() => addToCart(p.id)}>Add to cart</button>
        ) : (
          <button className="btn" disabled>Out of stock</button>
        )}
      </div>
    </article>
  );
}
