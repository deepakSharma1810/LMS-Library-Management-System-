import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaCity,
  FaMoneyBillWave,
  FaCreditCard,
  FaShieldAlt,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";
import { MdLocationPin, MdPayment } from "react-icons/md";
import API_URL from "../../Constant";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "COD",
  });

  const location = useLocation();

  useEffect(() => {
    if (location.state?.type === "buyNow") {
      setCartItems([location.state.product]);
    } else {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    }
  }, [location]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.qty || 1),
    0,
  );

  const discount = subtotal > 1000 ? 100 : 0;
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal - discount + delivery;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: false,
    }));

    setError("");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = true;
    if (!formData.phone.trim() || formData.phone.length < 10)
      errors.phone = true;
    if (!formData.address.trim()) errors.address = true;
    if (!formData.city.trim()) errors.city = true;
    if (!formData.state.trim()) errors.state = true;
    if (!formData.pincode.trim() || formData.pincode.length < 6)
      errors.pincode = true;

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Please fill all shipping details");
      return false;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return false;
    }

    setError("");
    return true;
  };

  const handleOrder = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${API_URL}/payment/create-order`,
        {
          amount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const options = {
        key: "rzp_test_3WbPzeexWFf3Wx",

        amount: data.order.amount,
        currency: data.currency,
        name: "MyBookStore",
        description: "Book Purchase",

        order_id: data.order.id,

        handler: async function (response) {
          console.log("Razorpay Response:", response);
          try {
            const verify = await axios.post(
              `${API_URL}/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,

                // orderData: {
                shipping: formData,
                items: cartItems.map((item) => ({
                  book: item._id,
                  qty: item.qty,
                  price: item.price,
                  bookType: item.bookType,
                })),
                subtotal,
                discount,
                delivery,
                total,
                // },
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (verify.data.success) {
              localStorage.removeItem("cart");
              setCartItems([]);
              setOrderPlaced(true);
            }
          } catch (err) {
            console.log(err);
            alert("Payment verification failed");
          }
        },

        theme: {
          color: "#f59e0b",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (err) {
      console.log(err);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#0e1a1c] flex items-center justify-center px-4 text-white">
        <div className="max-w-md w-full bg-[#1b2e31] border border-[#2c4449] rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 border border-green-400/30 flex items-center justify-center mb-5">
            <FaCheckCircle className="text-green-400 text-4xl" />
          </div>

          <h2 className="text-2xl font-bold text-[#dbf8fa]">
            Order Placed Successfully
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Your order has been placed. You can check it from your orders page.
          </p>

          <button
            onClick={() => (window.location.href = "/orders")}
            className="w-full mt-6 bg-amber-300 cursor-pointer text-black py-3 rounded-xl font-bold hover:bg-amber-400 transition"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1a1c] text-white px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-amber-300 text-sm font-semibold tracking-wide">
            Secure Checkout
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#dbf8fa] mt-1">
            Complete Your Order
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Add your shipping details and confirm your order securely.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* SHIPPING CARD */}
            <div className="bg-[#1b2e31] border border-[#2c4449] rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-amber-300" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#dbf8fa]">
                    Shipping Details
                  </h2>
                  <p className="text-xs text-gray-400">
                    Enter your delivery address
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <InputBox
                  icon={<FaUser />}
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={fieldErrors.fullName}
                />

                <InputBox
                  icon={<FaPhoneAlt />}
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  error={fieldErrors.phone}
                />

                <div className="md:col-span-2 relative">
                  <MdLocationPin className="absolute left-4 top-4 text-gray-500" />

                  <textarea
                    name="address"
                    placeholder="Complete Address"
                    rows={4}
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-[#122125] text-white placeholder:text-gray-500 outline-none transition resize-none ${
                      fieldErrors.address
                        ? "border border-red-500"
                        : "border border-[#2c4449] focus:border-amber-300"
                    }`}
                  />
                </div>

                <InputBox
                  icon={<FaCity />}
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  error={fieldErrors.city}
                />

                <InputBox
                  icon={<FaMapMarkerAlt />}
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  error={fieldErrors.state}
                />

                <InputBox
                  icon={<FaMapMarkerAlt />}
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  error={fieldErrors.pincode}
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )} */}
          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-[#1b2e31] rounded-3xl p-6 border border-[#2c4449] h-fit sticky top-24 shadow-2xl">
            <h2 className="text-xl font-bold text-[#dbf8fa] mb-5">
              Order Summary
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-2  max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id || item._id || index}
                    className="flex gap-3 border-b border-[#2c4449] pb-2"
                  >
                    <img
                      src={
                        item.image ||
                        (item.coverPhoto
                          ? `${API_URL}/${item.coverPhoto.replace(/\\/g, "/")}`
                          : "/no-image.png")
                      }
                      alt={item.title || item.name}
                      className="w-14 h-14 rounded-lg object-cover bg-[#122125]"
                    />

                    <div className="flex-1">
                      <p className="font-medium text-sm text-[#dbf8fa] line-clamp-2">
                        {item.title || item.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Qty: {item.qty || 1}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-amber-300">
                      ₹{Number(item.price || 0) * Number(item.qty || 1)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 space-y-0.5 text-sm">
              <SummaryRow label="Subtotal" value={`₹${subtotal}`} />
              <SummaryRow label="Discount" value={`-₹${discount}`} green />
              <SummaryRow
                label="Delivery"
                value={delivery === 0 ? "Free" : `₹${delivery}`}
              />

              <div className="border-t border-[#2c4449] pt-2 mt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-amber-300">₹{total}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-2  text-red-400  text-sm">{error}</div>
            )}

            <button
              onClick={handleOrder}
              disabled={cartItems.length === 0}
              className="w-full mt-2 cursor-pointer  bg-amber-300 text-black py-3 rounded-2xl font-bold hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Order
            </button>

            <p className="text-[11px] text-gray-500 text-center mt-4">
              By placing this order, you agree to our terms and return policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputBox = ({
  icon,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  error,
}) => {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
        {icon}
      </span>

      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-[#122125] text-white placeholder:text-gray-500 outline-none transition
          ${
            error
              ? "border border-red-500"
              : "border border-[#2c4449] focus:border-amber-300"
          }`}
      />
    </div>
  );
};

const SummaryRow = ({ label, value, green = false }) => {
  return (
    <div className={`flex justify-between ${green ? "text-green-400" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
};

export default CheckoutPage;
