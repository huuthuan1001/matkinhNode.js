const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartSchema.virtual("totalQuantity").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.virtual("totalPrice").get(function () {
  if (
    !this.items ||
    this.items.length === 0 ||
    !this.items[0].product ||
    typeof this.items[0].product.price !== "number"
  ) {
    return 0;
  }
  return this.items.reduce((total, item) => {
    if (item.product && typeof item.product.price === "number") {
      return total + item.quantity * item.product.price;
    }
    return total;
  }, 0);
});

const Cart = model("Cart", cartSchema);

module.exports = Cart;
