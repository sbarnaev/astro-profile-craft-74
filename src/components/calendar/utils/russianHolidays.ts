
import { format } from "date-fns";

// Russian holidays (some major ones for example)
export const russianHolidays = [
  "01-01", // New Year
  "01-02", // New Year holidays
  "01-03", // New Year holidays
  "01-04", // New Year holidays
  "01-05", // New Year holidays
  "01-06", // New Year holidays
  "01-07", // Christmas
  "02-23", // Defender of the Fatherland Day
  "03-08", // International Women's Day
  "05-01", // Spring and Labor Day
  "05-09", // Victory Day
  "06-12", // Russia Day
  "11-04", // Unity Day
];

// Check if a date is a Russian holiday
export const isRussianHoliday = (date: Date) => {
  const monthDay = format(date, "MM-dd");
  return russianHolidays.includes(monthDay);
};
