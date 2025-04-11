const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");

router.post("/add", orderController.createOrder);

router.get("/user", orderController.getUserOrders);

// Lấy tất cả đơn hàng (cho admin)
router.get("/", orderController.getAllOrders);

router.get("/:id", orderController.getOrderByIdForUser);

router.put("/:id", orderController.updateOrderStatus);

router.put("/cancel/:id", orderController.cancelOrder);

router.delete("/:id", orderController.deleteOrder);

module.exports = router;
