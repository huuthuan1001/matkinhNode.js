import axiosInstance from "./axiosInstance";

const OrderService = {
  // ✅ Tạo đơn hàng mới
  async CreateOrder(orderData) {
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.post(`/orders/add`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  // ✅ Lấy danh sách đơn hàng của người dùng hiện tại
  async GetUserOrders() {
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.get(`/order/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // ✅ Lấy tất cả đơn hàng (cho admin)
  async GetAllOrders() {
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.get(`/order`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // ✅ Lấy đơn hàng theo ID (cho user)
  async GetOrderById(id) {
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.get(`/order/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // ✅ Cập nhật trạng thái đơn hàng
  async UpdateOrderStatus(id, statusData) {
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.put(`/order/${id}`, statusData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  // ✅ Hủy đơn hàng
  async CancelOrder(id) {
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.put(`/order/cancel/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  // ✅ Xóa đơn hàng (chỉ Admin)
  async DeleteOrder(id) {
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.delete(`/order/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },
};

export default OrderService;
