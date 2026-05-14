const express = require("express");
const {
  getAllNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", getAllNotifications);
router.get("/unread-count", getUnreadCount);

router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

router.delete("/:id", deleteNotification);
router.delete("/", deleteAllNotifications);

module.exports = router;
