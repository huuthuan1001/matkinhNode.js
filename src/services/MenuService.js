// src/services/AmenityService.js
import axiosInstance from "./axiosInstance";
import MenuDto from "../models/Dtos/MenuDto";
const MenuService = {

  async GetMenu() {
    const res = await axiosInstance.get('/menus');
    return res.data;
  },
  async AddMenu(menuDto) {
    const menu = new MenuDto(menuDto).toJSON();
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.post(
      "/menus",
      menu,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  },
  async UpdateMenu(id, menuDto) {
    const menu = new MenuDto(menuDto).toJSON();
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.put(
      `/menus/${id}`,
      menu,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
    return response.data;
  },
  async DeleteMenu(id) {
    const token = sessionStorage.getItem("authToken");
    console.log(id);
    const response = await axiosInstance.delete(
      `/menus/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  },
};
export default MenuService;