import { useEffect, useState } from "react";
import type { Customer } from "../../types";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { useAppContext } from "../../context/ContextApi";
import debounce from "lodash.debounce";
import CustomerForm from "./CustomerForm";
import CustomerTable from "./CustomerTable";

const Customers = () => {
    const {
        customers,
        setCustomers,
        fetchCustomers,
        loading,
        setLoading,
    } = useAppContext();

    const [editing, setEditing] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (customers.length === 0) {
            fetchCustomers();
        }
    }, []);

    useEffect(() => {
        if(searchTerm!=='') {
        const debounced = debounce(() => {
            fetchCustomers(`?search=${encodeURIComponent(searchTerm)}`);
        }, 500);

        debounced();

        return () => debounced.cancel();
    }
    }, [searchTerm]);

    const handleSubmit = async (data: Omit<Customer, "id">) => {
        try {
            setLoading(true);
            if (editing) {
                const res = await axios.put(`http://localhost:8000/api/customers/${editing.id}/`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const updatedCustomer = res.data;
                toast.success("Customer updated successfully!");

                setCustomers((prev) =>
                    prev.map((prod) => (prod.id === updatedCustomer.id ? updatedCustomer : prod))
                );
            } else {
                const res = await axios.post("http://localhost:8000/api/customers/", data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const newCustomer = res.data;
                toast.success("Customer added successfully!");

                setCustomers((prev) => [newCustomer, ...prev]);
            }

            setEditing(null);
        } catch {
            toast.error("Error saving customer.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:8000/api/customers/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Customers deleted");

            setCustomers((prev) => prev.filter((customer) => customer.id !== id));
        } catch {
            toast.error("Error deleting customer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-700">📦 Customers</h2>
                <div className="space-x-2 flex items-center">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="p-2 border border-gray-300 rounded outline-blue-400 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                </div>



            </div>
            <CustomerForm onSubmit={handleSubmit} initialData={editing} />

            {loading ? (
                <Loading />
            ) : (
                <>
                    <CustomerTable customers={customers} onEdit={setEditing} onDelete={handleDelete} />
                </>
            )}
        </div>
    );
};

export default Customers;
