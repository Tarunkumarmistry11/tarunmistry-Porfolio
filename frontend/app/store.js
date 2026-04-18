import { configureStore } from "@reduxjs/toolkit";
import projectsReducer    from "../features/projects/projectsSlice";
import aboutReducer       from "../features/about/aboutSlice";
import shopReducer        from "../features/shop/shopSlice";
import cartReducer        from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    about:    aboutReducer,
    shop:     shopReducer,
    cart:     cartReducer,
  },
});