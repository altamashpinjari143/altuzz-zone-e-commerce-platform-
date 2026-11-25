import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useApp } from "./context/AppContext.jsx";
import Header from "./components/Header.jsx";
import Toasts from "./components/Toasts.jsx";
import Shop from "./pages/Shop.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Orders from "./pages/Orders.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Admin from "./pages/Admin.jsx";

// Login ke bina ye pages nahi khulenge
function Protected({ children, admin }) {
  const { user } = useApp();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
          <Route path="/orders" element={<Protected><Orders /></Protected>} />
          <Route path="/admin" element={<Protected admin><Admin /></Protected>} />
          <Route path="*" element={<p className="empty">Page not found. <a href="#/">Go to the shop</a>.</p>} />
        </Routes>
      </main>
      <footer className="foot">Altuzz Zone is a demo store. No real payments or deliveries.</footer>
      <Toasts />
    </>
  );
}
