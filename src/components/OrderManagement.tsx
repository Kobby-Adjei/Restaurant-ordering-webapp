import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { OrderStatus } from '../types';

const OrderManagement: React.FC = () => {
  const { state, dispatch } = useRestaurant();

  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  const nextStatus: Record<OrderStatus, OrderStatus> = {
    pending: 'preparing',
    preparing: 'ready',
    ready: 'completed',
    completed: 'completed',
  };

  const handleStatusUpdate = (orderId: string, currentStatus: OrderStatus) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, status: nextStatus[currentStatus] },
    });
  };

  const activeOrders = state.orders.filter((order) => order.status !== 'completed');
  const completedOrders = state.orders.filter((order) => order.status === 'completed');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Active Orders</h2>
        <div className="grid gap-6">
          {activeOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id.slice(-4)}</h3>
                  <p className="text-gray-600">Customer: {order.customerName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  {order.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, order.status)}
                      className="ml-4 p-2 text-blue-600 hover:text-blue-800"
                    >
                      <Clock size={20} />
                    </button>
                  )}
                </div>
              </div>
              <div className="border-t pt-4">
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Completed Orders</h2>
        <div className="grid gap-4">
          {completedOrders.map((order) => (
            <div key={order.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Order #{order.id.slice(-4)}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={20} />
                  <span className="text-green-600">Completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};