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