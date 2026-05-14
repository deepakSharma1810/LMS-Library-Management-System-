const Notification = require("../model/Notification");

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ unread: true });

    res.status(200).json({ unread: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    // toggle unread
    notification.unread = !notification.unread;

    await notification.save();

    res.status(200).json({
      message: notification.unread ? "Marked as unread" : "Marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { unread: true },
      { $set: { unread: false } },
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID missing" });
    }

    await Notification.findByIdAndDelete(id);

    res.status(200).json({
      message: "Notification deleted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany();

    res.status(200).json({
      message: "All notifications cleared",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};
