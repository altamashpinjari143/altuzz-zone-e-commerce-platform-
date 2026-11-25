import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SEED_PRODUCTS } from "../data/products.js";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export const SHIPPING_FEE = 49;
export const FREE_SHIPPING_ABOVE = 499;
export const COUPONS = {
  ALTUZZ10: { type: "percent", value: 10, min: 0, label: "10% off" },
  SAVE200: { type: "flat", value: 200, min: 2000, label: "₹200 off on orders above ₹2000" },
};

// localStorage me data save karne wala chhota hook (ye hamara "fake backend" hai)
function useLocal(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return typeof initial === "function" ? initial() : initial;
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

const SEED_USERS = [
  { id: "u-admin", name: "Admin", email: "admin@altuzz.com", password: "admin123", role: "admin" },
];

export function AppProvider({ children }) {
  const [products, setProducts] = useLocal("az-products", SEED_PRODUCTS);
  const [users, setUsers] = useLocal("az-users", SEED_USERS);
  const [sessionId, setSessionId] = useLocal("az-session", null);
  const [cart, setCart] = useLocal("az-cart", {});
  const [wishlist, setWishlist] = useLocal("az-wishlist", []);
  const [orders, setOrders] = useLocal("az-orders", []);
  const [reviews, setReviews] = useLocal("az-reviews", []);
  const [coupon, setCoupon] = useLocal("az-coupon", "");
  const [theme, setTheme] = useLocal("az-theme", "light");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toast = useCallback((msg) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const user = users.find((u) => u.id === sessionId) || null;

  // ---------- Auth ----------
  const signup = (name, email, password) => {
    const e = email.trim().toLowerCase();
    if (users.some((u) => u.email === e)) return { ok: false, error: "This email is already registered. Please log in." };
    const u = { id: "u-" + Date.now(), name: name.trim(), email: e, password, role: "customer" };
    setUsers([...users, u]);
    setSessionId(u.id);
    return { ok: true };
  };
  const login = (email, password) => {
    const u = users.find((x) => x.email === email.trim().toLowerCase() && x.password === password);
    if (!u) return { ok: false, error: "Email or password is wrong. Please check and try again." };
    setSessionId(u.id);
    return { ok: true };
  };
  const logout = () => {
    setSessionId(null);
    toast("Logged out");
  };

  // ---------- Ratings / reviews ----------
  const reviewsFor = (productId) => reviews.filter((r) => r.productId === productId);
  const ratingOf = (p) => {
    const rs = reviewsFor(p.id);
    const sum = p.rating * p.ratingCount + rs.reduce((s, r) => s + r.rating, 0);
    const n = p.ratingCount + rs.length;
    return { avg: n ? sum / n : p.rating, count: n };
  };
  const addReview = (productId, rating, text) => {
    setReviews([...reviews, { id: Date.now(), productId, rating, text, userName: user.name, date: new Date().toISOString() }]);
    toast("Thanks for your review!");
  };

  // ---------- Cart ----------
  const addToCart = (id, qty = 1) => {
    const p = products.find((x) => x.id === id);
    if (!p || p.stock <= 0) return toast("This product is out of stock");
    const next = Math.min((cart[id] || 0) + qty, p.stock);
    setCart({ ...cart, [id]: next });
    toast(p.name + " added to cart");
  };
  const setQty = (id, qty) => {
    const p = products.find((x) => x.id === id);
    const q = Math.min(qty, p ? p.stock : qty);
    const next = { ...cart };
    if (q <= 0) delete next[id];
    else next[id] = q;
    setCart(next);
  };

  const cartItems = useMemo(
    () => products.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] })),
    [products, cart]
  );
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const c = COUPONS[coupon];
    let discount = 0;
    if (c && subtotal >= c.min) discount = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
    const after = subtotal - discount;
    const shipping = subtotal === 0 || after >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
    return { subtotal, discount, shipping, total: after + shipping };
  }, [cartItems, coupon]);

  const applyCoupon = (code) => {
    const c = code.trim().toUpperCase();
    if (!COUPONS[c]) return toast("Invalid coupon code");
    if (totals.subtotal < COUPONS[c].min) return toast("Coupon needs " + COUPONS[c].label);
    setCoupon(c);
    toast("Coupon " + c + " applied");
  };

  // ---------- Wishlist ----------
  const toggleWish = (id) => {
    const has = wishlist.includes(id);
    setWishlist(has ? wishlist.filter((x) => x !== id) : [...wishlist, id]);
    toast(has ? "Removed from wishlist" : "Saved to wishlist");
  };

  // ---------- Orders ----------
  const placeOrder = (address, payment) => {
    const order = {
      id: "AZ" + Date.now().toString().slice(-8),
      userId: user.id,
      userName: user.name,
      items: cartItems.map((i) => ({ id: i.id, name: i.name, emoji: i.emoji, price: i.price, qty: i.qty })),
      ...totals,
      coupon: totals.discount ? coupon : "",
      address,
      payment,
      status: "Placed",
      date: new Date().toISOString(),
    };
    setOrders([order, ...orders]);
    setProducts(products.map((p) => (cart[p.id] ? { ...p, stock: Math.max(0, p.stock - cart[p.id]) } : p)));
    setCart({});
    setCoupon("");
    return order;
  };
  const updateOrderStatus = (id, status) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    toast("Order " + id + " is now " + status);
  };

  // ---------- Admin: products ----------
  const addProduct = (p) => {
    setProducts([...products, { ...p, id: Date.now(), rating: 4, ratingCount: 0 }]);
    toast("Product added");
  };
  const updateProduct = (id, patch) => setProducts(products.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    const next = { ...cart };
    delete next[id];
    setCart(next);
    toast("Product deleted");
  };

  const value = {
    products, user, signup, login, logout,
    reviewsFor, ratingOf, addReview,
    cart, cartItems, cartCount, totals, coupon, setCoupon, addToCart, setQty, applyCoupon,
    wishlist, toggleWish,
    orders, placeOrder, updateOrderStatus,
    addProduct, updateProduct, deleteProduct,
    theme, setTheme, toasts, toast,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
