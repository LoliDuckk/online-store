import { createContext, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserStore from "./store/UserStore.js";
import DeviceStore from "./store/DeviceStore.js";
import BasketStore from "./store/BasketStore.js";
import "bootstrap/dist/css/bootstrap.css";

export const Context = createContext(null);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Context.Provider
      value={{
        user: new UserStore(),
        device: new DeviceStore(),
        basket: new BasketStore(),
      }}
    >
      <App />
    </Context.Provider>
  </StrictMode>
);
