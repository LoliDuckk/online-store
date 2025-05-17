import { $authHost } from "./index";

export const addToBasket = async (deviceId) => {
  const { data } = await $authHost.post("api/basket", { deviceId });
  return data;
};

export const updateQuantity = async (basketDeviceId, quantity) => {
  const { data } = await $authHost.put("api/basket", {
    basketDeviceId,
    quantity,
  });
  return data;
};

export const getBasket = async () => {
  const { data } = await $authHost.get("api/basket");
  return data;
};

export const removeFromBasket = async (id) => {
  const { data } = await $authHost.delete("api/basket/" + id);
  return data;
};
