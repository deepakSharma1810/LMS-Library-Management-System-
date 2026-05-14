import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  //   Fetch All Notification
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/notifications");

      setNotifications(res.data.notifications);

      const unread = res.data.notifications.filter((n) => n.unread).length;

      setNotificationCount(unread);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // SOCKET LISTENER
    socket.on("new-notification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);

      setNotificationCount((prev) => prev + 1);
    });

    return () => {
      socket.off("new-notification");
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        notificationCount,
        setNotificationCount,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
