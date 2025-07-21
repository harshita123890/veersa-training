import type { Customer } from "../../types";

type Props = {
  customers: Customer[];
  onEdit: (c: Customer) => void;
  onDelete: (id: number) => void;
};

export default function CustomerTable({ customers, onEdit, onDelete }: Props) {
  return (
    <table className="w-full bg-white border rounded shadow text-sm mt-6">
      <thead className="bg-blue-100">
        <tr>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Phone</th>
          <th className="p-2 border">Address</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr key={c.id} className="text-center border-t">
            <td className="p-2 border">{c.name}</td>
            <td className="p-2 border">{c.email}</td>
            <td className="p-2 border">{c.phone}</td>
            <td className="p-2 border">{c.address}</td>
            <td className="p-2 border space-x-2">
              <button onClick={() => onEdit(c)} className="text-blue-600">Edit</button>
              <button onClick={() => onDelete(c.id)} className="text-red-500">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
