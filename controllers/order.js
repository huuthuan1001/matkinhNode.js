const Order = require("../schemas/order");
const Cart = require("../schemas/cart");
const Product = require("../schemas/products");
const responseHandler = require("../utils/responseHandler");
const mongoose = require("mongoose");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return responseHandler.error(
        res,
        "Shipping address and payment method are required.",
        400
      );
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return responseHandler.error(res, "Cart is empty.", 400);
    }

    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      if (!item.productId) {
        throw new Error(
          `Product not found for item with ID ${item._id}. Please update your cart.`
        );
      }

      const itemPrice = item.productId.price;
      const itemTotal = item.quantity * itemPrice;
      totalAmount += itemTotal;
      return {
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        price: itemPrice,
      };
    });

    const newOrder = new Order({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });
    const savedOrder = await newOrder.save();

    await Cart.deleteOne({ _id: cart._id });

    responseHandler.success(res, "Order created successfully.", savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);

    if (error.message.includes("Product not found")) {
      return responseHandler.error(res, error.message, 400);
    }
    responseHandler.error(res, "Failed to create order.", 500, error);
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // Sắp xếp mới nhất lên đầu
    responseHandler.success(res, `Found ${orders.length} orders.`, orders);
  } catch (error) {
    responseHandler.error(res, "Failed to fetch orders.", 500, error);
  }
};

exports.getOrderByIdForUser = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return responseHandler.error(res, "Invalid Order ID format.", 400);
    }
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return responseHandler.error(
        res,
        "Order not found or you do not have permission.",
        404
      );
    }
    responseHandler.success(res, "Order details fetched.", order);
  } catch (error) {
    responseHandler.error(res, "Failed to fetch order details.", 500, error);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 }); // Populate thông tin user
    responseHandler.success(
      res,
      `Found ${orders.length} total orders.`,
      orders
    );
  } catch (error) {
    responseHandler.error(res, "Failed to fetch all orders.", 500, error);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderStatus, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return responseHandler.error(res, "Invalid Order ID format.", 400);
    }

    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    if (Object.keys(updateData).length === 0) {
      return responseHandler.error(res, "No status provided for update.", 400);
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return responseHandler.error(res, "Order not found.", 404);
    }
    responseHandler.success(
      res,
      "Order status updated successfully.",
      updatedOrder
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      return responseHandler.error(
        res,
        "Invalid status value.",
        400,
        error.errors
      );
    }
    responseHandler.error(res, "Failed to update order status.", 500, error);
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return responseHandler.error(res, "Invalid Order ID format.", 400);
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return responseHandler.error(res, "Order not found.", 404);
    }
    responseHandler.success(res, "Order deleted successfully.", {
      _id: orderId,
    });
  } catch (error) {
    responseHandler.error(res, "Failed to delete order.", 500, error);
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return responseHandler.error(res, "Invalid Order ID format.", 400);
    }

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return responseHandler.error(
        res,
        "Order not found or you do not have permission.",
        404
      );
    }

    if (order.orderStatus !== "pending") {
      return responseHandler.error(
        res,
        `Cannot cancel order with status: ${order.orderStatus}.`,
        400
      );
    }

    order.orderStatus = "cancelled";

    const updatedOrder = await order.save();

    responseHandler.success(res, "Order cancelled successfully.", updatedOrder);
  } catch (error) {
    responseHandler.error(res, "Failed to cancel order.", 500, error);
  }
};
