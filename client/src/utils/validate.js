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

const validateCardNumber = (e) => {
  const clean = e.replace(/\s/g, "");
  return clean.length === 16 ? "" : "Номер карты должен содержать 16 цифр";
};

const validateExpiry = (e) => {
  return /^\d{2}\/\d{2}$/.test(e) ? "" : "Введите срок в формате MM/YY";
};

const validateCVC = (e) => {
  return /^\d{3,4}$/.test(e) ? "" : "Введите 3–4 цифры";
};

const validateFullName = (e) => {
  return /^[A-ZА-ЯЁ][A-ZА-ЯЁ]+\s[A-ZА-ЯЁ]+$/i.test(e.trim())
    ? ""
    : "Введите имя и фамилию через пробел";
};

export {
  validateLength,
  validateEmpty,
  validateEmail,
  validateFile,
  validateCardNumber,
  validateExpiry,
  validateCVC,
  validateFullName,
};
