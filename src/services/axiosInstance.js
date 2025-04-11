import axios from "axios";

const API_BASE_URL = "http://localhost:3000";
const IMAGE_BASE_URL = `http://localhost:3333`;

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export { IMAGE_BASE_URL };
export default instance;




// use

// getImageUrl(url);
// import axiosInstance, { IMAGE_BASE_URL } from "@/services/api/axiosInstance";
// getImageUrl(imagePath) {
//     return `${IMAGE_BASE_URL}/${imagePath}`;
//   },
