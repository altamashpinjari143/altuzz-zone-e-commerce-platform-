import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { rupee } from "../lib/format.js";
import Tracker from "../components/Tracker.jsx";

export default function Orders() {
  const { orders, user } = useApp();
  const mine = orders.filter((o) => o.userId === user.id);

  if (mine.length === 0)
    return <p className="empty">You have no orders yet. <Link to="/">Start shopping</Link>.</p>;

  return (
    <>
      <h1>Your orders</h1>
      {mine.map((o) => (
        <section className="order" key={o.id}>
          <div className="order-head">
            <div><b>Order {o.id}</b><div className="muted">{new Date(o.date).toLocaleString("en-IN")}</div></div>
            <div className="right"><b>{rupee(o.total)}</b><div className="muted">{o.payment === "COD" ? "Cash on delivery" : "Paid by " + o.payment + " (demo)"}</div></div>
          </div>
          <Tracker status={o.status} />
          <ul className="plain">
            {o.items.map((i) => <li key={i.id}>{i.emoji} {i.name} x {i.qty} <span className="muted">({rupee(i.price * i.qty)})</span></li>)}
          </ul>
          <p className="muted">Deliver to: {o.address.name}, {o.address.address}, {o.address.city} - {o.address.pincode}</p>
        </section>
      ))}
    </>
  );
}
