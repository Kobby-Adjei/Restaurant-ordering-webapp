export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  image: string;
}

export interface Order {
  id: string;
  items: Array<{
    menuItem: MenuItem;
    quantity: number;
  }>;
  status: 'received' | 'preparing' | 'ready' | 'completed';
  timestamp: number;
  total: number;
}

export interface AppState {
  menuItems: MenuItem[];
  orders: Order[];
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
  name: string;
}