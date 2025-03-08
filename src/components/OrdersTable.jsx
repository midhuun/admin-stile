import React from "react";

const OrdersTable = ({ orders }) => {
  return (
    <div className="overflow-x-auto p-4">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="py-3 px-4 border">Order ID</th>
              <th className="py-3 px-4 border">Customer</th>
              <th className="py-3 px-4 border">Phone</th>
              <th className="py-3 px-4 border">Address</th>
              <th className="py-3 px-4 border">Payment</th>
              <th className="py-3 px-4 border">Status</th>
              <th className="py-3 px-4 border">Total</th>
              <th className="py-3 px-4 border">Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className="border-b hover:bg-gray-100 transition">
                <td className="py-3 px-4 border">{order.orderId}</td>
                <td className="py-3 px-4 border font-semibold">{order.address.name}</td>
                <td className="py-3 px-4 border">{order.user.phone}</td>
                <td className="py-3 px-4 border">
                  {order.address.location}, {order.address.city}, {order.pincode}
                </td>
                <td className="py-3 px-4 border">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs">
                    {order.paymentMethod} ({order.paymentStatus})
                  </span>
                </td>
                <td className="py-3 px-4 border text-blue-600 font-semibold">
                  {order.status}
                </td>
                <td className="py-3 px-4 border font-bold">₹{order.totalAmount}</td>
                <td className="py-3 px-4 border">
                  <ul>
                    {order.products.map((item) => (
                      <li key={item._id} className="flex items-center gap-3 text-sm mb-2">
                        <img
                          src={item.product.image || "https://via.placeholder.com/50"}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded-md border"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-gray-500 text-xs">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
