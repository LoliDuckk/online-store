const translateStatus = (status) => {
  const map = {
    PENDING: "В ожидании",
    PROCESSING: "Заказ собирают",
    SHIPPING: "Отправлен",
    DELIVERED: "Доставлен",
    CANCELLED: "Отменён",
  };
  return map[status] || status;
};

const translatePaymentMethod = (method) => {
  const map = {
    card: "Банковская карта",
    cash: "Наличными при получении",
  };
  return map[method] || method;
};

const translateDeliveryMethod = (method) => {
  const map = {
    courier: "Курьерская доставка",
    pickup: "Самовывоз",
    Express: "Экспресс доставка",
  };
  return map[method] || method;
};

export { translateStatus, translatePaymentMethod, translateDeliveryMethod };
