import { makeAutoObservable } from "mobx";

export default class BasketStore {
  constructor() {
    this._items = [];
    makeAutoObservable(this);
  }

  setItems(items) {
    this._items = items;
  }

  addItem(item) {
    const existingItem = this._items.find((i) => i.deviceId === item.deviceId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this._items.push(item);
    }
  }

  updateQuantity(id, quantity) {
    const item = this._items.find((i) => i.id === id);
    if (item) item.quantity = quantity;
  }

  get totalPrice() {
    return this._items.reduce(
      (sum, item) => sum + item.device?.price * item.quantity,
      0
    );
  }

  removeItem(id) {
    this._items = this._items.filter((i) => i.id !== id);
  }

  get items() {
    return this._items;
  }

  get totalCount() {
    return this._items.length;
  }
}
