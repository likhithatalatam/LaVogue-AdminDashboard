import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image.replace("http://localhost:5000", BACKEND_URL);
  }

  const cleanImage = image.replace(/^\/?uploads\//, "");

  return `${BACKEND_URL}/uploads/${cleanImage}`;
};

const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API;
