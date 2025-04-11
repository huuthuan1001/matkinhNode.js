import axiosInstance from "./axiosInstance";
import CartItemDto from "../models/Dtos/CartItem";
const OrderService = {
  async GetCarts() {
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.get(`/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  async AddCart(cartDto) {
    const cart = new CartItemDto(cartDto).toJSON();
    cart.productId = cartDto;
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.post(`/cart/items`, cart, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Data: ", response);
    if (response.data.code != 200) {
      console.log("Cart values invalid", response.success);
    }
    return response;
  },
  async UpdateCart(productId, cartDto) {
    const cart = new CartItemDto().toJSON();
    cart.quantity = cartDto;
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.put(`/cart/items/${productId}`, cart, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Data: ", response);
    if (response.data.code != 200) {
      console.log("Cart values invalid", response.success);
    }
    return response;
  },
  async RemoveOrder(productId) {
    console.log(productId);
    const token = sessionStorage.getItem("authToken");
    console.log(token);
    const response = await axiosInstance.delete(`/cart/items/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Data: ", response);
    if (response.data.code != 200) {
      console.log("order values invalid", response.success);
    }
    return response;
  },
  async RemoveAllOrder() {
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.delete(`/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("Data: ", response);
    if (response.data.code != 200) {
      console.log("order values invalid", response.success);
    }
    return response;
  },
};
export default OrderService;
