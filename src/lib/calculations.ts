
/**
 * Вычисляет личностные коды на основе даты рождения
 * @param birthDate - строка даты в формате YYYY-MM-DD
 * @returns объект с кодами личности
 */
export const calculatePersonalityCodes = (birthDate: string): {
  personalityCode: number;
  connectorCode: number;
  realizationCode: number;
  generatorCode: number;
  missionCode: number | string;
} => {
  // Разбираем дату
  const [year, month, day] = birthDate.split('-').map(Number);
  
  // Проверяем, что данные корректны
  if (!year || !month || !day) {
    throw new Error('Неверный формат даты рождения');
  }

  // Код личности = сумма дня → до цифры 1-9 (25 → 2+5=7)
  let personalityCode = sumDigitsToSingle(day);
  
  // Код коннектора = сумма всех цифр даты → 1-9
  // (25.12.1990 → 2+5+1+2+1+9+9+0=29 → 2+9=11 → 1+1=2)
  const dateString = `${day}${month}${year}`;
  let connectorCode = sumDigitsToSingle(dateString.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0));
  
  // Код реализации = сумма двух последних цифр года → 1-9 (1990 → 9+0=9)
  const lastTwoDigits = year % 100;
  let realizationCode = sumDigitsToSingle(lastTwoDigits);
  
  // Код генератора = (день × месяц) → сумма до 1-9 (25 × 12 = 300 → 3+0+0=3)
  const generatorValue = day * month;
  let generatorCode = sumDigitsToSingle(generatorValue);
  
  // Код миссии = Код личности + Код коннектора → 1-9 или 11 (если сумма 11, оставляем как есть)
  const missionValue = personalityCode + connectorCode;
  let missionCode: number | string = missionValue;
  
  // Если сумма равна 11, оставляем её
  if (missionValue !== 11) {
    missionCode = sumDigitsToSingle(missionValue);
  }

  return {
    personalityCode,
    connectorCode,
    realizationCode,
    generatorCode,
    missionCode
  };
};

/**
 * Суммирует цифры числа до получения однозначного числа (1-9)
 * Например: 123 -> 1+2+3=6, 58 -> 5+8=13 -> 1+3=4
 */
const sumDigitsToSingle = (num: number): number => {
  if (num <= 9) return num;
  
  // Складываем цифры числа
  let sum = 0;
  let n = num;
  
  while (n > 0) {
    sum += n % 10;
    n = Math.floor(n / 10);
  }
  
  // Рекурсивно складываем цифры, пока не получим однозначное число
  return sumDigitsToSingle(sum);
};
