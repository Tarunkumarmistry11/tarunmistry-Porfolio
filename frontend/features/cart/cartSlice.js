import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items:  [],
    isOpen: false,
  },
  reducers: {
    addItem: (state, { payload: { product, quantity = 1 } }) => {
      const existing = state.items.find((i) => i._id === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
    },
    removeItem: (state, { payload: id }) => {
      state.items = state.items.filter((i) => i._id !== id);
    },
    updateQuantity: (state, { payload: { id, quantity } }) => {
      const item = state.items.find((i) => i._id === id);
      if (item) item.quantity = Math.max(1, quantity);
    },
    clearCart:  (state) => { state.items  = []; },
    openCart:   (state) => { state.isOpen = true; },
    closeCart:  (state) => { state.isOpen = false; },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
  },
});

// Selectors
export const selectCartItems  = (s) => s.cart.items;
export const selectCartIsOpen = (s) => s.cart.isOpen;
export const selectCartCount  = (s) => s.cart.items.reduce((n, i) => n + i.quantity, 0);
export const selectCartTotal  = (country) => (s) =>
  s.cart.items.reduce((sum, i) => sum + (i.price?.[country] ?? i.price?.US ?? 0) * i.quantity, 0);

export const { addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, toggleCart } =
  cartSlice.actions;

export default cartSlice.reducer;