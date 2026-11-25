export const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");
export const percentOff = (price, mrp) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);
export const ORDER_STEPS = ["Placed", "Packed", "Shipped", "Delivered"];
