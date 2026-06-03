// import React, { useEffect, useMemo, useState } from "react";
// import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// const formatCurrency = (n) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//   }).format(n);

// const CartPage = () => {
//   const navigate = useNavigate();

//   const [cart, setCart] = useState([]);

//   useEffect(() => {
//     const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCart(savedCart);
//   }, []);

//   console.log(cart);

//   const syncCart = (updatedCart) => {
//     setCart(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   const totals = useMemo(() => {
//     const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
//     const original = cart.reduce((sum, item) => sum + item.mrp * item.qty, 0);
//     const discount = original - subtotal;
//     const delivery = subtotal > 699 || subtotal === 0 ? 0 : 49;
//     const total = subtotal + delivery;
//     return { subtotal, original, discount, delivery, total };
//   }, [cart]);

//   const updateQty = (id, delta) => {
//     const updatedCart = cart.map((item) =>
//       item._id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
//     );
//     syncCart(updatedCart);
//   };

//   const removeItem = (id) => {
//     const updatedCart = cart.filter((item) => item._id !== id);
//     syncCart(updatedCart);
//   };

//   const clearCart = () => syncCart([]);

//   const handlePlaceOrder = () => {
//     const token = localStorage.getItem("token");

//     console.log("TOKEN:", token);

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const orders = JSON.parse(localStorage.getItem("orders")) || [];

//     const updateOrders = [...orders, ...cart];

//     localStorage.setItem("orders", JSON.stringify(updateOrders));

//     // clear cart

//     localStorage.removeItem("cart");
//     setCart([]);
//     console.log("Order Place successfully ");
//   };

//   return (
//     <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-8 text-gray-100">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6 gap-4">
//           <div className="flex items-center gap-3">
//             <FiShoppingCart className="text-2xl text-amber-300" />
//             <div>
//               <h1 className="text-2xl font-bold text-[#dbf8fa]">Your Cart</h1>
//               <p className="text-sm text-gray-400">
//                 {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
//               </p>
//             </div>
//           </div>

//           {cart.length > 0 && (
//             <button
//               onClick={clearCart}
//               className="text-xs md:text-sm px-3 py-2 bg-transparent border border-red-700 text-red-300 rounded hover:bg-red-900/10"
//             >
//               Clear Cart
//             </button>
//           )}
//         </div>

//         {cart.length === 0 ? (
//           <div className="bg-[#122125] rounded-xl p-8 text-center">
//             <p className="text-lg text-[#dbf8fa] mb-2">Your cart is empty 🛒</p>
//             <p className="text-sm text-gray-400">
//               Add some books to see them here.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Cart items */}
//             <div className="lg:col-span-2 space-y-4">
//               {cart.map((item) => (
//                 <div
//                   key={item._id}
//                   className="bg-[#122125] rounded-xl p-4 flex gap-4 shadow-md"
//                 >
//                   <img
//                     src={`http://localhost:5000/${item.coverPhoto}`}
//                     alt={item.name}
//                     className="w-24 h-32 object-cover rounded-lg border border-gray-700"
//                   />

//                   <div className="flex-1 flex flex-col justify-between">
//                     <div>
//                       <h2 className="text-sm md:text-base font-semibold text-[#dbf8fa]">
//                         {item.name}
//                       </h2>
//                       <p className="text-xs text-gray-400 mb-1">
//                         by {item.author?.[0]?.name || "N/A"}
//                       </p>

//                       <div className="flex items-center gap-3 mt-1">
//                         <span className="text-base font-semibold text-amber-300">
//                           {formatCurrency(item.price)}
//                         </span>
//                         <span className="text-xs line-through text-gray-500">
//                           {formatCurrency(item.mrp)}
//                         </span>
//                         <span className="text-xs text-green-400">
//                           Save{" "}
//                           {formatCurrency(
//                             item.mrp * item.qty - item.price * item.qty,
//                           )}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between mt-3">
//                       {/* Qty controls */}
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => updateQty(item._id, -1)}
//                           className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-700 hover:bg-gray-800"
//                         >
//                           <FiMinus />
//                         </button>
//                         <span className="w-8 text-center text-sm">
//                           {item.qty}
//                         </span>
//                         <button
//                           onClick={() => updateQty(item._id, 1)}
//                           className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-700 hover:bg-gray-800"
//                         >
//                           <FiPlus />
//                         </button>
//                       </div>

//                       <button
//                         onClick={() => removeItem(item._id)}
//                         className="flex items-center gap-1 text-xs text-red-300 hover:text-red-400"
//                       >
//                         <FiTrash2 />
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Summary */}
//             <div className="lg:col-span-1">
//               <div className="bg-[#122125] rounded-xl p-5 shadow-md">
//                 <h2 className="text-lg font-semibold text-[#dbf8fa] mb-4">
//                   Price Details
//                 </h2>

//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-300">
//                       Price ({cart.length} items)
//                     </span>
//                     <span className="text-gray-200">
//                       {formatCurrency(totals.original)}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-gray-300">Discount</span>
//                     <span className="text-green-400">
//                       -{formatCurrency(totals.discount)}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-gray-300">Delivery Charges</span>
//                     <span className="text-gray-200">
//                       {totals.delivery === 0 ? (
//                         <span className="text-green-400">Free</span>
//                       ) : (
//                         formatCurrency(totals.delivery)
//                       )}
//                     </span>
//                   </div>

//                   <div className="border-t border-gray-700 my-3"></div>

//                   <div className="flex justify-between">
//                     <span className="text-sm font-semibold text-[#dbf8fa]">
//                       Total Amount
//                     </span>
//                     <span className="text-sm font-semibold text-amber-300">
//                       {formatCurrency(totals.total)}
//                     </span>
//                   </div>

//                   {totals.discount > 0 && (
//                     <p className="text-xs text-green-400 mt-2">
//                       You will save {formatCurrency(totals.discount)} on this
//                       order
//                     </p>
//                   )}
//                 </div>

//                 <button
//                   onClick={handlePlaceOrder}
//                   className="w-full mt-5 py-2.5 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-500 transition"
//                 >
//                   Place Order
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartPage;

import React, { useEffect, useMemo, useState } from "react";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n,
  );

// ─── SKELETON ─────────────────────────────────────────────────────────────────

const SkeletonItem = () => (
  <div className="bg-[#162428] rounded-2xl p-4 flex gap-4 animate-pulse border border-[#1f3a3e]">
    <div className="w-24 h-32 rounded-xl bg-[#1f3338] flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-3 py-1">
      <div className="h-4 w-2/3 bg-[#1f3338] rounded-full" />
      <div className="h-3 w-1/3 bg-[#1f3338] rounded-full" />
      <div className="h-4 w-1/2 bg-[#1f3338] rounded-full mt-2" />
      <div className="flex gap-2 mt-auto">
        <div className="h-8 w-24 bg-[#1f3338] rounded-full" />
        <div className="h-8 w-16 bg-[#1f3338] rounded-xl ml-auto" />
      </div>
    </div>
  </div>
);

// ─── CART ITEM ────────────────────────────────────────────────────────────────

const CartItem = ({ item, onUpdate, onRemove }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="group bg-[#162428] rounded-2xl p-4 flex gap-4 border border-[#1f3a3e] hover:border-amber-300/20 hover:shadow-[0_4px_20px_rgba(0,200,220,0.07)] transition-all duration-300">
      {/* Cover */}
      <div className="relative w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-[#1f3338]">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[#1f3338] animate-pulse" />
        )}
        <img
          src={`http://localhost:5000/${item.coverPhoto}`}
          alt={item.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h2 className="text-sm font-semibold text-[#e8f8fa] truncate">
            {item.name}
          </h2>
          <p className="text-xs text-[#4a8a92] mt-0.5">
            by {item.author?.[0]?.name || "N/A"}
          </p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-base font-bold text-amber-300">
              {formatCurrency(item.price)}
            </span>
            <span className="text-xs line-through text-[#2a5a62]">
              {formatCurrency(item.mrp)}
            </span>
            {item.mrp > item.price && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-medium">
                Save {formatCurrency((item.mrp - item.price) * item.qty)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Qty controls */}
          <div className="flex items-center gap-2 bg-[#0e1a1c] border border-[#1f3a3e] rounded-full px-2 py-1">
            <button
              onClick={() => onUpdate(item._id, -1)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#1f3338] text-[#4a8a92] hover:text-amber-300 transition"
            >
              <FiMinus className="text-xs" />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-[#dbf8fa]">
              {item.qty}
            </span>
            <button
              onClick={() => onUpdate(item._id, 1)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#1f3338] text-[#4a8a92] hover:text-amber-300 transition"
            >
              <FiPlus className="text-xs" />
            </button>
          </div>

          <button
            onClick={() => onRemove(item._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition cursor-pointer"
          >
            <FiTrash2 className="text-xs" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    setLoading(false);
  }, []);

  const syncCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const original = cart.reduce((sum, item) => sum + item.mrp * item.qty, 0);
    const discount = original - subtotal;
    const delivery = subtotal > 699 || subtotal === 0 ? 0 : 49;
    const total = subtotal + delivery;
    return { subtotal, original, discount, delivery, total };
  }, [cart]);

  const updateQty = (id, delta) => {
    syncCart(
      cart.map((item) =>
        item._id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id) => syncCart(cart.filter((item) => item._id !== id));
  const clearCart = () => syncCart([]);

  const handlePlaceOrder = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([...orders, ...cart]));
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-10 py-10 text-[#e8f8fa]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center">
              <FiShoppingCart className="text-xl text-amber-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#dbf8fa] tracking-tight">
                Your Cart
              </h1>
              <p className="text-sm text-[#4a8a92] mt-0.5">
                {loading
                  ? "Loading..."
                  : `${cart.length} item${cart.length !== 1 ? "s" : ""} in your cart`}
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/15 transition cursor-pointer"
            >
              <FiTrash2 /> Clear Cart
            </button>
          )}
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonItem key={i} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-[#162428] rounded-2xl p-5 border border-[#1f3a3e] animate-pulse space-y-4">
                <div className="h-5 w-1/2 bg-[#1f3338] rounded-full" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3 w-1/3 bg-[#1f3338] rounded-full" />
                    <div className="h-3 w-1/4 bg-[#1f3338] rounded-full" />
                  </div>
                ))}
                <div className="h-10 bg-[#1f3338] rounded-xl mt-4" />
              </div>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl bg-[#162428] border border-[#1f3a3e] p-16 text-center">
            <FiShoppingCart className="text-5xl text-[#2a5a62] mx-auto mb-4" />
            <p className="text-lg font-semibold text-[#dbf8fa]">
              Your cart is empty
            </p>
            <p className="text-sm text-[#4a8a92] mt-1">
              Add some books to see them here.
            </p>
            <button
              onClick={() => navigate("/books")}
              className="mt-5 px-6 py-2.5 rounded-xl bg-amber-300/10 border border-amber-300/20 text-amber-300 text-sm font-semibold hover:bg-amber-300/20 transition"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onUpdate={updateQty}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#162428] rounded-2xl p-5 border border-[#1f3a3e] sticky top-6">
                <h2 className="text-base font-semibold text-[#dbf8fa] mb-4">
                  Price Details
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#4a8a92]">
                      Price ({cart.length} items)
                    </span>
                    <span className="text-[#dbf8fa]">
                      {formatCurrency(totals.original)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a8a92]">Discount</span>
                    <span className="text-emerald-400">
                      -{formatCurrency(totals.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a8a92]">Delivery</span>
                    <span>
                      {totals.delivery === 0 ? (
                        <span className="text-emerald-400">Free</span>
                      ) : (
                        <span className="text-[#dbf8fa]">
                          {formatCurrency(totals.delivery)}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="border-t border-[#1f3a3e] my-1" />

                  <div className="flex justify-between">
                    <span className="font-semibold text-[#dbf8fa]">
                      Total Amount
                    </span>
                    <span className="font-bold text-amber-300">
                      {formatCurrency(totals.total)}
                    </span>
                  </div>

                  {totals.discount > 0 && (
                    <p className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-3 py-2 mt-1">
                      You save {formatCurrency(totals.discount)} on this order
                    </p>
                  )}

                  {totals.delivery === 0 && totals.subtotal > 0 && (
                    <p className="text-[10px] text-amber-300 bg-amber-300/10 border border-amber-300/20 rounded-xl px-3 py-2">
                      Free delivery on this order
                    </p>
                  )}
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full mt-5 py-2.5 bg-amber-400 text-black font-bold rounded-xl hover:bg-amber-500 transition text-sm tracking-wide cursor-pointer"
                >
                  Place Order
                </button>

                <p className="text-center text-[10px] text-[#2a5a62] mt-3">
                  Free delivery on orders above ₹699
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
