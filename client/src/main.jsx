import { createContext, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App.jsx";
import UserStore from "./store/UserStore.js";
import DeviceStore from "./store/DeviceStore.js";
import BasketStore from "./store/BasketStore.js";
import AddressStore from "./store/AddressStore.js";

export const Context = createContext(null);

const user = new UserStore();
const device = new DeviceStore();
const basket = new BasketStore();
const address = new AddressStore();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Context.Provider value={{ user, device, basket, address }}>
      <App />
    </Context.Provider>
  </StrictMode>,
);
