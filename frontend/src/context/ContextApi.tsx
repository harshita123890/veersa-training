import { createContext, useContext, useEffect, useState } from "react";
import type { Customer, Product } from "../types";

type ContextType = {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchProducts: (endpoint?: string) => Promise<void>;
    fetchCustomers: (endpoint?: string) => Promise<void>;
};

const Context = createContext<ContextType | undefined>(undefined);

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);


    const fetchProducts = async (endpoint = "") => {
        try {
            const token = localStorage.getItem("accessToken");

            setLoading(true);
            const res = await fetch(`http://localhost:8000/api/products/${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products");
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async (endpoint = "") => {
        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`http://localhost:8000/api/customers/${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setCustomers(data);
        } catch (err) {
            console.error("Error fetching customers");
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(()=>{
        console.log("Products fetched:", products);
    },[products]);
    useEffect(()=>{
        console.log("Customers fetched:", customers);
    },[customers]);


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
