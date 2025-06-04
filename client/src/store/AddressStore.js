import { makeAutoObservable, runInAction } from "mobx";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../http/addressApi";

export default class AddressStore {
  addresses = [];
  selectedAddressId = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAddresses(list) {
    this.addresses = list;
  }

  setSelectedAddress(id) {
    this.selectedAddressId = id;
  }

  get selectedAddress() {
    return (
      this.addresses.find((addr) => addr.id === this.selectedAddressId) || null
    );
  }

  get defaultAddress() {
    return this.addresses.find((addr) => addr.isDefault) || null;
  }

  async loadAddresses() {
    this.loading = true;
    try {
      const data = await fetchAddresses();
      runInAction(() => {
        this.addresses = data;
        if (data.length) {
          const def = data.find((a) => a.isDefault);
          this.selectedAddressId = def ? def.id : data[0].id;
        }
        this.loading = false;
      });
    } catch (e) {
      console.error(e);
      runInAction(() => (this.loading = false));
    }
  }

  async addAddress(addressData) {
    this.loading = true;
    try {
      const newAddr = await createAddress(addressData);
      runInAction(() => {
        if (newAddr.isDefault) {
          this.addresses = this.addresses.map((a) =>
            a.isDefault ? { ...a, isDefault: false } : a
          );
        }
        this.addresses.push(newAddr);
        this.selectedAddressId = newAddr.id;
        this.loading = false;
      });
    } catch (e) {
      console.error(e);
      runInAction(() => (this.loading = false));
    }
  }

  async editAddress(id, addressData) {
    this.loading = true;
    try {
      const updated = await updateAddress(id, addressData);
      runInAction(() => {
        if (updated.isDefault) {
          this.addresses = this.addresses.map((a) =>
            a.isDefault ? { ...a, isDefault: false } : a
          );
        }
        this.addresses = this.addresses.map((a) => (a.id === id ? updated : a));
        this.selectedAddressId = updated.id;
        this.loading = false;
      });
    } catch (e) {
      console.error(e);
      runInAction(() => (this.loading = false));
    }
  }

  async removeAddress(id) {
    this.loading = true;
    try {
      await deleteAddress(id);
      runInAction(() => {
        this.addresses = this.addresses.filter((a) => a.id !== id);
        if (this.selectedAddressId === id) {
          this.selectedAddressId =
            this.defaultAddress?.id || this.addresses[0]?.id || null;
        }
        this.loading = false;
      });
    } catch (e) {
      console.error(e);
      runInAction(() => (this.loading = false));
    }
  }
}
