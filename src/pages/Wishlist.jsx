import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Wishlist() {
  const { products, wishlist } = useApp();
  const items = products.filter((p) => wishlist.includes(p.id));
  if (items.length === 0)
    return <p className="empty">Your wishlist is empty. Tap the heart on any product to save it. <Link to="/">Browse products</Link></p>;
  return (
    <>
      <h1>Your wishlist</h1>
      <div className="grid">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </>
  );
}
