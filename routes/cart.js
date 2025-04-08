const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
// Giả sử middleware xác thực của bạn tên là check_authentication
const { check_authentication } = require("../utils/check_auth");

// Áp dụng middleware xác thực cho tất cả các route trong file này
router.use(check_authentication);

router.get("/", cartController.viewCart);

router.post("/items", cartController.addItem);

router.put("/items/:productId", cartController.updateItemQuantity);

router.delete("/items/:productId", cartController.removeItem);

router.delete("/", cartController.clearCart);

module.exports = router;
