import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { rupee } from "../lib/format.js";

const validate = (f) => {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Enter your full name.";
  if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = "Enter a valid 10-digit mobile number.";
  if (f.address.trim().length < 10) e.address = "Enter your full address (house, street, area).";
  if (f.city.trim().length < 2) e.city = "Enter your city.";
  if (!/^\d{6}$/.test(f.pincode)) e.pincode = "Enter a 6-digit pincode.";
  return e;
};

export default function Checkout() {
  const { user, cartItems, totals, placeOrder, toast } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ name: user.name, phone: "", address: "", city: "", pincode: "" });
  const [pay, setPay] = useState("COD");
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);

  if (cartItems.length === 0)
    return <p className="empty">Your cart is empty. <Link to="/">Add products</Link> before checkout.</p>;

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const finish = () => {
    const order = placeOrder(f, pay);
    toast("Order " + order.id + " placed");
    nav("/orders");
  };

  const submit = (e) => {
    e.preventDefault();
    const er = validate(f);
    setErrors(er);
    if (Object.keys(er).length) return;
    if (pay === "COD") finish();
    else setPaying(true);
  };

  const field = (k, label, props = {}) => (
    <label>
      {label}
      <input value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} {...props} />
      {errors[k] && <span className="err">{errors[k]}</span>}
    </label>
  );

  return (
    <>
      <h1>Checkout</h1>
      <div className="two">
        <form className="form" onSubmit={submit} noValidate>
          <h2>Delivery address</h2>
          {field("name", "Full name")}
          {field("phone", "Mobile number", { inputMode: "numeric", maxLength: 10 })}
          <label>
            Address
            <textarea rows="3" value={f.address} onChange={set("address")} aria-invalid={!!errors.address} />
            {errors.address && <span className="err">{errors.address}</span>}
          </label>
          <div className="pair">
            {field("city", "City")}
            {field("pincode", "Pincode", { inputMode: "numeric", maxLength: 6 })}
          </div>

          <h2>Payment</h2>
          {[
            ["COD", "Cash on delivery"],
            ["UPI", "UPI (demo payment)"],
            ["Card", "Debit / Credit card (demo payment)"],
          ].map(([v, l]) => (
            <label key={v} className="radio">
              <input type="radio" name="pay" checked={pay === v} onChange={() => setPay(v)} /> {l}
            </label>
          ))}
          <button className="btn wide">{pay === "COD" ? "Place order" : "Continue to payment"}</button>
        </form>

        <aside className="summary">
          <h2>Your items</h2>
          {cartItems.map((i) => (
            <div className="sum" key={i.id}><span>{i.emoji} {i.name} x {i.qty}</span><span>{rupee(i.price * i.qty)}</span></div>
          ))}
          {totals.discount > 0 && <div className="sum ok"><span>Discount</span><span>-{rupee(totals.discount)}</span></div>}
          <div className="sum"><span>Shipping</span><span>{totals.shipping ? rupee(totals.shipping) : "Free"}</span></div>
          <div className="sum grand"><span>Total</span><span>{rupee(totals.total)}</span></div>
        </aside>
      </div>

      {paying && (
        <div className="modal-wrap" role="dialog" aria-modal="true" aria-label="Demo payment">
          <div className="modal">
            <h2>Demo payment</h2>
            <p className="muted">This simulates a payment gateway like Razorpay test mode. No money is charged.</p>
            <div className="sum grand"><span>Pay by {pay}</span><span>{rupee(totals.total)}</span></div>
            <button className="btn wide" onClick={finish}>Pay {rupee(totals.total)}</button>
            <button className="ghost solid wide" onClick={() => setPaying(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
