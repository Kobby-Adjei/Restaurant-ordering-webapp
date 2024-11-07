import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../types';

interface CustomerViewProps {
  menuItems: MenuItem[];
  onAddToCart: (itemId: string) => void;
  cart: Map<string, number>;
}

export function CustomerView({ menuItems, onAddToCart, cart }: CustomerViewProps) {
  const categories = ['main', 'appetizer', 'dessert', 'beverage'] as const;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {categories.map(category => {
        const items = menuItems.filter(item => item.category === category);
        if (items.length === 0) return null;

        return (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize">
              {category === 'main' ? 'Entrées' : category}s
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-40 h-40 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                      <span className="text-lg font-bold text-red-600">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {cart.get(item.id) || 0} in cart
                      </span>
                      <button
                        onClick={() => onAddToCart(item.id)}
                        className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}