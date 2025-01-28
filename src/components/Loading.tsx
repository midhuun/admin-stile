import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Loading Text */}
        <p className="text-lg font-medium text-gray-700 animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
