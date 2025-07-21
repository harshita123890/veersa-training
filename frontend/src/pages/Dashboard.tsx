import { useState } from "react";
import Products from "../components/products/Product";
import Customers from "../components/customers/Customer";
import Order from "../components/orders/Order";
import DashboardPanel from "./DashboardPanel";
import { FaLeftLong, FaRightLong } from "react-icons/fa6";

type Tab = "metrics" | "products" | "customers" | "orders";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("metrics");
  const [showSidebar, setShowSidebar] = useState(true); // start with sidebar open

  const renderContent = () => {
    switch (activeTab) {
      case "metrics":
        return <DashboardPanel />;
      case "products":
        return <Products />;
      case "customers":
        return <Customers />;
      case "orders":
        return <Order />;
      default:
        return <div className="text-gray-600 text-lg">📊 Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-row relative" style={{ height: "calc(100vh - 64px)" }}>
      <aside
        className={`transition-all duration-300 ease-in-out bg-blue-700 text-white shadow-lg z-20
  h-[calc(100vh-64px)] flex flex-row justify-between space-y-6 p-4 
  ${showSidebar ? "md:w-64 w-42" : "md:w-12 w-6"} relative`}
      >
        <div className="flex flex-col w-full md:w-auto">

         
          {showSidebar ? (
            <>
              <h2
                className="text-2xl font-bold cursor-pointer whitespace-nowrap"
                onClick={() => setActiveTab("metrics")}
              >
                Admin Panel
              </h2>
              <nav className="flex flex-col space-y-3 mt-4">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`text-left transition px-3 py-2 rounded-lg font-semibold text-lg ${activeTab === "products" ? "bg-blue-900 text-blue-200 shadow" : "hover:bg-blue-600"
                    }`}
                >
                  Products
                </button>
                <button
                  onClick={() => setActiveTab("customers")}
                  className={`text-left transition px-3 py-2 rounded-lg font-semibold text-lg ${activeTab === "customers" ? "bg-blue-900 text-blue-200 shadow" : "hover:bg-blue-600"
                    }`}
                >
                  Customers
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`text-left transition px-3 py-2 rounded-lg font-semibold text-lg ${activeTab === "orders" ? "bg-blue-900 text-blue-200 shadow" : "hover:bg-blue-600"
                    }`}
                >
                  Orders
                </button>
              </nav>
            </>
          ) : null}
        </div>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className=" "
        >
          {showSidebar ? <FaLeftLong size={14} /> : <FaRightLong size={14} />}
        </button>
      </aside>

      <main className="flex-1 bg-blue-50 p-4 md:p-8 overflow-y-scroll z-0">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
