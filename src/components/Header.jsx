import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Header() {
  const { user, logout, cartCount, wishlist, theme, setTheme } = useApp();
  const nav = useNavigate();
  return (
    <header className="top">
      <Link to="/" className="logo">Altuzz<span> Zone</span></Link>
      <nav className="links">
        <NavLink to="/" end>Shop</NavLink>
        <NavLink to="/wishlist">Wishlist ({wishlist.length})</NavLink>
        {user && <NavLink to="/orders">Orders</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        <NavLink to="/cart">Cart <span className="badge">{cartCount}</span></NavLink>
      </nav>
      <div className="actions">
        <button className="ghost" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
        {user ? (
          <button className="ghost" onClick={() => { logout(); nav("/"); }}>Log out ({user.name.split(" ")[0]})</button>
        ) : (
          <Link className="ghost" to="/login">Log in</Link>
        )}
      </div>
    </header>
  );
}
