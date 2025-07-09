import type { Product } from "../../types";

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
};

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <table className="w-full bg-white border rounded shadow text-sm mt-6">
      <thead className="bg-blue-100">
        <tr>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">SKU</th>
          <th className="p-2 border">Price</th>
          <th className="p-2 border">Stock</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((prod) => (
          <tr key={prod.id} className="text-center border-t">
            <td className="p-2 border">{prod.name}</td>
            <td className="p-2 border">{prod.sku}</td>
            <td className="p-2 border">₹{prod.price}</td>
            <td className="p-2 border">{prod.stock_quantity}</td>
            <td className="p-2 border">
              <span className={`px-2 py-1 rounded text-white text-xs ${
                prod.status === "active" ? "bg-green-500" : "bg-gray-500"
              }`}>
                {prod.status}
              </span>
            </td>
            <td className="p-2 border space-x-2">
              <button onClick={() => onEdit(prod)} className="text-blue-600">Edit</button>
              <button onClick={() => onDelete(prod.id)} className="text-red-500">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
