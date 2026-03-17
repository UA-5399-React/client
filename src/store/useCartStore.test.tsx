import { beforeEach, describe, expect, it } from 'vitest';

import type { Product } from '@/types/product.types';

import { useCartStore } from './useCartStore';

const mockProductA: Product = {
  id: '1',
  title: 'Product A',
  price: 100,
  status: 'active',
};
const mockProductB: Product = {
  id: '2',
  _id: '2',
  title: 'Product B',
  price: 250,
  status: 'active',
};

describe('Store: useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    localStorage.clear();
  });

  // --- Block 1: Initialization ---
  it('should initialize with an empty cart and total of 0', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.getCartTotal()).toBe(0);
  });

  // --- Block 2: Adding products (addItem) ---
  it('should add a new product with quantity 1', () => {
    useCartStore.getState().addItem(mockProductA);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].product).toEqual(mockProductA);
    expect(items[0].quantity).toBe(1);
  });

  it('should increment quantity if the product already exists (handles id and _id)', () => {
    const store = useCartStore.getState();

    store.addItem(mockProductA);
    store.addItem(mockProductA);

    store.addItem(mockProductB);
    store.addItem(mockProductB);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(2);

    const itemA = items.find((i) => i.product.id === '1');
    expect(itemA?.quantity).toBe(2);

    const itemB = items.find((i) => i.product._id === '2');
    expect(itemB?.quantity).toBe(2);
  });

  // --- Block 3: Removing products (removeItem) ---
  it('should remove an item by id or _id', () => {
    const store = useCartStore.getState();
    store.addItem(mockProductA);
    store.addItem(mockProductB);

    expect(useCartStore.getState().items).toHaveLength(2);

    useCartStore.getState().removeItem('1');
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].product).toEqual(mockProductB);
    useCartStore.getState().removeItem('2');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  // --- Block 4: Updating quantity (updateQuantity) ---
  it('should update the quantity of a specific item', () => {
    const store = useCartStore.getState();
    store.addItem(mockProductA);

    store.updateQuantity('1', 5);

    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('should not allow quantity to drop below 1', () => {
    const store = useCartStore.getState();
    store.addItem(mockProductA);

    store.updateQuantity('1', 0);
    expect(useCartStore.getState().items[0].quantity).toBe(1);

    store.updateQuantity('1', -5);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  // --- Block 5: Clearing the cart (clearCart) ---
  it('should clear all items from the cart', () => {
    const store = useCartStore.getState();
    store.addItem(mockProductA);
    store.addItem(mockProductB);

    store.clearCart();

    expect(useCartStore.getState().items).toEqual([]);
    expect(useCartStore.getState().getCartTotal()).toBe(0);
  });

  // --- Block 6: Calculating the total (getCartTotal) ---
  it('should correctly calculate the total price of all items', () => {
    const store = useCartStore.getState();

    store.addItem(mockProductA);
    store.updateQuantity('1', 2);

    store.addItem(mockProductB);

    expect(useCartStore.getState().getCartTotal()).toBe(450);
  });

  // --- Block 7: Persist Middleware ---
  it('should persist cart data to localStorage', () => {
    const store = useCartStore.getState();
    store.addItem(mockProductA);
    const storedDataRaw = localStorage.getItem('cart-storage');
    expect(storedDataRaw).not.toBeNull();

    if (storedDataRaw) {
      const parsedData = JSON.parse(storedDataRaw);
      expect(parsedData.state.items).toHaveLength(1);
      expect(parsedData.state.items[0].product.id).toBe('1');
      expect(parsedData.state.items[0].quantity).toBe(1);
    }
  });
});
