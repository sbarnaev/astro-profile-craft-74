
export const formatPhoneNumber = (value: string): string => {
  // Удаляем все нецифровые символы
  const digits = value.replace(/\D/g, "");
  
  if (!digits.length) return "";
  
  // Форматируем по частям
  let formattedPhone = "+7 ";
  
  if (digits.length > 0) {
    formattedPhone += "(" + digits.substring(1, Math.min(4, digits.length));
  }
  
  if (digits.length > 4) {
    formattedPhone += ") " + digits.substring(4, Math.min(7, digits.length));
  }
  
  if (digits.length > 7) {
    formattedPhone += "-" + digits.substring(7, Math.min(9, digits.length));
  }
  
  if (digits.length > 9) {
    formattedPhone += "-" + digits.substring(9, Math.min(11, digits.length));
  }
  
  return formattedPhone;
};
