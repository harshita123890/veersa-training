import { useState, useEffect } from "react";
import type { Customer } from "../../types";

type Props = {
  initialData: Customer | null;
  onSubmit: (data: Omit<Customer, "id">) => void;
};

export default function CustomerForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Omit<Customer, "id">>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setForm(rest);
    }
  }, [initialData]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="grid md:grid-cols-2  gap-4 bg-white p-6 rounded-lg shadow-md border border-blue-100"
    >
      {["name", "email", "phone", "address"].map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          value={form[field as keyof typeof form]}
          onChange={(e) =>
            setForm({ ...form, [field]: e.target.value })
          }
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          className="border p-2 rounded"
          required
        />
      ))}
      <div className="md:col-span-2">

        <button type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {initialData ? "Update" : "Add"} Customer
        </button>
      </div>
    </form>
  );
}
