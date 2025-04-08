const Order = require("../schemas/order");
const Cart = require("../schemas/cart");
const Product = require("../schemas/products");
const responseHandler = require("../utils/responseHandler");
const mongoose = require("mongoose");

// --- CREATE (Tạo đơn hàng từ giỏ hàng) ---
exports.createOrder = async (req, res) => {
  try {
    const userId = req.userData.userId; // Lấy từ middleware checkAuth
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return responseHandler.error(
        res,
        "Shipping address and payment method are required.",
        400
      );
    }

    // 1. Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return responseHandler.error(res, "Cart is empty.", 400);
    }

    // 2. Chuẩn bị dữ liệu items cho đơn hàng
    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      if (!item.productId) {
        // Kiểm tra nếu sản phẩm trong giỏ hàng không còn tồn tại
        throw new Error(
          `Product not found for item with ID ${item._id}. Please update your cart.`
        );
      }
      // Có thể kiểm tra lại tồn kho sản phẩm ở đây nếu cần
      const itemPrice = item.productId.price;
      const itemTotal = item.quantity * itemPrice;
      totalAmount += itemTotal;
      return {
        productId: item.productId._id,
        name: item.productId.name, // Lấy tên mới nhất
        quantity: item.quantity,
        price: itemPrice,
      };
    });

    // 3. Tạo đối tượng đơn hàng mới
    const newOrder = new Order({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      // Các trạng thái mặc định đã được định nghĩa trong schema
    });

    // 4. Lưu đơn hàng vào DB
    const savedOrder = await newOrder.save();

    // 5. (Quan trọng) Xóa giỏ hàng sau khi đã tạo đơn hàng thành công

    await Cart.deleteOne({ _id: cart._id });

    responseHandler.success(res, "Order created successfully.", savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    // Xử lý lỗi cụ thể nếu sản phẩm không tìm thấy
    if (error.message.includes("Product not found")) {
      return responseHandler.error(res, error.message, 400);
    }
    responseHandler.error(res, "Failed to create order.", 500, error);
  }
};

// --- READ (Lấy đơn hàng) ---

// Lấy tất cả đơn hàng của người dùng hiện tại
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // Sắp xếp mới nhất lên đầu
    responseHandler.success(res, `Found ${orders.length} orders.`, orders);
  } catch (error) {
    responseHandler.error(res, "Failed to fetch orders.", 500, error);
  }
};

// Lấy một đơn hàng cụ thể theo ID (cho người dùng)
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

// --- READ (Admin - Lấy tất cả đơn hàng) ---
exports.getAllOrders = async (req, res) => {
  // Nên thêm phân trang và lọc ở đây cho hiệu quả
  try {
    // Kiểm tra quyền Admin (bạn cần có middleware hoặc logic kiểm tra role)
    // if (req.userData.role !== 'admin') {
    //     return responseHandler.error(res, 'Unauthorized access.', 403);
    // }
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

// --- UPDATE (Admin - Cập nhật trạng thái đơn hàng) ---
exports.updateOrderStatus = async (req, res) => {
  try {
    // Kiểm tra quyền Admin
    // if (req.userData.role !== 'admin') {
    //     return responseHandler.error(res, 'Unauthorized access.', 403);
    // }
    const orderId = req.params.id;
    const { orderStatus, paymentStatus } = req.body; // Chỉ cho phép cập nhật các trạng thái này

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
      { new: true, runValidators: true } // Trả về bản ghi mới và chạy validators của Schema
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

// --- DELETE (Admin - Xóa đơn hàng) ---
// Thường thì không nên xóa cứng đơn hàng, nên cân nhắc cập nhật trạng thái thành 'cancelled' hoặc 'archived'
exports.deleteOrder = async (req, res) => {
  try {
    // Kiểm tra quyền Admin
    // if (req.userData.role !== 'admin') {
    //     return responseHandler.error(res, 'Unauthorized access.', 403);
    // }
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

// --- (Optional) User - Hủy đơn hàng ---
// Cho phép người dùng hủy nếu đơn hàng đang ở trạng thái 'pending'
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

    // Chỉ cho phép hủy nếu trạng thái là 'pending' (hoặc 'processing' tùy logic nghiệp vụ)
    if (order.orderStatus !== "pending") {
      return responseHandler.error(
        res,
        `Cannot cancel order with status: ${order.orderStatus}.`,
        400
      );
    }

    order.orderStatus = "cancelled";
    // Có thể cần cập nhật cả paymentStatus nếu đã thanh toán (ví dụ: thành 'refund_pending')
    // order.paymentStatus = 'refund_pending'; // Ví dụ

    const updatedOrder = await order.save();

    // Logic hoàn tiền (nếu có) nên được xử lý riêng biệt

    responseHandler.success(res, "Order cancelled successfully.", updatedOrder);
  } catch (error) {
    responseHandler.error(res, "Failed to cancel order.", 500, error);
  }
};
