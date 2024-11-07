import React, { useState } from 'react';
import { CustomerView } from './components/CustomerView';
import { CartView } from './components/CartView';
import { MenuItem, Order, AppState } from './types';
import { Drumstick, ShoppingCart } from 'lucide-react';

const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Original Chicken Sandwich',
    description: 'Hand-breaded chicken breast, dill pickle chips, toasted bun',
    price: 4.99,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '2',
    name: 'Waffle Potato Fries',
    description: 'Crispy, wave-cut potatoes cooked in canola oil',
    price: 2.99,
    category: 'appetizer',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '3',
    name: 'Spicy Chicken Sandwich',
    description: 'Hand-breaded spicy chicken breast, dill pickle chips, toasted bun',
    price: 5.29,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '4',
    name: 'Fresh Lemonade',
    description: 'Classic or diet lemonade made with real lemon juice',
    price: 2.49,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '5',
    name: 'Chocolate Chunk Cookie',
    description: 'Freshly baked cookie with premium chocolate chunks',
    price: 1.99,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80'
  }
];

function App() {
  const [state, setState] = useState<AppState>({
    menuItems: initialMenuItems,
    orders: []
  });
  const [isCartView, setIsCartView] = useState(false);
  const [cart, setCart] = useState<Map<string, number>>(new Map());

  const cartItemCount = Array.from(cart.values()).reduce((sum, quantity) => sum + quantity, 0);

  const handleAddToCart = (itemId: string) => {
    setCart(new Map(cart.set(itemId, (cart.get(itemId) || 0) + 1)));
  };

  const handleRemoveFromCart = (itemId: string) => {
    const quantity = cart.get(itemId) || 0;
    if (quantity <= 1) {
      const newCart = new Map(cart);
      newCart.delete(itemId);
      setCart(newCart);
    } else {
      setCart(new Map(cart.set(itemId, quantity - 1)));
    }
  };

  const handlePlaceOrder = (orderData: Omit<Order, 'id' | 'status' | 'timestamp'>) => {
    const newOrder: Order = {
      ...orderData,
      id: crypto.randomUUID(),
      status: 'received',
      timestamp: Date.now()
    };

    setState(prev => ({
      ...prev,
      orders: [...prev.orders, newOrder]
    }));
    setCart(new Map());
    setIsCartView(false);
  };

  return (
    <div className="min-h-screen bg-red-50">
      <header className="bg-red-600 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Drumstick className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Chick-fil-A</h1>
            </div>
            <button
              onClick={() => setIsCartView(!isCartView)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-red-600 hover:bg-red-50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart ({cartItemCount})</span>
            </button>
          </div>
        </div>
      </header>

      <main className="py-8">
        {isCartView ? (
          <CartView
            cart={cart}
            menuItems={state.menuItems}
            onRemoveFromCart={handleRemoveFromCart}
            onAddToCart={handleAddToCart}
            onPlaceOrder={handlePlaceOrder}
          />
        ) : (
          <CustomerView
            menuItems={state.menuItems}
            onAddToCart={handleAddToCart}
            cart={cart}
          />
        )}
      </main>
    </div>
  );
}

export default App;