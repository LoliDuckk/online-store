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

export default translateStatus;
