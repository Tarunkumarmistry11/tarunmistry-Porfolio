import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "../features/projects/projectsSlice";
import aboutReducer from "../features/about/aboutSlice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    about: aboutReducer,
  },
});