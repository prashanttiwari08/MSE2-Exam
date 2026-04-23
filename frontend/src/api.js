import axios from "axios";

const prod = "https://mse2-exam.onrender.com/api";
const dev = "http://localhost:5000/api";
const baseURL = window?.location?.hostname === "localhost" ? dev : prod;

const API = axios.create({
  baseURL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;