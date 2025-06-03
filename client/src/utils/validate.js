const validateLength = (e, i) => {
  return e.length >= i ? "" : `Минимум ${i} символов`;
};

const validateEmpty = (e) => {
  return e.length !== 0 ? "" : "Это поле обязательно к заполнению";
};

const validateEmail = (e) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(e) ? "" : "Введите корректный email";
};

const validateFile = (e, i) => {
  return e !== null ? "" : "Файл не выбран";
};

export { validateLength, validateEmpty, validateEmail, validateFile };
