# Altuzz Zone

Ek full-featured e-commerce frontend, **React + Vite + React Router** se bana hua.

## Features
- Product listing: category filter, debounced search, sorting, price filter, loading skeleton
- Product details page with ratings and reviews
- Cart (Context API), coupon codes (`ALTUZZ10`, `SAVE200`), shipping fee logic
- Wishlist
- Login / Signup with protected routes
- Checkout form with validation, demo payment step
- Order history with order tracking (Placed, Packed, Shipped, Delivered)
- Admin panel: add/edit/delete products, update order status
- Dark mode, toast notifications, responsive design

## Demo admin login
`admin@altuzz.com` / `admin123`

## Important
Abhi backend nahi hai. Saara data (users, orders, products) browser ke **localStorage** me save hota hai.
Isliye passwords plain text me hain aur payment sirf demo hai. Real project ke liye:
Node + Express + MySQL backend, bcrypt + JWT, aur Razorpay (server se order create karke) lagana hoga.

## Run locally
```bash
npm install
npm run dev
```

## Deploy (GitHub Pages)
1. Code `main` branch pe push karo
2. Repo Settings > Pages > Source: **GitHub Actions**
3. Workflow chalte hi site live ho jayegi
