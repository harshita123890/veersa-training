import { useState } from "react";
import Products from "../components/products/Product";
import Customers from "../components/customers/Customer";

type Tab = "dashboard" | "products" | "customers" | "orders";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <Products />;
      case "customers":
        return <Customers />;
      // case "orders":
      //   return <Orders />;
      default:
        return <div className="text-gray-600 text-lg">📊 Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]"> {/* 64px navbar height assumed */}
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6 cursor-pointer " onClick={() => setActiveTab("products")}>Admin Panel</h2>
        <nav className="flex flex-col space-y-3">
          <button
            onClick={() => setActiveTab("products")}
            className={`text-left transition cursor-pointer ${
              activeTab === "products"
                ? "text-blue-200 font-semibold"
                : "text-white hover:text-blue-300"
            }`}
          >
            📦 Products
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`text-left transition cursor-pointer ${
              activeTab === "customers"
                ? "text-blue-200 font-semibold"
                : "text-white hover:text-blue-300"
            }`}
          >
            👥 Customers
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`text-left transition cursor-pointer ${
              activeTab === "orders"
                ? "text-blue-200 font-semibold"
                : "text-white hover:text-blue-300"
            }`}
          >
            📑 Orders
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-blue-50 p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
