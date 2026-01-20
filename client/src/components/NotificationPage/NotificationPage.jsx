import React, { useMemo, useState } from "react";
import {
  FiBell,
  FiBookOpen,
  FiTruck,
  FiTrash2,
  FiFilter,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

const initialNotifications = [
  {
    id: 1,
    type: "new_book", // new book added to catalog
    title: "New book listed: Silent Sunrise",
    message: "John Doe added 'Silent Sunrise' to the catalog.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: true,
    meta: { bookId: 101 },
  },
  {
    id: 2,
    type: "add_sell", // someone added a sell/order or posted sell request
    title: "Sell posted: Forest Trail (Used)",
    message: "Maria Lee posted a used copy of 'Forest Trail' for sale.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unread: true,
    meta: { sellId: 501, price: 250 },
  },
  {
    id: 3,
    type: "new_book",
    title: "New book listed: Mountain Landscape",
    message: "Jane Smith added 'Mountain Landscape' to the catalog.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    unread: false,
    meta: { bookId: 102 },
  },
];

const typeIcon = (type) => {
  if (type === "new_book") return <FiBookOpen className="text-lg" />;
  if (type === "add_sell") return <FiTruck className="text-lg" />;
  return <FiBell className="text-lg" />;
};

const NotificationRow = ({ n, onToggleRead, onDelete, onAction }) => {
  return (
    <div
      className={`flex gap-4 p-4 rounded-lg items-start ${
        n.unread ? "bg-[#163033]" : "bg-[#0f2526] opacity-90"
      }`}
      role="listitem"
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0b3b3b] text-amber-300">
        {typeIcon(n.type)}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#dbf8fa]">{n.title}</p>
            <p className="text-xs text-gray-300 mt-1">{n.message}</p>
          </div>

          <div className="text-right text-xs text-gray-400 whitespace-nowrap">
            <div>
              {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => onToggleRead(n.id)}
                className="text-xs px-2 py-1 rounded bg-transparent border border-gray-700 hover:bg-gray-800"
                // aria-label={n.unread ? "Mark as read" : "Mark as unread"}
              >
                {n.unread ? "Mark read" : "Mark unread"}
              </button>
              <button
                onClick={() => onDelete(n.id)}
                className="text-xs px-2 py-1 rounded bg-transparent border border-red-700 text-red-300 hover:bg-red-900/10"
                aria-label="Delete notification"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        </div>

        {/* optional action row for specific types */}
        <div className="mt-3 flex gap-2">
          {n.type === "add_sell" && (
            <>
              <button
                onClick={() => onAction("view_sell", n)}
                className="text-xs bg-amber-400 text-black px-3 py-1 rounded font-medium"
              >
                View Sell
              </button>
              <button
                onClick={() => onAction("accept_sell", n)}
                className="text-xs px-3 py-1 rounded border border-gray-700 hover:bg-gray-800"
              >
                Accept Offer
              </button>
            </>
          )}

          {n.type === "new_book" && (
            <>
              <button
                onClick={() => onAction("view_book", n)}
                className="text-xs bg-amber-400 text-black px-3 py-1 rounded font-medium"
              >
                View Book
              </button>
              <button
                onClick={() => onAction("save_book", n)}
                className="text-xs px-3 py-1 rounded border border-gray-700 hover:bg-gray-800"
              >
                Save for later
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filterType, setFilterType] = useState("all");
  const [query, setQuery] = useState("");

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const filtered = notifications
    .filter((n) => (filterType === "all" ? true : n.type === filterType))
    .filter(
      (n) =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.message.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const markAllRead = () =>
    setNotifications((prev) => prev.map((p) => ({ ...p, unread: false })));

  const clearAll = () => setNotifications([]);

  const toggleRead = (id) =>
    setNotifications((prev) =>
      prev.map((p) => (p.id === id ? { ...p, unread: !p.unread } : p))
    );

  const deleteNotification = (id) =>
    setNotifications((prev) => prev.filter((p) => p.id !== id));

  const handleAction = (action, payload) => {
    // handle action: navigate, open modal, call API etc.
    // For demo we just mark read and log.
    setNotifications((prev) =>
      prev.map((p) => (p.id === payload.id ? { ...p, unread: false } : p))
    );
    console.log("Action:", action, payload);
    // alert(`Action: ${action} — ${payload.title}`);
  };

  // Simulate new notifications (for demo/test)
  const simulateNewBook = () => {
    const nextId = Date.now();
    const newN = {
      id: nextId,
      type: "new_book",
      title: "New book listed: Whispering Pines",
      message: "Ava Turner added 'Whispering Pines' to the catalog.",
      createdAt: new Date(),
      unread: true,
      meta: { bookId: nextId % 1000 },
    };
    setNotifications((p) => [newN, ...p]);
  };

  const simulateAddSell = () => {
    const nextId = Date.now();
    const newN = {
      id: nextId,
      type: "add_sell",
      title: "Sell posted: City Skyline (Like New)",
      message: "Alex Johnson posted a used copy of 'City Skyline' for sale.",
      createdAt: new Date(),
      unread: true,
      meta: { sellId: nextId % 1000, price: 499 },
    };
    setNotifications((p) => [newN, ...p]);
  };

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-8 text-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <FiBell className="text-2xl text-amber-300" />
            <div>
              <h1 className="text-2xl font-bold text-[#dbf8fa]">
                Notifications
              </h1>
              <p className="text-sm text-gray-400">
                You have{" "}
                <span className="text-amber-300 font-semibold">
                  {unreadCount}
                </span>{" "}
                unread notifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#112b2b] rounded-md px-2 py-2 gap-2">
              <FiSearch />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notifications"
                className="bg-transparent outline-none text-sm text-gray-300 w-40"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-2 bg-[#112b2b] rounded-md">
                <FiFilter />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-300 "
                >
                  <option value="all" className="text-gray-600">
                    All
                  </option>
                  <option value="new_book" className="text-gray-600">
                    New Book
                  </option>
                  <option value="add_sell" className="text-gray-600">
                    Add Sell
                  </option>
                </select>
              </div>

              <button
                onClick={markAllRead}
                className="px-3 py-2 bg-gray-700 rounded text-sm text-gray-200 hover:bg-gray-600"
              >
                Mark all read
              </button>

              <button
                onClick={clearAll}
                className="px-3 py-2 bg-transparent border border-red-700 text-red-300 rounded text-sm hover:bg-red-900/10"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>

        {/* Demo simulate buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={simulateNewBook}
            className="px-3 py-2 bg-amber-400 text-black rounded text-sm font-medium"
          >
            Simulate New Book
          </button>
          <button
            onClick={simulateAddSell}
            className="px-3 py-2 bg-[#164b45] text-gray-200 rounded text-sm"
          >
            Simulate Add Sell
          </button>
        </div>

        {/* List */}
        <div className="grid gap-3" role="list">
          {filtered.length === 0 ? (
            <div className="p-6 bg-[#0f2b2b] rounded text-center text-gray-400">
              No notifications found.
            </div>
          ) : (
            filtered.map((n) => (
              <NotificationRow
                key={n.id}
                n={n}
                onToggleRead={toggleRead}
                onDelete={deleteNotification}
                onAction={handleAction}
              />
            ))
          )}
        </div>

        {/* Footer quick controls */}
        {notifications.length > 0 && (
          <div className="mt-6 text-right text-sm text-gray-400">
            <button
              onClick={() =>
                setNotifications((p) => p.map((x) => ({ ...x, unread: true })))
              }
              className="px-3 py-1 rounded bg-transparent border border-gray-700 mr-2"
            >
              Mark all unread
            </button>
            <button
              onClick={() => setNotifications([])}
              className="px-3 py-1 rounded bg-red-900/5"
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
