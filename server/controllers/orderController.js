const Order = require("../model/Order");

const createOrder = async (req, res) => {
  try {
    const { shipping, items, subtotal, discount, delivery, total } = req.body;

    const order = await Order.create({
      user: req.user.id,
      shipping,
      items,
      subtotal,
      discount,
      delivery,
      total,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.book")
      .sort({ createdAt: -1 });

    if (!orders) {
      return res.status(404).json({
        message: "Orders not found",
      });
    }

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { createOrder, getMyOrders };
