<template>
  <div class="shopping-cart-page">
    <h1>Giỏ Hàng Của Bạn</h1>
    <div v-if="isLoading" class="loading-indicator">
      <p>Đang tải giỏ hàng...</p>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <!-- <div v-if="!isLoading && !error && cartItems.length === 0" class="empty-cart">
      <p>Giỏ hàng của bạn đang trống.</p>
      <router-link :to="{ name: 'home' }" class="btn-continue-shopping">Tiếp tục mua sắm</router-link>
    </div> -->
    <button class="btn btn-delete" @click="RemoveAll()">Xóa tất cả</button>
    <div v-if="isLoading == false" class="cart-container">
      <table class="cart-table">
        <thead>
          <tr>
            <th class="col-image">Ảnh</th>
            <th class="col-product">Sản phẩm</th>
            <th class="col-price">Đơn giá</th>
            <th class="col-quantity">Số lượng</th>
            <th class="col-total">Tổng cộng</th>
            <th class="col-action">Xóa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems.items" :key="item.product.productId" class="cart-item">
            <td class="col-image">
              <img v-if="item.product.image_products && item.product.image_products.length > 0"
                :src="`http://127.0.0.1:8000${item.product.image_products[0].imagePath}`"
                :alt="item.product.productName" class="product-image">
            </td>
            <td class="col-product">
              <span class="product-name">{{ item.product.name }}</span>
            </td>
            <td class="col-price">{{ formatPrice(item.product.price) }}</td>
            <td class="col-quantity" style="display: flex; align-items: center; justify-content: center;">
              <button @click="decreaseQuantity(item)" :disabled="item.quantity === 1"
                style="margin-left: -50px;background-color: #fff !important;border: none;box-shadow: none;"
                class="btn">➖</button>
              <input type="number" v-model.number="item.quantity" disabled min="1" class="quantity-input">
              <button @click="increaseQuantity(item)"
                style="background-color: #fff !important;border: none;box-shadow: none;" class="btn">➕</button>
            </td>
            <td class="col-total">{{ formatItemTotal(item) }}</td>
            <td class="col-action">
              <button @click="removeItem(item.product._id)" class="btn-remove" title="Xóa sản phẩm">
                &times;
              </button>
            </td>
          </tr>

        </tbody>
      </table>

      <div class="cart-summary" v-if="cartItems.items.length > 0">

        <div class="summary-row">
          <span class="summary-label">Phương thức thanh toán: </span>
          <select name="paymentMethod" id="paymentMethod" v-model="order.paymentMethod" required>
            <option value="COD">Thanh toán khi nhận hàng</option>
            <option value="Credit Card">Thẻ tín dụng (Credit Card)</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Chuyển khoản ngân hàng</option>
          </select>
        </div>
        <div class="summary-row">
          <label for="shippingAddress" class="summary-label">Địa chỉ giao hàng:</label>
          <input type="text" required v-model="order.shippingAddress" id="shippingAddress" name="shippingAddress"
            placeholder="Nhập địa chỉ của bạn" class="input-address" />
        </div>
        <div class="summary-row">
          <span class="summary-label">Tổng số lượng sản phẩm:</span>
          <span class="summary-value total-amount">{{ cartItems.totalQuantity }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Tổng cộng:</span>
          <span class="summary-value total-amount">{{ formattedCartTotal }}</span>
        </div>
        <button @click="Payment()" class="btn-checkout">Tiến hành Thanh toán</button>
      </div>
    </div>
  </div>
</template>

<script>
import CartService from '../../../services/CartService';
import CartVM from '../../../models/Enities/CartVM';
import OrderService from '../../../services/OrderService';
import OrderDTO from '../../../models/Dtos/OrderDto';
import UserVM from '../../../models/Enities/UserVM';
import AuthService from '../../../services/authService';
// Import các service cần thiết (nếu có API giỏ hàng thực tế)
// import CartService from '@/services/CartService'; // Ví dụ
// import { IMAGE_BASE_URL } from '@/services/axiosInstance'; // Điều chỉnh đường dẫn nếu cần

export default {
  name: 'ShoppingCart',
  data() {
    // Khai báo các biến trạng thái reactive ở đây
    return {
      cartItems: new CartVM(), // Giỏ hàng (danh sách sản phẩm)
      isLoading: false, // Trạng thái loading khi fetch dữ liệu
      error: null,     // Lưu lỗi nếu có
      order: new OrderDTO(),
      user: new UserVM(),
      // Bạn có thể đặt dữ liệu giả lập ở đây để test nhanh nếu chưa có API
      // cartItems: [
      //   { id: 1, name: 'Laptop ABC Model X', price: 15000000, quantity: 1, image: 'placeholder.jpg' },
      //   { id: 2, name: 'Chuột không dây Z', price: 350000, quantity: 2, image: 'placeholder.jpg' },
      //   { id: 3, name: 'Bàn phím cơ Y', price: 1200000, quantity: 1, image: 'placeholder.jpg' },
      // ],
    };
  },
  computed: {
    // Các thuộc tính tính toán dựa trên 'data'
    // cartTotal() {
    //   return Object.values(this.cartItems).reduce((total, item) => {
    //     const price = parseFloat(item.product.price);
    //     return total + (price * item.quantity);
    //   }, 0);
    // },
    formattedCartTotal() {
      return this.formatPrice(this.cartItems.totalPrice);
    }
  },
  methods: {
    async Payment() {
      if (!this.order.paymentMethod || !this.order.shippingAddress.trim()) {
        alert("Vui lòng chọn phương thức thanh toán và nhập địa chỉ giao hàng.");
        return;
      }
      if (!confirm(`Bạn có chắc chắn muốn thanh toán`)) {
        return;
      }
      this.order.items = this.cartItems.items;
      this.order.totalAmount = this.cartItems.totalPrice;
      this.order.userId = this.user._id;
      await OrderService.CreateOrder(this.order);
      await this.fetchCartItems();
    },
    async RemoveAll() {
      if (!confirm(`Bạn có chắc muốn xóa tất cả sản phâm ra khỏi giỏ hàng?`)) {
        return;
      }
      await CartService.RemoveAllOrder();
      await this.fetchCartItems();
    },
    // Các hàm xử lý logic, sự kiện
    async fetchCartItems() {
      this.isLoading = true;
      this.error = null;
      console.log("Fetching cart items...");
      try {
        const res = await CartService.GetCarts();
        this.cartItems = res.data;
        console.log("Cart:  ", this.cartItems);
        this.isLoading = false;
        // console.log(this.isLoading == false)
      } catch (err) {
        console.error("Error fetching cart items:", err);
        this.error = "Không thể tải giỏ hàng. Vui lòng thử lại.";
        this.cartItems = []; // Xóa dữ liệu cũ nếu lỗi
      } finally {
        this.isLoading = false;
      }
    },

    async decreaseQuantity(item) {
      if (item.quantity < 1) {
        item.quantity = 1;
      }
      item.quantity--;
      const res = await CartService.UpdateCart(item.product._id, item.quantity);
      if (res.data.success) {
        this.fetchCartItems();
      }
    },
    async increaseQuantity(item) {
      item.quantity++;
      const res = await CartService.UpdateCart(item.product._id, item.quantity);
      if (res.data.success) {
        this.fetchCartItems();
      }
    },

    async removeItem(itemId) {
      if (!confirm(`Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?`)) {
        return;
      }
      console.log(`Removing item with id ${itemId}`);
      // Lọc ra khỏi mảng hiện tại trên UI trước
      await CartService.RemoveOrder(itemId);
      await this.fetchCartItems();
    },

    // Định dạng giá tiền cho từng sản phẩm (đơn giá)
    formatPrice(value) {
      const number = Number(value); // ép kiểu
      if (isNaN(number)) return '';
      if (number < 1000) {
        return `${number}đ`;
      }
      return new Intl.NumberFormat('vi-VN').format(number) + ' đ';
    },

    // Định dạng tổng tiền cho một dòng sản phẩm (đơn giá * số lượng)
    formatItemTotal(item) {
      const number = Number(item.product.price);
      const total = number * item.quantity;
      return this.formatPrice(total);
    },

    // Hàm lấy URL ảnh (giữ nguyên hoặc điều chỉnh theo thực tế)
    getImageUrl(imagePath) {
      if (!imagePath) return 'https://via.placeholder.com/100?text=No+Image'; // Ảnh mặc định

      // Nếu imagePath đã là URL đầy đủ
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }

      // Nếu dùng IMAGE_BASE_URL
      // return `${IMAGE_BASE_URL}/${imagePath.replace(/\\/g, '/')}`;

      // Nếu không có base URL, trả về path gốc (có thể không hoạt động)
      console.warn("getImageUrl: IMAGE_BASE_URL not configured, returning raw path:", imagePath);
      return imagePath; // Hoặc trả về ảnh placeholder mặc định
      // return 'https://via.placeholder.com/100?text=No+Image';
    },

    goToCheckout() {
      console.log("Proceeding to checkout...");
      // Điều hướng đến trang thanh toán
      // this.$router.push({ name: 'checkout' }); // Ví dụ
      alert("Chuyển đến trang thanh toán (chức năng chưa hoàn thiện).");
    },
    async GetUser() {
            const response = await AuthService.GetProfile();
            this.user = response;
            // this.role = this.user.role;
            // console.log("User đăng nhập: ", this.user);
            // console.log("Role hiện tại: ", this.user.role);
            // sessionStorage.setItem('User', JSON.stringify(this.user));
        },

  },
  async created() {
    // Gọi hàm fetch dữ liệu khi component được tạo
    this.fetchCartItems();
    await this.GetUser();
  },
  // mounted() {
  //   // Hoặc gọi ở mounted nếu cần truy cập DOM
  // }
};
</script>

<style scoped>
.input-address {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  width: 100%;
  box-sizing: border-box;
  transition: border 0.3s ease;
}

.input-address:focus {
  border-color: #007bff;
  outline: none;
}

select {
  padding: 7px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: #fff;
  color: #333;
  width: 100%;
  appearance: none;
  /* Ẩn dropdown mặc định của trình duyệt */
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23666' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

select:hover {
  border-color: #888;
}

option {
  padding: 10px;
}

.shopping-cart-page {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.loading-indicator,
.error-message,
.empty-cart {
  text-align: center;
  padding: 40px 15px;
  color: #6c757d;
  font-size: 1.1em;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  padding: 15px;
}

.empty-cart p {
  margin-bottom: 20px;
}

.btn-continue-shopping {
  display: inline-block;
  padding: 10px 20px;
  background-color: #0d6efd;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.btn-continue-shopping:hover {
  background-color: #0b5ed7;
}

.cart-container {
  margin-top: 20px;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.cart-table th,
.cart-table td {
  border-bottom: 1px solid #dee2e6;
  padding: 15px 10px;
  text-align: left;
  vertical-align: middle;
}

.cart-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  text-transform: uppercase;
  white-space: nowrap;
}

.cart-item:hover {
  background-color: #f8f9fa;
  /* Highlight nhẹ khi hover */
}

.col-image {
  width: 80px;
  text-align: center;
}

.col-product {
  width: auto;
}

/* Chiếm phần lớn */
.col-price,
.col-total {
  width: 130px;
  text-align: right;
  white-space: nowrap;
}

.col-quantity {
  width: 150px;
  text-align: center;
}

.col-action {
  width: 60px;
  text-align: center;
}

.product-image {
  max-width: 60px;
  max-height: 60px;
  height: auto;
  border-radius: 4px;
  border: 1px solid #eee;
}

.product-name {
  font-weight: 500;
  color: #333;
}

.quantity-input {
  width: 60px;
  padding: 5px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  text-align: center;
  font-size: 1rem;
  /* Ẩn mũi tên mặc định */
  -moz-appearance: textfield;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.btn-remove {
  background-color: transparent;
  border: none;
  color: #dc3545;
  font-size: 1.6rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0 5px;
  line-height: 1;
  transition: color 0.2s, transform 0.1s;
}

.btn-remove:hover {
  color: #a71d2a;
  transform: scale(1.1);
}

.cart-summary {
  max-width: 600px;
  margin-left: auto;
  /* Đẩy sang phải */
  border: 1px solid #e9ecef;
  padding: 20px;
  border-radius: 5px;
  background-color: #f8f9fa;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 1rem;
}

.summary-label {
  color: #6c757d;
}

.summary-value {
  font-weight: 500;
  color: #333;
}

.total-amount {
  font-weight: bold;
  font-size: 1.2rem;
  color: #dc3545;
  /* Màu đỏ cho tổng tiền */
}

.btn-checkout {
  display: block;
  width: 100%;
  padding: 12px 20px;
  background-color: #198754;
  /* Màu xanh lá */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 20px;
  transition: background-color 0.2s;
}

.btn-checkout:hover {
  background-color: #157347;
}

/* Responsive */
@media (max-width: 768px) {

  .cart-table th:not(.col-product),
  .cart-table td:not(.col-product) {
    /* Ẩn bớt cột trên mobile nếu cần */
    /* display: none; */
  }

  .cart-table th,
  .cart-table td {
    padding: 10px 5px;
  }

  .col-price,
  .col-total {
    width: 100px;
  }

  .col-quantity {
    width: 90px;
  }

  .quantity-input {
    width: 50px;
  }

  .cart-summary {
    max-width: none;
    margin-left: 0;
  }
}

@media (max-width: 576px) {

  /* Có thể cần ẩn thêm cột hoặc thay đổi layout hoàn toàn */
  h1 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .product-name {
    font-size: 0.9rem;
  }

  .cart-table th {
    font-size: 0.8rem;
  }

}
</style>