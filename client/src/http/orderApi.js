import { $authHost } from "./index";

export const createOrder = async ({
  addressId,
  deliveryMethod,
  paymentMethod,
}) => {
  const { data } = await $authHost.post("api/order", {
    addressId,
    deliveryMethod,
    paymentMethod,
  });
  return data;
};

export const fetchOrders = async () => {
  const { data } = await $authHost.get("api/order");
  return data;
};

export const fetchAllOrders = async () => {
  const { data } = await $authHost.get("api/order/admin");
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await $authHost.put(`api/order/${orderId}/status`, {
    status,
  });
  return data;
};
