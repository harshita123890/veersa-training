import { useEffect, useState } from "react";
import type { Customer } from "../../types";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { useAppContext } from "../../context/ContextApi";
import debounce from "lodash.debounce";
import CustomerForm from "./CustomerForm";
import CustomerTable from "./CustomerTable";
import { addCustomerAPI, deleteCustomerAPI, updateCustomerAPI } from "../../api/dashboard";

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
    const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>(customers);

    useEffect(() => {
        if (customers.length === 0) {
            fetchCustomers();
        }
    }, []);

    useEffect(() => {
        setDisplayedCustomers(customers);
    }, [customers]);

    useEffect(() => {
        if (searchTerm !== '') {
            const debounced = debounce(() => {
                setDisplayedCustomers(
                    customers.filter(c =>
                        c.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                );
            }, 500);
            debounced();
            return () => debounced.cancel();
        } else {
            setDisplayedCustomers(customers);
        }
    }, [searchTerm, customers]);

    const handleSubmit = async (data: Omit<Customer, "id">) => {
        try {
            setLoading(true);

            if (editing) {
                const updatedCustomer = await updateCustomerAPI(editing.id, data);
                toast.success("Customer updated successfully!");

                setCustomers((prev) =>
                    prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
                );
            } else {
                const newCustomer = await addCustomerAPI(data);
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
            await deleteCustomerAPI(id);
            toast.success("Customer deleted");

            setCustomers((prev) => prev.filter((c) => c.id !== id));
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
                    <CustomerTable customers={displayedCustomers} onEdit={setEditing} onDelete={handleDelete} />
                </>
            )}
        </div>
    );
};

export default Customers;
