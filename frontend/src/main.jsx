import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../app/store";
import App from "./App";
import { initLenis } from "./utils/lenis";
import "./index.css";

// Start smooth scroll globally
initLenis();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
