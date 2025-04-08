const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");

// Tạo đơn hàng mới
router.post("/add", orderController.createOrder);

// Lấy danh sách đơn hàng của người dùng
router.get("/user", orderController.getUserOrders);

// Lấy tất cả đơn hàng (cho admin)
router.get("/", orderController.getAllOrders);

// Lấy đơn hàng theo ID cho người dùng
router.get("/:id", orderController.getOrderByIdForUser);

// Cập nhật trạng thái đơn hàng
router.put("/:id", orderController.updateOrderStatus);

// Hủy đơn hàng
router.put("/cancel/:id", orderController.cancelOrder);

// Xóa đơn hàng
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
