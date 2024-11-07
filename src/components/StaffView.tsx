import React from 'react';
import { ClipboardEdit, CheckCircle } from 'lucide-react';
import { Order } from '../types';

interface StaffViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export function StaffView({ orders, onUpdateOrderStatus }: StaffViewProps) {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'received': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (status: Order['status']): Order['status'] => {
    switch (status) {
      case 'received': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'completed';
      default: return 'completed';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-sm text-gray-500">
                  Order #{order.id.slice(0, 8)}
                </span>
                <div className={`inline-block px-3 py-1 rounded-full text-sm ml-3 ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>
              {order.status !== 'completed' && (
                <button
                  onClick={() => onUpdateOrderStatus(order.id, getNextStatus(order.status))}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                >
                  <ClipboardEdit className="w-4 h-4" />
                  <span>Update Status</span>
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {order.items.map(({ menuItem, quantity }) => (
                <div key={menuItem.id} className="flex justify-between items-center">
                  <span>{quantity}x {menuItem.name}</span>
                  <span>${(menuItem.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}