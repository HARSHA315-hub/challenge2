import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

/* ===================== ORDERS ===================== */

export const getOrders = () => API.get("/orders/customer-orders/");
export const createOrder = (data) =>
  API.post("/orders/customer-orders/", data);
export const updateOrder = (id, data) =>
  API.put(`/orders/customer-orders/${id}/`, data);
export const deleteOrder = (id) =>
  API.delete(`/orders/customer-orders/${id}/`);

/* ===================== DASHBOARD ===================== */

// GET layout + widgets
export const getDashboardConfig = () =>
  API.get("/dashboard/layouts/");

// SAVE layout + widgets
export const saveDashboardConfig = (data) =>
  API.post("/dashboard/layouts/", data);