import { useState, useEffect } from "react";
import type { Product } from "../../types";

type ProductFormProps = {
  onSubmit: (data: Omit<Product, "id">) => void;
  initialData: Product | null;
};

export default function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    sku: "",
    price: 0,
    stock_quantity: 0,
    status: "active",
  });

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setForm(rest);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" || name === "stock_quantity" ? Number(value) : value,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md border border-blue-100"
    >
      <div className="flex flex-col">
        <label htmlFor="name" className="mb-1 text-sm text-blue-700 font-medium">Product Name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter product name"
          className="p-2 border border-gray-300 rounded outline-blue-500 placeholder:text-sm placeholder:text-gray-400"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="sku" className="mb-1 text-sm text-blue-700 font-medium">SKU</label>
        <input
          type="text"
          name="sku"
          id="sku"
          placeholder="Stock Keeping Unit"
          className="p-2 border border-gray-300 rounded outline-blue-500 placeholder:text-sm placeholder:text-gray-400"
          value={form.sku}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="price" className="mb-1 text-sm text-blue-700 font-medium">Price (₹)</label>
        <input
          type="text"
          name="price"
          id="price"
          placeholder="Enter price in INR"
          className="p-2 border border-gray-300 rounded outline-blue-500 placeholder:text-sm placeholder:text-gray-400"
          value={form.price}
          onChange={handleChange}
          required
          min={0}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="stock_quantity" className="mb-1 text-sm text-blue-700 font-medium">Stock Quantity</label>
        <input
          type="text"
          name="stock_quantity"
          id="stock_quantity"
          placeholder="Units in stock"
          className="p-2 border border-gray-300 rounded outline-blue-500 placeholder:text-sm placeholder:text-gray-400"
          value={form.stock_quantity}
          onChange={handleChange}
          required
          min={0}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="status" className="mb-1 text-sm text-blue-700 font-medium">Status</label>
        <select
          name="status"
          id="status"
          className="p-2 border border-gray-300 rounded outline-blue-500 text-sm"
          value={form.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {initialData ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
}
