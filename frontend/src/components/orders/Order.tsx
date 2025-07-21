import {  useState } from "react";
import OrderForm from "../../components/orders/OrderForm";
import OrderList from "../../components/orders/OrderList";

const Order = () => {
  const [activeTab, setActiveTab] = useState<"new" | "list">("new");

  return (
    <div className="max-w-full mx-auto py-8 px-4">
      <div className="flex border-b mb-6 justify-evenly">
        <button
          onClick={() => setActiveTab("new")}
          className={`py-2 px-4 w-full rounded-t-lg font-semibold ${
            activeTab === "new"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
        New Order
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`py-2 px-4 w-full rounded-t-lg font-semibold ml-2 ${
            activeTab === "list"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Past Orders
        </button>
      </div>

        {activeTab === "new" ? <OrderForm /> : <OrderList />}
    </div>
  );
};

export default Order;
