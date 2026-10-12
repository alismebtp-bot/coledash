import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { CityProvider } from "./context/CityContext";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CityProvider>
        <CartProvider>
          <App />
          <Toaster position="top-right" richColors />
        </CartProvider>
      </CityProvider>
    </BrowserRouter>
  </React.StrictMode>
);
