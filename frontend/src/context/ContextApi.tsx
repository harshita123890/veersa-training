import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Customer, Order, OrderCreate, Product } from "../types";
import {
  fetchProductsAPI,
  fetchCustomersAPI,
  fetchOrdersAPI,
  createOrderAPI,
  updateOrderStatusAPI,
} from "../api/dashboard"; 

type ContextType = {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchProducts: (endpoint?: string) => Promise<Product[]>;
    fetchCustomers: (endpoint?: string) => Promise<Customer[]>;
    orders: Order[];
    fetchOrders: () => Promise<void>;
    createOrder: (order: OrderCreate) => Promise<void>;
    updateOrderStatus: (orderId: number, status: Order['status']) => Promise<void>;
    dashboardData: any;
    setDashboardData: React.Dispatch<React.SetStateAction<any>>;
};

const Context = createContext<ContextType | undefined>(undefined);

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [dashboardData, setDashboardData] = useState<any>(null);


 const fetchProducts = useCallback(async (endpoint = "") => {
  try {
    setLoading(true);
    const data = await fetchProductsAPI(endpoint);
    setProducts(data);
    return data;
  } catch (err) {
    console.error("Error fetching products", err);
    return []; 
  } finally {
    setLoading(false);
  }
}, []);

const fetchCustomers = useCallback(async (endpoint = "") => {
  try {
    setLoading(true);
    const data = await fetchCustomersAPI(endpoint);
    setCustomers(data);
    return data;
  } catch (err) {
    console.error("Error fetching customers", err);
    return []; 
  } finally {
    setLoading(false);
  }
}, []);

const fetchOrders = async () => {
  try {
    const data = await fetchOrdersAPI();
    setOrders(data);
  } catch (err) {
    console.error("Error fetching orders", err);
  }
};

const createOrder = async (orderData: OrderCreate) => {
  try {
    await createOrderAPI(orderData);
    fetchOrders();
  } catch (err) {
    console.error("Error creating order", err);
  }
};

const updateOrderStatus = async (id: number, status: Order["status"]) => {
  try {
    await updateOrderStatusAPI(id, status);
  } catch (err) {
    console.error("Error updating order status", err);
  }
};



    useEffect(() => {
        console.log("Products fetched:", products);
    }, [products]);
    useEffect(() => {
        console.log("Customers fetched:", customers);
    }, [customers]);


    return (
        <Context.Provider
            value={{
                products,
                setProducts,
                customers,
                setCustomers,
                fetchCustomers,
                loading,
                setLoading,
                fetchProducts,
                orders,
                fetchOrders,
                createOrder,
                updateOrderStatus,
                dashboardData,
                setDashboardData,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("useProductContext must be used within a Provider");
    }
    return context;
};
