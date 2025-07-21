import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/ContextApi";
import type { OrderItemCreate, Product, Customer } from "../../types";
import SearchDropdown from "./SearchDropdown";

const OrderForm = () => {
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productOptions, setProductOptions] = useState<Product[]>([]);
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<OrderItemCreate[]>([]);
  
  // Loading states
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  
  // Dropdown visibility states
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const { fetchProducts, fetchCustomers, createOrder, products, customers } = useAppContext();

  const customerDropdownRef = useRef<HTMLDivElement | null>(null);
  const productDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, []);

  useEffect(() => {
    if (customers.length === 0) {
      fetchCustomers();
    }
  }, []);

  useEffect(() => {
    const filtered = customers.filter(c =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.toLowerCase().includes(customerSearch.toLowerCase())
    );
    setCustomerOptions(filtered);
  }, [customerSearch, customers]);

  useEffect(() => {
    const filtered = products.filter(p =>
      p.status === 'active' &&
      p.stock_quantity > 0 &&
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    );
    setProductOptions(filtered);
  }, [productSearch, products]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(e.target as Node)
      ) {
        setShowCustomerDropdown(false);
      }
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(e.target as Node)
      ) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableProducts = productOptions.filter(p => p.status === 'active' && p.stock_quantity > 0);

  const addItem = (product: Product) => {
    setItems([...items, { product: product.id, quantity: 1 }]);
    setProductSearch("");
    setShowProductDropdown(false);
  };

  const handleCustomerInputClick = async () => {
    if (customers.length === 0) {
      setIsLoadingCustomers(true);
      try {
        await fetchCustomers();
      } finally {
        setIsLoadingCustomers(false);
      }
    }
    setShowCustomerDropdown(true);
  };

  const handleProductInputClick = async () => {
    if (products.length === 0) {
      setIsLoadingProducts(true);
      try {
        await fetchProducts();
      } finally {
        setIsLoadingProducts(false);
      }
    }
    setShowProductDropdown(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customer || items.length === 0) {
      toast.error("Fill all required fields");
      return;
    }

    try {
      await createOrder({ customer: customer.id, items, status: "pending" });
      toast.success("Order placed!");
      setCustomer(null);
      setItems([]);
      setCustomerSearch("");
      setProductSearch("");
      setShowCustomerDropdown(false);
      setShowProductDropdown(false);
    } catch (e: any) {
      toast.error(e.response?.data?.items?.join("\n") || "Error placing order");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow  mx-auto space-y-4">
      <div ref={customerDropdownRef}>
        <SearchDropdown
          value={customerSearch}
          placeholder={isLoadingCustomers ? "Loading customers..." : "Click to select customer..."}
          options={customerOptions}
          getOptionLabel={(c) => `${c.name} — ${c.phone}`}
          onChange={setCustomerSearch}
          onSelect={(c) => {
            setCustomer(c);
            setCustomerSearch(c.name);
            setShowCustomerDropdown(false);
          }}
          showDropdown={showCustomerDropdown && !!customerOptions.length && !customer}
          setShowDropdown={setShowCustomerDropdown}
          onFocus={handleCustomerInputClick}
          disabled={isLoadingCustomers}
        />
      </div>
      
      {customer && (
        <p className="text-sm text-green-700 mt-1">
          Selected: {customer.name} ({customer.email})
        </p>
      )}

      <div ref={productDropdownRef}>
        <SearchDropdown
          value={productSearch}
          placeholder={isLoadingProducts ? "Loading products..." : "Click to select product..."}
          options={availableProducts}
          getOptionLabel={(p) => `${p.name} — Stock: ${p.stock_quantity}`}
          onChange={setProductSearch}
          onSelect={(p) => {
            addItem(p);
            setProductSearch("");
            setShowProductDropdown(false);
          }}
          showDropdown={showProductDropdown && !!productOptions.length}
          setShowDropdown={setShowProductDropdown}
          onFocus={handleProductInputClick}
          disabled={isLoadingProducts}
        />
      </div>

      <div>
        {items.map((item, i) => {
          const product = products.find(p => p.id === item.product);
          return (
            <div key={i} className="flex gap-2 items-center mb-2">
              <span className="flex-1 text-sm">
                {product?.name || `Product #${item.product}`}
              </span>
              <input
                type="number"
                min={1}
                max={product?.stock_quantity || 999}
                className="w-20 p-1 border rounded"
                value={item.quantity}
                onChange={e => {
                  const newItems = [...items];
                  newItems[i].quantity = +e.target.value;
                  setItems(newItems);
                }}
              />
              <button
                type="button"
                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoadingCustomers || isLoadingProducts}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Place Order
        </button>
        <button
          type="button"
          onClick={() => {
            setCustomer(null);
            setCustomerSearch("");
            setProductSearch("");
            setItems([]);
            setShowCustomerDropdown(false);
            setShowProductDropdown(false);
          }}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default OrderForm;