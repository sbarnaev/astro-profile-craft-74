
export const formatPhoneNumber = (value: string, countryCode: string = "+7"): string => {
  // Удаляем все нецифровые символы
  const digits = value.replace(/\D/g, "");
  
  if (!digits.length) return "";
  
  // Для разных кодов стран разные форматы
  switch (countryCode) {
    case "+7": // Россия
      return formatRussianNumber(digits);
    case "+375": // Беларусь
      return formatBelarusNumber(digits);
    case "+380": // Украина
      return formatUkraineNumber(digits);
    case "+1": // США/Канада
      return formatUSNumber(digits);
    default:
      // Универсальный формат для других стран
      return formatUniversalNumber(digits);
  }
};

const formatRussianNumber = (digits: string): string => {
  let formattedPhone = "";
  
  if (digits.length > 0) {
    formattedPhone += "(" + digits.substring(0, Math.min(3, digits.length));
  }
  
  if (digits.length > 3) {
    formattedPhone += ") " + digits.substring(3, Math.min(6, digits.length));
  }
  
  if (digits.length > 6) {
    formattedPhone += "-" + digits.substring(6, Math.min(8, digits.length));
  }
  
  if (digits.length > 8) {
    formattedPhone += "-" + digits.substring(8, Math.min(10, digits.length));
  }
  
  return formattedPhone;
};

const formatBelarusNumber = (digits: string): string => {
  let formattedPhone = "";
  
  if (digits.length > 0) {
    formattedPhone += "(" + digits.substring(0, Math.min(2, digits.length));
  }
  
  if (digits.length > 2) {
    formattedPhone += ") " + digits.substring(2, Math.min(5, digits.length));
  }
  
  if (digits.length > 5) {
    formattedPhone += "-" + digits.substring(5, Math.min(7, digits.length));
  }
  
  if (digits.length > 7) {
    formattedPhone += "-" + digits.substring(7, Math.min(9, digits.length));
  }
  
  return formattedPhone;
};

const formatUkraineNumber = (digits: string): string => {
  let formattedPhone = "";
  
  if (digits.length > 0) {
    formattedPhone += "(" + digits.substring(0, Math.min(2, digits.length));
  }
  
  if (digits.length > 2) {
    formattedPhone += ") " + digits.substring(2, Math.min(5, digits.length));
  }
  
  if (digits.length > 5) {
    formattedPhone += "-" + digits.substring(5, Math.min(7, digits.length));
  }
  
  if (digits.length > 7) {
    formattedPhone += "-" + digits.substring(7, Math.min(9, digits.length));
  }
  
  return formattedPhone;
};

const formatUSNumber = (digits: string): string => {
  let formattedPhone = "";
  
  if (digits.length > 0) {
    formattedPhone += "(" + digits.substring(0, Math.min(3, digits.length));
  }
  
  if (digits.length > 3) {
    formattedPhone += ") " + digits.substring(3, Math.min(6, digits.length));
  }
  
  if (digits.length > 6) {
    formattedPhone += "-" + digits.substring(6, Math.min(10, digits.length));
  }
  
  return formattedPhone;
};

const formatUniversalNumber = (digits: string): string => {
  // Группируем по 2-3 цифры для универсального формата
  let formattedPhone = "";
  let i = 0;
  
  while (i < digits.length) {
    if (i > 0) formattedPhone += " ";
    formattedPhone += digits.substring(i, Math.min(i + 3, digits.length));
    i += 3;
  }
  
  return formattedPhone;
};
