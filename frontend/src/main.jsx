import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AccentProvider } from "./context/AccentContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AccentProvider>
        <App />
      </AccentProvider>
    </BrowserRouter>
  </React.StrictMode>
);