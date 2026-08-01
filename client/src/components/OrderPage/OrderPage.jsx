import React, { useState } from "react";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiDownload,
} from "react-icons/fi";
import axios from "axios";
import API_URL from "../../Constant";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n,
  );

const statusBadge = (status) => {
  const base = "px-2 py-[2px] rounded-full text-[10px] font-semibold";
  switch (status) {
    case "Delivered":
      return `${base} bg-green-900/40 text-green-300 border border-green-700/60`;
    case "Shipped":
      return `${base} bg-blue-900/40 text-blue-300 border border-blue-700/60`;
    case "Pending":
      return `${base} bg-yellow-900/40 text-yellow-300 border border-yellow-700/60`;
    case "Cancelled":
      return `${base} bg-red-900/40 text-red-300 border border-red-700/60`;
    default:
      return `${base} bg-gray-800 text-gray-300 border border-gray-600`;
  }
};

const statusIcon = (status) => {
  if (status === "Delivered")
    return <FiCheckCircle className="text-green-400 text-xl" />;
  if (status === "Shipped")
    return <FiTruck className="text-blue-400 text-xl" />;
  if (status === "Cancelled")
    return <FiXCircle className="text-red-400 text-xl" />;
  return <FiPackage className="text-yellow-300 text-xl" />;
};

const OrderPage = () => {
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(null);
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`${API_URL}/order/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const buyAgain = (order) => {
    const oldCart = JSON.parse(localStorage.getItem("cart")) || [];

    const newItems = order.items.map((item) => ({
      ...item.book,
      qty: item.quantity,
    }));

    newItems.forEach((newItem) => {
      const existing = oldCart.find((i) => i._id === newItem._id);

      if (existing) {
        existing.qty += newItem.qty;
      } else {
        oldCart.push(newItem);
      }
    });

    localStorage.setItem("cart", JSON.stringify(oldCart));

    navigate("/cart");
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  // const downloadInvoice = async (order) => {
  //   const token = localStorage.getItem("token");

  //   window.open(
  //     `${API_URL}/order/invoice/${order._id}?token=${token}`,
  //     "_blank",
  //   );
  // };

  const downloadInvoice = async (order) => {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/order/invoice/${order._id}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");

    link.href = url;
    link.download = `invoice-${order._id}.pdf`;

    link.click();
  };

  const trackOrder = (order) => {
    alert(`Track order ${order.id} (integrate tracking page/URL).`);
  };

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-8 text-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#dbf8fa] mb-6">
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-[#122125] rounded-xl p-8 text-center text-gray-300">
            <p className="text-lg mb-3">No orders yet</p>
            <p className="text-sm text-gray-400">
              When you place an order, it will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#122125] rounded-xl p-4 md:p-5 shadow-lg"
              >
                {/* Top row: icon, status, basic info */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-[2px]">
                      {statusIcon(order.orderStatus)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-[#dbf8fa]">
                          {order.orderStatus}
                        </span>
                        <span className={statusBadge(order.orderStatus)}>
                          {order.orderStatus.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Payment : {order.paymentStatus}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Order ID:{" "}
                        <span className="text-gray-300">{order._id}</span>
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Ordered on:{" "}
                        <span className="text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                      {order.items.map((item, idx) => (
                        <div key={idx}>
                          <p className="text-[11px] text-gray-500">
                            Book Type:{" "}
                            <span className="text-[11px] text-gray-300">
                              {item.bookType === "ebook"
                                ? "E-Book"
                                : item.bookType === "physical"
                                  ? "Physical Book"
                                  : "Both"}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right side summary */}
                  <div className="text-right md:text-right">
                    <p className="text-xs text-gray-400">Total Amount</p>
                    <p className="text-lg font-semibold text-amber-300">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {order.items.length} item
                      {order.itemsCount > 1 ? "s" : ""} • {order.paymentMethod}
                    </p>
                    <button
                      onClick={() => downloadInvoice(order)}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-gray-300 hover:text-amber-300 cursor-pointer"
                    >
                      <FiDownload /> Invoice
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-700 my-3" />

                {/* First item preview */}
                <div className="flex gap-3">
                  <img
                    src={`${order.items[0].book.coverPhoto}`}
                    alt={order.items[0].book.name}
                    className="w-14 h-18 md:w-16 md:h-20 object-cover rounded-md border border-gray-700"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-[#dbf8fa] font-medium">
                      {order.items[0].book.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      by{" "}
                      {order.items[0].book.author
                        ?.map((a) => a.name)
                        .join(", ")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Qty: {order.items[0].quantity}
                    </p>
                    {order.items.length > 1 && (
                      <p className="text-[11px] text-gray-500 mt-1">
                        + {order.items.length - 1} more item
                        {order.itemsCount - 1 > 1 ? "s" : ""}
                      </p>
                    )}
                    <p className="text-sm text-amber-300 mt-1">
                      {formatCurrency(order.items[0].price)}
                    </p>
                  </div>
                </div>

                {/* Expand / collapse + actions */}
                <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-amber-300"
                  >
                    <FiChevronDown
                      className={`transition-transform ${
                        expanded === order._id ? "rotate-180" : ""
                      }`}
                    />
                    {expanded === order._id ? "Hide details" : "View details"}
                  </button>

                  <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                    {order.orderStatus !== "Cancelled" && (
                      <button
                        onClick={() => trackOrder(order)}
                        className="px-3 py-1 text-xs rounded-md bg-transparent border border-gray-700 text-gray-200 hover:bg-gray-800"
                      >
                        Track Order
                      </button>
                    )}
                    <button
                      className="px-3 py-1 text-xs rounded-md bg-transparent border border-gray-700 text-gray-200 hover:bg-gray-800 cursor-pointer"
                      onClick={() => buyAgain(order)}
                    >
                      Buy Again
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {expanded === order._id && (
                  <div className="mt-4 bg-[#0e1a1c] rounded-lg p-3 md:p-4 border border-gray-800">
                    {/* Items list */}
                    <p className="text-xs font-semibold text-gray-300 mb-2">
                      Items in this order
                    </p>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 items-center text-sm"
                        >
                          <img
                            src={`${API_URL}/${item.book.coverPhoto.replace(/\\/g, "/")}`}
                            alt={item.book.name}
                            className="w-10 h-14 object-cover rounded border border-gray-700"
                          />
                          <div className="flex-1">
                            <p className="text-[13px] text-[#dbf8fa]">
                              {item.book.name}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              by{" "}
                              {order.items[0].book.author
                                ?.map((a) => a.name)
                                .join(", ")}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-1">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-[13px] text-amber-300">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Address + payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                      <div>
                        <p className="text-gray-400 mb-1">Delivery address</p>
                        <div className="text-gray-300">
                          <p>{order.shipping.fullName}</p>
                          <p>{order.shipping.phone}</p>
                          <p>{order.shipping.address}</p>
                          <p>
                            {order.shipping.city}, {order.shipping.state} -
                            {order.shipping.pincode}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Payment</p>
                        <p className="text-gray-300">
                          Mode: {order.paymentMethod}
                        </p>

                        <p className="text-gray-300">
                          Status: {order.paymentStatus}
                        </p>

                        <p className="text-gray-300">
                          Amount: {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
