// src/services/AmenityService.js
import axiosInstance from "./axiosInstance";
import CategoryDTO from "../models/Dtos/Category";
import axios from "axios";
const CategoryService = {

  async GetAllCategories() {
    const res = await axiosInstance.get('/categories');
    return res.data;
  },
  async GetCategoryById(id) {
    // const token = sessionStorage.getItem("authToken");

    const response = await axiosInstance.get(
      `/categories/${id}`,
    );
    console.log(response.data);
    return response.data;
  },
  async AddCategory(categoryDto) {
    const category = new CategoryDTO(categoryDto).toJSON();
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.post(
      "/categories",
      category,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  },
  async UpdateCategory(id, categoryDto) {
    const category = new CategoryDTO(categoryDto).toJSON();
    const token = sessionStorage.getItem("authToken");
    const response = await axiosInstance.put(
      `/categories/${id}`,
      category,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
  async DeleteCategory(id) {
    const token = sessionStorage.getItem("authToken");
    console.log(id);
    const response = await axiosInstance.delete(
      `/categories/${id}`,
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
export default CategoryService;