import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import type { Product } from "../../types";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import { useAppContext } from "../../context/ContextApi";
const Products = () => {
  const {
    products,
    fetchProducts,
    setProducts,
    loading,
    setLoading,
  } = useAppContext();
  const [editing, setEditing] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("accessToken");



  useEffect(() => {
    if (products.length === 0) {
    fetchProducts();
  }
  }, []);

  useEffect(() => {
    if(searchTerm!=='') {
    const debounced = debounce(() => {
      fetchProducts(`?search=${encodeURIComponent(searchTerm)}`);
    }, 500);

    debounced();

    return () => debounced.cancel();
  }
  }, [searchTerm]);

  const handleSubmit = async (data: Omit<Product, "id">) => {
    try {
      setLoading(true);
      if (editing) {
        const res = await axios.put(`http://localhost:8000/api/products/${editing.id}/`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedProduct = res.data;
        toast.success("Product updated successfully!");

        setProducts((prev) =>
          prev.map((prod) => (prod.id === updatedProduct.id ? updatedProduct : prod))
        );
      } else {
        const res = await axios.post("http://localhost:8000/api/products/", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const newProduct = res.data;
        toast.success("Product added successfully!");

        setProducts((prev) => [newProduct, ...prev]);
      }

      setEditing(null);
    } catch {
      toast.error("Error saving product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/api/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");

      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch {
      toast.error("Error deleting product.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-700">📦 Products</h2>
        <div className="space-x-2 flex items-center">
          <input
            type="text"
            placeholder="Search by name..."
            className="p-2 border border-gray-300 rounded outline-blue-400 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
         
        </div>
        <div className="space-x-2">
          <button
            onClick={() => fetchProducts("")}
            className=" cursor-pointer px-3 py-1 bg-blue-600 text-white rounded"
          >
            All
          </button>
          <button
            onClick={() => fetchProducts("low_stock/")}
            className="cursor-pointer px-3 py-1 bg-yellow-500 text-white rounded"
          >
            Low Stock
          </button>
          <button
            onClick={() => fetchProducts("out_of_stock/")}
            className="cursor-pointer px-3 py-1 bg-red-600 text-white rounded"
          >
            Out of Stock
          </button>
        </div>
        <div className="space-x-2 mt-2">


          <select
            onChange={(e) => {
              const val = e.target.value;
              const sorted = [...products].sort((a, b) => {
                if (val === "asc") return a.stock_quantity - b.stock_quantity;
                if (val === "desc") return b.stock_quantity - a.stock_quantity;
                return 0;
              });
              setProducts(sorted);
            }}
            className="p-1 border rounded"
          >
            <option value="none">Sort Stock</option>
            <option value="asc">Stock: Low → High</option>
            <option value="desc">Stock: High → Low</option>
          </select>
        </div>

      </div>
      <ProductForm onSubmit={handleSubmit} initialData={editing} />

      {loading ? (
        <Loading />
      ) : (
        <>
          <ProductTable products={products} onEdit={setEditing} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
};

export default Products;
