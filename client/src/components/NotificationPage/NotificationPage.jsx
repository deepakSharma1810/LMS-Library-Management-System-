// // import socket from "../../socket";
// import { useNotification } from "../../context/NotificationContext";
// import React, { useMemo, useState } from "react";
// import axios from "axios";
// import {
//   FiBell,
//   FiBookOpen,
//   FiTruck,
//   FiTrash2,
//   FiFilter,
//   FiSearch,
//   FiCheckCircle,
//   FiXCircle,
// } from "react-icons/fi";
// import { formatDistanceToNow } from "date-fns";
// import { useEffect } from "react";
// import { Link } from "react-router-dom";

// const typeIcon = (type) => {
//   if (type === "new_book") return <FiBookOpen className="text-lg" />;
//   if (type === "add_sell") return <FiTruck className="text-lg" />;
//   if (type === "update_sell") return <FiCheckCircle />;
//   if (type === "delete_book") return <FiXCircle />;
//   return <FiBell className="text-lg" />;
// };

// const NotificationRow = ({ n, books, onToggleRead, onDelete, onAction }) => {
//   return (
//     <div
//       className={`flex gap-4 p-4 rounded-lg items-start ${
//         n.unread ? "bg-[#163033]" : "bg-[#0f2526] opacity-90"
//       }`}
//       role="listitem"
//     >
//       <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0b3b3b] text-amber-300">
//         {typeIcon(n.type)}
//       </div>

//       <div className="flex-1">
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <p className="text-sm font-semibold text-[#dbf8fa]">{n.title}</p>
//             <p className="text-xs text-gray-300 mt-1">{n.message}</p>
//           </div>

//           <div className="text-right text-xs text-gray-400 whitespace-nowrap">
//             <div>{new Date(n.createdAt).toLocaleString()}</div>
//             <div className="mt-2 flex items-center gap-2">
//               <button
//                 onClick={() => onToggleRead(n._id)}
//                 className="cursor-pointer text-xs px-2 py-1 rounded bg-transparent border border-gray-700 hover:bg-gray-800"
//                 // aria-label={n.unread ? "Mark as read" : "Mark as unread"}
//               >
//                 {n.unread ? "Mark read" : "Mark unread"}
//               </button>
//               <button
//                 onClick={() => onDelete(n._id)}
//                 className="cursor-pointer text-xs px-2 py-1 rounded bg-transparent border border-red-700 text-red-300 hover:bg-red-900/10"
//                 aria-label="Delete notification"
//               >
//                 <FiTrash2 />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* optional action row for specific types */}
//         <div className="mt-3 flex gap-2">
//           {n.type === "add_sell" && (
//             <>
//               <button
//                 onClick={() => onAction("view_sell", n)}
//                 className="text-xs bg-amber-400 text-black px-3 py-1 rounded font-medium"
//               >
//                 View Sell
//               </button>
//               <button
//                 onClick={() => onAction("accept_sell", n)}
//                 className="text-xs px-3 py-1 rounded border border-gray-700 hover:bg-gray-800"
//               >
//                 Accept Offer
//               </button>
//             </>
//           )}

//           {n.type === "new_book" && (
//             <>
//               <Link to={`/book/${n.meta.bookId}`} key={n.meta.bookId}>
//                 <button
//                   onClick={() => onAction("view_book", n)}
//                   className="cursor-pointer text-xs bg-amber-400 text-black px-3 py-1 rounded font-medium"
//                 >
//                   View Book
//                 </button>
//               </Link>
//               <button
//                 onClick={() => onAction("save_book", n)}
//                 className="text-xs px-3 py-1 rounded border border-gray-700 hover:bg-gray-800"
//               >
//                 Save for later
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const NotificationPage = () => {
//   const { setNotificationCount } = useNotification();
//   const [notifications, setNotifications] = useState([]);
//   const [filterType, setFilterType] = useState("all");
//   const [query, setQuery] = useState("");

//   const [books, setBooks] = useState([]);

//   const fetchbooks = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/book");
//       setBooks(res.data.books);
//       console.log(res.data.books);
//     } catch (error) {
//       console.log("Error fetching books:", error);
//     }
//   };

//   useEffect(() => {
//     fetchbooks();
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/notifications");
//       setNotifications(res.data.notifications);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const filtered = useMemo(() => {
//     return notifications
//       .filter((n) => (filterType === "all" ? true : n.type === filterType))
//       .filter(
//         (n) =>
//           n.title.toLowerCase().includes(query.toLowerCase()) ||
//           n.message.toLowerCase().includes(query.toLowerCase()),
//       )
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   }, [notifications, filterType, query]);

//   const unreadCount = notifications.filter((n) => n.unread).length;

//   const toggleRead = async (id) => {
//     try {
//       const res = await axios.patch(
//         `http://localhost:5000/notifications/${id}/read`,
//       );

//       setNotifications((prev) =>
//         prev.map((n) =>
//           n._id === id ? { ...n, unread: res.data.notification.unread } : n,
//         ),
//       );

//       // navbar badge update
//       setNotificationCount((prev) =>
//         res.data.notification.unread ? prev + 1 : prev - 1,
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const deleteNotification = async (id) => {
//     try {
//       const deleted = notifications.find((n) => n._id === id);

//       await axios.delete(`http://localhost:5000/notifications/${id}`);

//       setNotifications((prev) => prev.filter((n) => n._id !== id));

//       // agar unread tha to navbar badge kam karo
//       if (deleted?.unread) {
//         setNotificationCount((prev) => prev - 1);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const markAllRead = async () => {
//     try {
//       await axios.patch("http://localhost:5000/notifications/read-all");

//       setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

//       // navbar badge 0
//       setNotificationCount(0);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const clearAll = () => {
//     setNotifications([]);
//     setNotificationCount(0);
//   };

//   const handleAction = (action, payload) => {
//     // handle action: navigate, open modal, call API etc.
//     // For demo we just mark read and log.
//     setNotifications((prev) =>
//       prev.map((p) => (p._id === payload._id ? { ...p, unread: false } : p)),
//     );
//     console.log("Action:", action, payload);
//   };

//   return (
//     <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-8 text-gray-100">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//           <div className="flex items-center gap-3">
//             <FiBell className="text-2xl text-amber-300" />
//             <div>
//               <h1 className="text-2xl font-bold text-[#dbf8fa]">
//                 Notifications
//               </h1>
//               <p className="text-sm text-gray-400">
//                 You have{" "}
//                 <span className="text-amber-300 font-semibold">
//                   {unreadCount}
//                 </span>{" "}
//                 unread notifications
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <div className="flex items-center bg-[#112b2b] rounded-md px-2 py-2 gap-2">
//               <FiSearch />
//               <input
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search notifications"
//                 className="bg-transparent outline-none text-sm text-gray-300 w-40"
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-1 px-2 py-2 bg-[#112b2b] rounded-md">
//                 <FiFilter />
//                 <select
//                   value={filterType}
//                   onChange={(e) => setFilterType(e.target.value)}
//                   className="cursor-pointer bg-transparent outline-none text-sm text-gray-300 "
//                 >
//                   <option value="all" className="text-gray-600">
//                     All
//                   </option>
//                   <option value="new_book" className="text-gray-600">
//                     New Book
//                   </option>
//                   <option value="update_book" className="text-gray-600">
//                     Update
//                   </option>
//                   <option value="delete_book" className="text-gray-600">
//                     Delete
//                   </option>
//                   {/* <option value="add_sell" className="text-gray-600">
//                     Add Sell
//                   </option> */}
//                 </select>
//               </div>

//               <button
//                 onClick={markAllRead}
//                 className="cursor-pointer px-3 py-2 bg-gray-700 rounded text-sm text-gray-200 hover:bg-gray-600"
//               >
//                 Mark all read
//               </button>

//               <button
//                 onClick={clearAll}
//                 className="cursor-pointer px-3 py-2 bg-transparent border border-red-700 text-red-300 rounded text-sm hover:bg-red-900/10"
//               >
//                 Clear all
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Demo simulate buttons */}
//         {/* <div className="flex gap-2 mb-6">
//           <button
//             onClick={simulateNewBook}
//             className="px-3 py-2 bg-amber-400 text-black rounded text-sm font-medium"
//           >
//             Simulate New Book
//           </button>
//           <button
//             onClick={simulateAddSell}
//             className="px-3 py-2 bg-[#164b45] text-gray-200 rounded text-sm"
//           >
//             Simulate Add Sell
//           </button>
//         </div> */}

//         {/* List */}
//         <div className="grid gap-3" role="list">
//           {filtered.length === 0 ? (
//             <div className="p-6 bg-[#0f2b2b] rounded text-center text-gray-400">
//               No notifications found.
//             </div>
//           ) : (
//             filtered.map((n) => (
//               <NotificationRow
//                 key={n._id}
//                 n={n}
//                 books={books}
//                 onToggleRead={toggleRead}
//                 onDelete={deleteNotification}
//                 onAction={handleAction}
//               />
//             ))
//           )}
//         </div>

//         {/* Footer quick controls */}
//         {notifications.length > 0 && (
//           <div className="mt-6 text-right text-sm text-gray-400">
//             <button
//               onClick={() => {
//                 setNotifications((p) => p.map((x) => ({ ...x, unread: true })));
//                 setNotificationCount(notifications.length);
//               }}
//               className="cursor-pointer px-3 py-1 rounded bg-transparent border border-gray-700 mr-2"
//             >
//               Mark all unread
//             </button>
//             <button
//               onClick={() => setNotifications([])}
//               className="px-3 py-1 cursor-pointer rounded bg-red-900/5"
//             >
//               Clear notifications
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationPage;
import { useNotification } from "../../context/NotificationContext";
import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiBell,
  FiBookOpen,
  FiTruck,
  FiTrash2,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiBookmark,
  FiMail,
} from "react-icons/fi";
import { MdMarkEmailRead, MdNotificationsOff } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";

const typeConfig = {
  new_book: {
    icon: FiBookOpen,
    color: "text-amber-300",
    bg: "bg-amber-300/10 border-amber-300/20",
    label: "New Book",
  },
  add_sell: {
    icon: FiTruck,
    color: "text-amber-300",
    bg: "bg-amber-300/10 border-amber-300/20",
    label: "Sell",
  },
  update_sell: {
    icon: FiCheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    label: "Update",
  },
  delete_book: {
    icon: FiXCircle,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    label: "Deleted",
  },
  default: {
    icon: FiBell,
    color: "text-[#4a8a92]",
    bg: "bg-[#1f3338] border-[#1f3a3e]",
    label: "Notice",
  },
};

const getType = (type) => typeConfig[type] || typeConfig.default;

const timeAgo = (dateStr) => {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "—";
  }
};

const SkeletonRow = () => (
  <div className="rounded-2xl border border-[#1f3a3e] bg-[#162428] p-5 animate-pulse">
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 rounded-2xl bg-[#1f3338] flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 w-20 bg-[#1f3338] rounded-full" />
        <div className="h-4 w-1/2 bg-[#1f3338] rounded-full" />
        <div className="h-3 w-3/4 bg-[#1f3338] rounded-full" />
        <div className="flex gap-2 mt-2">
          <div className="h-7 w-24 bg-[#1f3338] rounded-xl" />
          <div className="h-7 w-20 bg-[#1f3338] rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const NotificationRow = ({ n, onToggleRead, onDelete, onAction }) => {
  const cfg = getType(n.type);
  const Icon = cfg.icon;

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all duration-300 hover:border-amber-300/20 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,200,220,0.07)]
      ${
        n.unread
          ? "border-[#1f3a3e] bg-[#162428]"
          : "border-[#1f3a3e] bg-[#132124] opacity-80"
      }`}
    >
      {n.unread && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)]" />
      )}

      <div className="flex gap-4 items-start">
        <div
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center flex-shrink-0 ${cfg.bg}`}
        >
          <Icon className={`text-lg ${cfg.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <span
                className={`inline-block px-2 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest mb-1.5 ${cfg.bg} ${cfg.color}`}
              >
                {cfg.label}
              </span>

              <p className="text-sm font-semibold text-[#e8f8fa] leading-snug">
                {n.title}
              </p>

              <p className="text-[#4a8a92] text-xs mt-1 leading-relaxed">
                {n.message}
              </p>
            </div>

            <p className="text-[#2a5a62] text-xs whitespace-nowrap flex-shrink-0">
              {timeAgo(n.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {n.type === "new_book" && n.meta?.bookId && (
              <>
                <Link to={`/book/${n.meta.bookId}`}>
                  <button
                    onClick={() => onAction("view_book", n)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-300/10 border border-amber-300/20 text-amber-300 text-xs font-semibold hover:bg-amber-300/20 transition cursor-pointer"
                  >
                    <FiEye /> View Book
                  </button>
                </Link>

                <button
                  onClick={() => onAction("save_book", n)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1f3338] border border-[#1f3a3e] text-[#4a8a92] text-xs hover:bg-[#243b40] hover:text-amber-300 transition cursor-pointer"
                >
                  <FiBookmark /> Save
                </button>
              </>
            )}

            {n.type === "add_sell" && (
              <>
                <button
                  onClick={() => onAction("view_sell", n)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-300/10 border border-amber-300/20 text-amber-300 text-xs font-semibold hover:bg-amber-300/20 transition cursor-pointer"
                >
                  <FiEye /> View Sell
                </button>

                <button
                  onClick={() => onAction("accept_sell", n)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1f3338] border border-[#1f3a3e] text-[#4a8a92] text-xs hover:bg-[#243b40] hover:text-amber-300 transition cursor-pointer"
                >
                  <FiCheckCircle /> Accept
                </button>
              </>
            )}

            <div className="flex-1" />

            <button
              onClick={() => onToggleRead(n._id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1f3338] border border-[#1f3a3e] text-[#4a8a92] text-xs hover:bg-[#243b40] hover:text-amber-300 transition cursor-pointer"
            >
              <FiMail />
              {n.unread ? "Mark read" : "Mark unread"}
            </button>

            <button
              onClick={() => onDelete(n._id)}
              className="w-7 h-7 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition group cursor-pointer"
            >
              <FiTrash2 className="text-red-400 text-sm group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationPage = () => {
  const { setNotificationCount } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/notifications");
      setNotifications(res.data.notifications || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(
    () =>
      notifications
        .filter((n) => (filterType === "all" ? true : n.type === filterType))
        .filter(
          (n) =>
            n.title?.toLowerCase().includes(query.toLowerCase()) ||
            n.message?.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [notifications, filterType, query],
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  const toggleRead = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/notifications/${id}/read`,
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, unread: res.data.notification.unread } : n,
        ),
      );

      setNotificationCount((prev) =>
        res.data.notification.unread ? prev + 1 : Math.max(prev - 1, 0),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const deleted = notifications.find((n) => n._id === id);
      await axios.delete(`http://localhost:5000/notifications/${id}`);

      setNotifications((prev) => prev.filter((n) => n._id !== id));

      if (deleted?.unread) {
        setNotificationCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.patch("http://localhost:5000/notifications/read-all");

      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
      setNotificationCount(0);
    } catch (e) {
      console.log(e);
    }
  };

  const markAllUnread = () => {
    setNotifications((p) => p.map((x) => ({ ...x, unread: true })));
    setNotificationCount(notifications.length);
  };

  const clearAll = () => {
    setNotifications([]);
    setNotificationCount(0);
  };

  const handleAction = (action, payload) => {
    setNotifications((prev) =>
      prev.map((p) => (p._id === payload._id ? { ...p, unread: false } : p)),
    );

    console.log("Action:", action, payload);
  };

  const FILTERS = [
    { value: "all", label: "All" },
    { value: "new_book", label: "New Book" },
    { value: "update_book", label: "Update" },
    { value: "delete_book", label: "Delete" },
    { value: "add_sell", label: "Sell" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-10 py-10 text-[#e8f8fa]">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center">
              <FiBell className="text-xl text-amber-300" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[#dbf8fa] tracking-tight">
                Notifications
              </h1>

              <p className="text-sm text-[#4a8a92] mt-0.5">
                {unreadCount > 0 ? (
                  <>
                    <span className="text-amber-300 font-bold">
                      {unreadCount}
                    </span>{" "}
                    unread notifications
                  </>
                ) : (
                  "All caught up"
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#162428] border border-[#1f3a3e] text-[#4a8a92] text-xs font-semibold hover:bg-[#1f3338] hover:text-amber-300 transition cursor-pointer"
            >
              <MdMarkEmailRead className="text-base" /> Mark all read
            </button>

            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/15 transition cursor-pointer"
            >
              <MdNotificationsOff className="text-base" /> Clear all
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-2xl bg-[#162428] border border-[#1f3a3e] focus-within:border-amber-300/40 focus-within:ring-1 focus-within:ring-amber-300/20 transition">
            <FiSearch className="text-[#4a8a92] flex-shrink-0" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notifications..."
              className="bg-transparent outline-none text-sm text-[#dbf8fa] placeholder-[#4a8a92] w-full"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterType(f.value)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer
                  ${
                    filterType === f.value
                      ? "bg-amber-400 text-black shadow-lg shadow-amber-300/20"
                      : "bg-[#162428] border border-[#1f3a3e] text-[#4a8a92] hover:bg-[#1f3338] hover:text-amber-300"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total",
              value: notifications.length,
              color: "text-[#dbf8fa]",
            },
            {
              label: "Unread",
              value: unreadCount,
              color: "text-amber-300",
            },
            {
              label: "Read",
              value: notifications.length - unreadCount,
              color: "text-[#4a8a92]",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-[#162428] border border-[#1f3a3e] p-4 text-center"
            >
              <p className="text-[#4a8a92] text-[10px] uppercase tracking-widest">
                {s.label}
              </p>

              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-[#162428] border border-[#1f3a3e] p-14 text-center">
            <FiBell className="text-4xl text-[#2a5a62] mx-auto mb-3" />

            <p className="text-[#4a8a92] text-sm">No notifications found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => (
              <NotificationRow
                key={n._id}
                n={n}
                onToggleRead={toggleRead}
                onDelete={deleteNotification}
                onAction={handleAction}
              />
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={markAllUnread}
              className="px-4 py-2 rounded-2xl bg-[#162428] border border-[#1f3a3e] text-[#4a8a92] text-xs hover:bg-[#1f3338] hover:text-amber-300 transition cursor-pointer"
            >
              Mark all unread
            </button>

            <button
              onClick={() => setNotifications([])}
              className="px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/15 transition cursor-pointer"
            >
              Clear notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
