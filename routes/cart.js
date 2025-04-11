const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const { check_authentication } = require("../utils/check_auth");

router.use(check_authentication);

router.get("/", cartController.viewCart);

router.post("/items", cartController.addItem);

router.put("/items/:productId", cartController.updateItemQuantity);

router.delete("/items/:productId", cartController.removeItem);

router.delete("/", cartController.clearCart);

module.exports = router;
