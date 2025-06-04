import { $authHost } from "./index";

export const fetchAddresses = async () => {
  const { data } = await $authHost.get("api/address");
  return data;
};

export const createAddress = async (addressData) => {
  const { data } = await $authHost.post("api/address", addressData);
  return data;
};

export const updateAddress = async (id, addressData) => {
  const { data } = await $authHost.put(`api/address/${id}`, addressData);
  return data;
};

export const deleteAddress = async (id) => {
  const { data } = await $authHost.delete(`api/address/${id}`);
  return data;
};
