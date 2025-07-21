import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/ContextApi";
import Loading from "../Loading";
import OrderStatusTrack from "./OrderStatusTrack";

const OrderList = () => {
    const { orders, fetchOrders, updateOrderStatus } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [updatingOrders, setUpdatingOrders] = useState<Set<number>>(new Set());
    
    const ACTIVE_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                await fetchOrders();
            } catch (error) {
                toast.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        
        if (orders.length === 0) {
            fetch();
        }
    }, []);

    const handleStatusUpdate = async (
        orderId: number,
        newStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    ) => {
        if (newStatus === "cancelled") {
            const confirm = window.confirm(`Are you sure you want to cancel Order #${orderId}?`);
            if (!confirm) return;
        }
    
        setUpdatingOrders(prev => new Set(prev).add(orderId));
    
        try {
            await updateOrderStatus(orderId, newStatus);
            
            await fetchOrders();
            toast.success(`Order #${orderId} ${newStatus === "cancelled" ? "cancelled" : `updated to ${newStatus}`}`);
        } catch (error) {
            toast.error(`Failed to update order #${orderId}`);
        } finally {
            setUpdatingOrders(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });
        }
    };

    const isOrderCompleted = (status: string) => {
        return status === "delivered" || status === "cancelled";
    };

    const canUpdateToStatus = (currentStatus: string, targetStatus: string) => {
        if (isOrderCompleted(currentStatus)) return false;
        if (targetStatus === currentStatus) return false;
        
        if (targetStatus === "cancelled") return true;
        
        const currentIndex = ACTIVE_STATUSES.indexOf(currentStatus as any);
        const targetIndex = ACTIVE_STATUSES.indexOf(targetStatus as any);
        
        return targetIndex > currentIndex;
    };

    if (!Array.isArray(orders)) return null;

    return (
        <div className="space-y-4">
            {loading ? (
                <Loading />
            ) : (
                <>
                    {orders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No orders found
                        </div>
                    ) : (
                        orders.map(order => {
                            const isUpdating = updatingOrders.has(order.id);
                            
                            return (
                                <div key={order.id} className="bg-white p-6 rounded-lg shadow-md relative">
                                    {isUpdating ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                <span className="text-gray-600">Updating order...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        Order #{order.id}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Customer: {order.customer_name}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        order.status === "delivered" ? "bg-green-100 text-green-800" :
                                                        order.status === "cancelled" ? "bg-red-100 text-red-800" :
                                                        order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                                                        order.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-gray-100 text-gray-800"
                                                    }`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="font-medium text-gray-700 mb-2">Items:</h4>
                                                <ul className="space-y-1">
                                                    {order.items.map(item => (
                                                        <li key={item.id} className="text-sm text-gray-600 flex justify-between">
                                                            <span>{item.product_name} × {item.quantity}</span>
                                                            <span className="font-medium">
                                                                Rs-{(item.price * item.quantity).toFixed(2)}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="mb-4">
                                                <OrderStatusTrack 
                                                    statuses={order.status === "cancelled" ? 
                                                        ["pending", "cancelled"] : 
                                                        ACTIVE_STATUSES
                                                    } 
                                                    currentStatus={order.status}
                                                    onStatusClick={(status) => {
                                                        if (canUpdateToStatus(order.status, status)) {
                                                            handleStatusUpdate(order.id, status as typeof ACTIVE_STATUSES[number] | "cancelled");
                                                        }
                                                    }}
                                                    canUpdateToStatus={(status) => canUpdateToStatus(order.status, status)}
                                                />
                                            </div>

                                            {isOrderCompleted(order.status) && (
                                                <div className="border-t pt-4">
                                                    <p className="text-sm text-gray-500 italic text-center">
                                                        This order has been {order.status} and cannot be modified.
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })
                    )}
                </>
            )}
        </div>
    );
};

export default OrderList;