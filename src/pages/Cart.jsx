import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp, FREE_SHIPPING_ABOVE } from "../context/AppContext.jsx";
import { rupee } from "../lib/format.js";

export default function Cart() {
  const { cartItems, totals, setQty, coupon, setCoupon, applyCoupon, user } = useApp();
  const [code, setCode] = useState("");
  const nav = useNavigate();

  if (cartItems.length === 0)
    return <p className="empty">Your cart is empty. <Link to="/">Browse products</Link> and add something you like.</p>;

  return (
    <>
      <h1>Your cart</h1>
      <div className="two">
        <ul className="lines">
          {cartItems.map((i) => (
            <li key={i.id}>
              <div className="thumb" style={{ background: i.color }}>{i.emoji}</div>
              <div className="grow">
                <Link to={"/product/" + i.id}><b>{i.name}</b></Link>
                <div className="muted">{rupee(i.price)} each</div>
              </div>
              <div className="qty">
                <button aria-label={"Remove one " + i.name} onClick={() => setQty(i.id, i.qty - 1)}>-</button>
                <span>{i.qty}</span>
                <button aria-label={"Add one " + i.name} onClick={() => setQty(i.id, i.qty + 1)}>+</button>
              </div>
              <b className="amt">{rupee(i.price * i.qty)}</b>
              <button className="link" onClick={() => setQty(i.id, 0)}>Remove</button>
            </li>
          ))}
        </ul>

        <aside className="summary">
          <h2>Order summary</h2>
          <div className="coupon">
            <input placeholder="Coupon code" aria-label="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="btn small" onClick={() => { applyCoupon(code); setCode(""); }}>Apply</button>
          </div>
          {coupon && (
            <p className="ok">Coupon {coupon} applied. <button className="link" onClick={() => setCoupon("")}>Remove</button></p>
          )}
          <p className="muted">Try ALTUZZ10 or SAVE200 (on ₹2000+).</p>
          <div className="sum"><span>Subtotal</span><span>{rupee(totals.subtotal)}</span></div>
          {totals.discount > 0 && <div className="sum ok"><span>Discount</span><span>-{rupee(totals.discount)}</span></div>}
          <div className="sum"><span>Shipping</span><span>{totals.shipping ? rupee(totals.shipping) : "Free"}</span></div>
          {totals.shipping > 0 && <p className="muted">Free shipping above {rupee(FREE_SHIPPING_ABOVE)}.</p>}
          <div className="sum grand"><span>Total</span><span>{rupee(totals.total)}</span></div>
          <button className="btn wide" onClick={() => nav(user ? "/checkout" : "/login", { state: { from: "/checkout" } })}>
            {user ? "Go to checkout" : "Log in to checkout"}
          </button>
        </aside>
      </div>
    </>
  );
}
