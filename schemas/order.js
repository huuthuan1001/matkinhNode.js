const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema], // Mảng các sản phẩm trong đơn hàng
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      // Thông tin địa chỉ giao hàng
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      // Phương thức thanh toán
      type: String,
      required: true,
      enum: ["COD", "Credit Card", "PayPal", "Bank Transfer"], // Ví dụ các phương thức
      default: "COD",
    },
    paymentStatus: {
      // Trạng thái thanh toán
      type: String,
      required: true,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      // Trạng thái đơn hàng
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    // Có thể thêm các trường khác như mã vận đơn, ghi chú,...
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
