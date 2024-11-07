import React from 'react';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import { MenuItem, Order } from '../types';

interface CartViewProps {
  cart: Map<string, number>;
  menuItems: MenuItem[];
  onRemoveFromCart: (itemId: string) => void;
  onAddToCart: (itemId: string) => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'status' | 'timestamp'>) => void;
}

export function CartView({
  cart,
  menuItems,
  onRemoveFromCart,
  onAddToCart,
  onPlaceOrder,
}: CartViewProps) {
  const cartItems = Array.from(cart.entries()).map(([id, quantity]) => ({
    item: menuItems.find(item => item.id === id)!,
    quantity
  }));

  const subtotal = cartItems.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  );

  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    const orderItems = cartItems.map(({ item, quantity }) => ({
      menuItem: item,
      quantity
    }));

    onPlaceOrder({ items: orderItems, total });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 mx-auto bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Menu</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Order</h2>
        <div className="space-y-4">
          {cartItems.map(({ item, quantity }) => (
            <div key={item.id} className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => onAddToCart(item.id)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="w-20 text-right font-semibold">
                  ${(item.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 text-gray-600 hover:text-gray-800"
          >
            Continue Shopping
          </button>
          <button
            onClick={handlePlaceOrder}
            className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}