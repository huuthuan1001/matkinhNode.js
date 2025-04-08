const Cart = require("../schemas/cart");
const Product = require("../schemas/products"); // Đảm bảo bạn đã có Product model
const {
  CreateSuccessRes,
  CreateErrorRes,
} = require("../utils/responseHandler"); // Sử dụng response handler của bạn

// Hàm trợ giúp: Lấy hoặc tạo giỏ hàng cho user
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
    await cart.save();
  }
  return cart;
}

module.exports = {
  // Xem giỏ hàng
  viewCart: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({ user: userId }).populate({
        path: "items.product",
        select: "name price imageUrl description stock",
      });

      if (!cart) {
        return CreateSuccessRes(
          res,
          { user: userId, items: [], totalQuantity: 0, totalPrice: 0 },
          200
        );
      }
      CreateSuccessRes(res, cart, 200);
    } catch (error) {
      console.error("Lỗi khi xem giỏ hàng:", error);
      next(error); // Chuyển lỗi cho global error handler
    }
  },

  // Thêm sản phẩm vào giỏ hàng
  addItem: async (req, res, next) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    if (!productId || quantity < 1) {
      return CreateErrorRes(
        res,
        "Thiếu ID sản phẩm hoặc số lượng không hợp lệ.",
        400
      );
    }

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return CreateErrorRes(res, "Sản phẩm không tồn tại.", 404);
      }

      const cart = await getOrCreateCart(userId);
      const itemIndex = cart.items.findIndex((item) =>
        item.product.equals(productId)
      ); // So sánh ObjectId

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += parseInt(quantity, 10);
      } else {
        cart.items.push({
          product: productId,
          quantity: parseInt(quantity, 10),
        });
      }

      await cart.save();
      // Populate lại để trả về thông tin đầy đủ
      await cart.populate({
        path: "items.product",
        select: "name price imageUrl",
      });
      CreateSuccessRes(res, cart, 200);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      next(error);
    }
  },

  updateItemQuantity: async (req, res, next) => {
    const { productId } = req.params; // Lấy productId từ URL parameter
    const { quantity } = req.body; // Lấy quantity mới từ request body
    const userId = req.user._id;

    if (!quantity || quantity < 1) {
      return CreateErrorRes(res, "Số lượng không hợp lệ.", 400);
    }

    try {
      // Kiểm tra tồn kho trước khi cập nhật (nếu cần)
      // const product = await Product.findById(productId);
      // if (!product || product.stock < quantity) { ... }

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return CreateErrorRes(res, "Giỏ hàng không tìm thấy.", 404);
      }

      const itemIndex = cart.items.findIndex((item) =>
        item.product.equals(productId)
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = parseInt(quantity, 10);
        await cart.save();
        await cart.populate({
          path: "items.product",
          select: "name price imageUrl",
        });
        CreateSuccessRes(res, cart, 200);
      } else {
        return CreateErrorRes(res, "Sản phẩm không có trong giỏ hàng.", 404);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
      next(error);
    }
  },

  removeItem: async (req, res, next) => {
    const { productId } = req.params; // Lấy productId từ URL parameter
    const userId = req.user._id;

    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return CreateErrorRes(res, "Giỏ hàng không tìm thấy.", 404);
      }

      const initialLength = cart.items.length;
      cart.items = cart.items.filter((item) => !item.product.equals(productId)); // Lọc bỏ sản phẩm cần xóa

      if (cart.items.length === initialLength) {
        return CreateErrorRes(res, "Sản phẩm không có trong giỏ hàng.", 404);
      }

      await cart.save();
      await cart.populate({
        path: "items.product",
        select: "name price imageUrl",
      });
      CreateSuccessRes(res, cart, 200);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      next(error);
    }
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (req, res, next) => {
    const userId = req.user._id;
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return CreateSuccessRes(res, { message: "Giỏ hàng đã trống" }, 200);
      }
      cart.items = [];
      await cart.save();
      CreateSuccessRes(res, cart, 200);
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error);
      next(error);
    }
  },
};
