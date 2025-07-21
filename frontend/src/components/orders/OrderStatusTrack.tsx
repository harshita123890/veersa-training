import { FaCarSide, FaTimes, FaCheck } from "react-icons/fa";

type Props = {
  statuses: readonly string[];
  currentStatus: string;
  onStatusClick?: (status: string) => void;
  canUpdateToStatus?: (status: string) => boolean;
};

const OrderStatusTrack = ({ 
  statuses, 
  currentStatus, 
  onStatusClick,
  canUpdateToStatus 
}: Props) => {
  const currentIndex = statuses.indexOf(currentStatus);
  const isCancelled = currentStatus === "cancelled";

  const getStatusColor = (status: string, index: number) => {
    if (isCancelled) {
      if (status === "cancelled") {
        return "bg-red-500 border-red-500 text-white";
      }
      return "bg-gray-200 border-gray-400 text-gray-400";
    }

    if (index < currentIndex) {
      return "bg-green-500 border-green-500 text-white";
    } else if (index === currentIndex) {
      return "bg-blue-500 border-blue-500 text-white";
    } else {
      return "bg-gray-200 border-gray-400 text-gray-400";
    }
  };

  const getTextColor = (status: string, index: number) => {
    if (isCancelled && status === "cancelled") {
      return "text-red-700 font-semibold";
    }
    if (index === currentIndex) {
      return "text-blue-700 font-semibold";
    }
    return "text-gray-500";
  };

  const getProgressBarColor = () => {
    if (isCancelled) return "bg-red-200";
    return "bg-gray-300";
  };

  const getProgressFillColor = () => {
    if (isCancelled) return "bg-red-500";
    return "bg-green-500";
  };

  const getProgressWidth = () => {
    if (isCancelled) return "0%";
    if (currentIndex === 0) return "0%";
    return `${(currentIndex / (statuses.length - 1)) * 100}%`;
  };

  const renderIcon = (status: string, index: number) => {
    if (isCancelled && status === "cancelled") {
      return <FaTimes className="text-xs" />;
    }
    
    if (index < currentIndex) {
      return <FaCheck className="text-xs" />;
    }
    
    if (index === currentIndex && !isCancelled) {
      return <FaCarSide className="text-blue-600 text-xl animate-bounce" />;
    }
    
    return <span className="text-xs font-semibold">{index + 1}</span>;
  };

  const isClickable = (status: string) => {
    return onStatusClick && canUpdateToStatus && canUpdateToStatus(status);
  };

  const getClickableStyles = (status: string) => {
    if (isClickable(status)) {
      return "cursor-pointer hover:scale-110 transition-transform duration-200";
    }
    return "";
  };

  const handleStatusClick = (status: string) => {
    if (isClickable(status)) {
      onStatusClick!(status);
    }
  };

  return (
    <div className="relative my-6 px-4">
      <div className="flex items-center justify-between w-full ">
        {statuses.map((status, idx) => (
          <div key={status} className="flex flex-col items-center flex-1">
            <div style={{ height: 28 }} className="flex items-center justify-center">
              {idx === currentIndex && !isCancelled && (
                <FaCarSide className="text-blue-600 text-xl animate-bounce" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className=" h-1 rounded-full overflow-hidden">
        <div className={`h-full ${getProgressBarColor()}`}>
          <div
            className={`h-full transition-all duration-500 ${getProgressFillColor()}`}
            style={{ width: getProgressWidth() }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        {statuses.map((status, idx) => (
          <div key={status} className="flex flex-col items-center flex-1 relative">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStatusColor(status, idx)} ${getClickableStyles(status)}`}
              onClick={() => handleStatusClick(status)}
              title={isClickable(status) ? `Click to update to ${status}` : undefined}
            >
              {idx === currentIndex && !isCancelled ? (
                <span className="text-xs font-semibold">{idx + 1}</span>
              ) : (
                renderIcon(status, idx)
              )}
            </div>
            <span
              className={`mt-2 text-xs text-center ${getTextColor(status, idx)} ${getClickableStyles(status)}`}
              onClick={() => handleStatusClick(status)}
              title={isClickable(status) ? `Click to update to ${status}` : undefined}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            
           
          </div>
        ))}
      </div>

      

      {isCancelled && (
        <div className="mt-4 text-center">
          <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
            Order Cancelled
          </span>
        </div>
      )}
      
      {currentStatus === "delivered" && (
        <div className="mt-4 text-center">
          <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            Order Delivered Successfully
          </span>
        </div>
      )}

      {onStatusClick && !isCancelled && currentStatus !== "delivered" && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Click on a status to update the order
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderStatusTrack;