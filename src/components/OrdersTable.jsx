import React from 'react';

const OrdersTable = ({ orders }) => {
  return (
    <div className="overflow-x-auto p-4">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="hidden md:block">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-left">
              <tr>
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
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 border">{order.orderId}</td>
                  <td className="py-3 px-4 border font-semibold">{order.address.name}</td>
                  <td className="py-3 px-4 border">{order.user.phone}</td>
                  <td className="py-3 px-4 border">
                    {order.address.location}, {order.address.city}, {order.pincode}
                  </td>
                  <td className="py-3 px-4 border">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        order.paymentStatus === 'Paid' ? ' text-green-700' : ' text-red-700'
                      }`}
                    >
                      {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </td>
                  <td className="py-3 px-4 border">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        order.status === 'Completed'
                          ? ' text-green-700'
                          : order.status === 'Pending'
                          ? ' text-yellow-700'
                          : ' text-blue-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border font-bold">₹{order.totalAmount}</td>
                  <td className="py-3 px-4 border">
                    <ul className="space-y-2">
                      {order.products.map((item) => (
                        <li key={item._id} className="flex items-center gap-3 text-sm">
                          <img
                            src={item.product.image || 'https://via.placeholder.com/50'}
                            alt={item.product.name}
                            className="w-10 h-10 object-cover rounded-md border"
                          />
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-gray-500 text-xs">
                              Size: {item.selectedSize} | Qty: {item.quantity}
                            </p>
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

        {/* Mobile View - Card Layout */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-white shadow-sm rounded-lg p-4 border">
              <p className="text-sm font-semibold text-gray-800">Order ID: {order.orderId}</p>
              <p className="text-sm text-gray-600">Customer: {order.address.name}</p>
              <p className="text-sm text-gray-600">Phone: {order.user.phone}</p>
              <p className="text-sm text-gray-600">
                Address: {order.address.location}, {order.address.city}, {order.pincode}
              </p>
              <p className="text-sm">
                Payment:
                <span
                  className={`ml-1 px-2 py-1 rounded-md text-xs font-medium ${
                    order.paymentStatus === 'Paid' ? ' text-green-700' : ' text-red-700'
                  }`}
                >
                  {order.paymentMethod} ({order.paymentStatus})
                </span>
              </p>
              <p className="text-sm">
                Status:
                <span
                  className={`ml-1 px-2 py-1 rounded-md text-xs font-semibold ${
                    order.status === 'Completed'
                      ? ' text-green-700'
                      : order.status === 'Pending'
                      ? ' text-yellow-700'
                      : ' text-blue-700'
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="text-sm font-bold">Total: ₹{order.totalAmount}</p>
              <div className="mt-2">
                {order.products.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 text-sm border-t pt-2 mt-2"
                  >
                    <img
                      src={item.product.image || 'https://via.placeholder.com/50'}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded-md border"
                    />
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-500 text-xs">
                        Size: {item.selectedSize} | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
