import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { MenuItem, Order } from '../types';

type State = {
  menuItems: MenuItem[];
  orders: Order[];
  isAdminMode: boolean;
};

type Action =
  | { type: 'SET_MENU_ITEMS'; payload: MenuItem[] }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'DELETE_MENU_ITEM'; payload: string }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'TOGGLE_ADMIN_MODE' };

const initialState: State = {
  menuItems: [],
  orders: [],
  isAdminMode: false,
};

const RestaurantContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

const restaurantReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_MENU_ITEMS':
      return { ...state, menuItems: action.payload };
    case 'ADD_MENU_ITEM':
      return { ...state, menuItems: [...state.menuItems, action.payload] };
    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.filter((item) => item.id !== action.payload),
      };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };
    case 'TOGGLE_ADMIN_MODE':
      return { ...state, isAdminMode: !state.isAdminMode };
    default:
      return state;
  }
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(restaurantReducer, initialState);

  useEffect(() => {
    const savedMenuItems = localStorage.getItem('menuItems');
    const savedOrders = localStorage.getItem('orders');

    if (savedMenuItems) {
      dispatch({ type: 'SET_MENU_ITEMS', payload: JSON.parse(savedMenuItems) });
    }
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      orders.forEach((order: Order) => {
        dispatch({ type: 'ADD_ORDER', payload: order });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(state.menuItems));
    localStorage.setItem('orders', JSON.stringify(state.orders));
  }, [state.menuItems, state.orders]);

  return (
    <RestaurantContext.Provider value={{ state, dispatch }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};