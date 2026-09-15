import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (image) => {
  if (!image) return "";

  const imagePath = String(image).trim().replace(/\\/g, "/");

  if (imagePath.startsWith("http://localhost:5000")) {
    return imagePath.replace("http://localhost:5000", BACKEND_URL);
  }

  if (imagePath.startsWith("https://lavogue-backend.onrender.com")) {
    return imagePath;
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const cleanImage = imagePath.replace(/^\/+/, "").replace(/^uploads\//, "");

  if (/^[a-f\d]{24}$/i.test(cleanImage)) {
    return `${BACKEND_URL}/api/images/${cleanImage}`;
  }

  return `${BACKEND_URL}/uploads/${cleanImage}`;
};

const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API;
