export type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  status: "active" | "inactive";
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type OrderItem = {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: number;
};
export type Order = {
  id: number;
  customer: number;
  customer_name: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  items: OrderItem[];
};
export type OrderItemCreate = {
  product: number;
  quantity: number;
};
export type OrderCreate = {
  customer: number;
  items: OrderItemCreate[];
  status: string; 
};