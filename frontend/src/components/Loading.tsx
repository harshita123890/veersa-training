const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full w-full py-4">
      <svg
        className="animate-spin h-8 w-8 text-blue-600"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
      <span className="ml-3 text-blue-600 font-medium text-lg">Loading...</span>
    </div>
  );
};

export default Loading;
