import { useEffect } from "react";
import { toast } from "react-toastify";
import { fetchDashboardMetricsAPI } from "../api/dashboard";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid
} from "recharts";
import Loading from "../components/Loading";
import { useAppContext } from "../context/ContextApi";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

const DashboardPanel = () => {
    const {
        dashboardData, setDashboardData
    } = useAppContext();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchDashboardMetricsAPI();
                setDashboardData(res);
            } catch {
                toast.error("Failed to load dashboard metrics.");
            }
        };
        fetchData();
    }, []);

    if (!dashboardData) return <Loading />;

    const topProductsData = dashboardData.top_products.map((item: any) => ({
        name: item.product__name,
        sold_quantity: item.sold_quantity,
    }));


    return (
        <div className=" gap-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                <div className="bg-white shadow rounded p-4">
                    <h3 className="font-semibold text-lg">Total Orders (This Month)</h3>
                    <p className="text-2xl text-blue-600">{dashboardData.total_orders}</p>
                </div>

                <div className="bg-white shadow rounded p-4">
                    <h3 className="font-semibold text-lg">Revenue</h3>
                    <p className="text-2xl text-green-600">₹ {dashboardData.total_revenue}</p>
                </div>

                <div className="bg-white shadow rounded p-4">
                    <h3 className="font-semibold text-lg"> Active Products</h3>
                    <p className="text-2xl text-purple-600">{dashboardData.total_active_products}</p>
                </div>

                <div className="bg-white shadow rounded p-4">
                    <h3 className="font-semibold text-lg">Total Customers</h3>
                    <p className="text-2xl text-orange-600">{dashboardData.total_customers}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-1 md:col-span-2">
                <div className="bg-white shadow rounded p-4">
                    <h3 className="font-semibold text-lg mb-4">Monthly Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dashboardData.monthly_revenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#8884d8" name="Revenue ₹" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white shadow rounded p-4">
                    <h3 className="font-semibold text-lg mb-4"> Top 5 Selling Products</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={topProductsData}
                                dataKey="sold_quantity"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {topProductsData.map((_: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                </div>
            </div>


            <div className="bg-white shadow rounded p-4 col-span-1 md:col-span-2 mt-4">
                <h3 className="font-semibold text-lg mb-2">Low Stock Warnings</h3>
                <ul className="list-disc pl-6 text-sm text-red-600">
                    {dashboardData.low_stock.length === 0 ? (
                        <li>All good. No low stock products.</li>
                    ) : (
                        dashboardData.low_stock.map((p: any) => (
                            <li key={p.id}>
                                {p.name} — Stock left: {p.stock_quantity}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default DashboardPanel;
