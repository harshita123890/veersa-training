import type { Customer } from "../../types";

type Props = {
  customers: Customer[];
  onEdit: (c: Customer) => void;
  onDelete: (id: number) => void;
};

export default function CustomerTable({ customers, onEdit, onDelete }: Props) {
  return (
    <table className="w-full bg-white shadow rounded mt-4">
      <thead className="bg-blue-100">
        <tr>
          <th className="p-2">Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr key={c.id} className="text-center border-t">
            <td>{c.name}</td>
            <td>{c.email}</td>
            <td>{c.phone}</td>
            <td>{c.address}</td>
            <td>
              <button onClick={() => onEdit(c)} className="text-blue-600 mr-2">Edit</button>
              <button onClick={() => onDelete(c.id)} className="text-red-600">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
