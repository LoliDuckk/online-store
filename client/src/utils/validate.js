const validateLength = (e, i) => {
  return e.length >= i ? "" : `Минимум ${i} символов`;
};

const validateEmpty = (e) => {
  return e.length !== 0 ? "" : "Поле не может быть пустым";
};

const validateEmail = (e) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(e) ? "" : "Введите корректный email";
};

const validateFile = (e, i) => {
  if (e === null || e === undefined) return "Выберите файл";
};

export { validateLength, validateEmpty, validateEmail, validateFile };
