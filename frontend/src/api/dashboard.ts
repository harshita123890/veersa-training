import axios from "axios";
import type { Product, Customer, Order, OrderCreate } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const fetchProductsAPI = async (endpoint = ""): Promise<Product[]> => {
  const res = await axios.get(`${API_BASE_URL}/products/${endpoint}`, {
    headers: authHeaders(),
  });
  return res.data;
};


export const addProductAPI = async (data: Omit<Product, "id">): Promise<Product> => {
  const res = await axios.post(`${API_BASE_URL}/products/`, data, {
    headers: authHeaders(),
  });
  return res.data;
};

export const updateProductAPI = async (
  id: number,
  data: Omit<Product, "id">
): Promise<Product> => {
  const res = await axios.put(`${API_BASE_URL}/products/${id}/`, data, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deleteProductAPI = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/products/${id}/`, {
    headers: authHeaders(),
  });
};

export const fetchCustomersAPI = async (endpoint = ""): Promise<Customer[]> => {
  const res = await axios.get(`${API_BASE_URL}/customers/${endpoint}`, {
    headers: authHeaders(),
  });
  return res.data;
};
export const addCustomerAPI = async (data: Omit<Customer, "id">): Promise<Customer> => {
  const res = await axios.post(`${API_BASE_URL}/customers/`, data, {
    headers: authHeaders(),
  });
  return res.data;
};

export const updateCustomerAPI = async (
  id: number,
  data: Omit<Customer, "id">
): Promise<Customer> => {
  const res = await axios.put(`${API_BASE_URL}/customers/${id}/`, data, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deleteCustomerAPI = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/customers/${id}/`, {
    headers: authHeaders(),
  });
};

export const fetchOrdersAPI = async (): Promise<Order[]> => {
  const res = await axios.get(`${API_BASE_URL}/orders/`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const createOrderAPI = async (order: OrderCreate): Promise<void> => {
  await axios.post(`${API_BASE_URL}/orders/`, order, {
    headers: authHeaders(),
  });
};

export const updateOrderStatusAPI = async (
  id: number,
  status: Order["status"]
): Promise<void> => {
  await axios.patch(
    `${API_BASE_URL}/orders/${id}/`,
    { status },
    { headers: authHeaders() }
  );
};


export const fetchDashboardMetricsAPI = async () => {
  const res = await axios.get(`${API_BASE_URL}/metrics/`, {
    headers: authHeaders(),
  });
  return res.data;
};
