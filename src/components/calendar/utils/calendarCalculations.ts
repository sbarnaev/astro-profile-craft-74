
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay 
} from "date-fns";

export function calculateCalendarDays(currentDate: Date) {
  // Get the first day of the month
  const monthStart = startOfMonth(currentDate);
  
  // Get the last day of the month
  const monthEnd = endOfMonth(currentDate);
  
  // Get all days in the month
  const daysInMonth = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });
  
  // Get the day of the week for the first day of the month (0 - Sunday, 1 - Monday, etc.)
  const startDay = getDay(monthStart);
  
  // Adjust the start day for Russian locale (1 - Monday, 7 - Sunday)
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
  
  // Create an empty array for calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the start of the month
  for (let i = 0; i < adjustedStartDay; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  calendarDays.push(...daysInMonth);
  
  // Calculate the total number of slots in the calendar
  const totalSlots = Math.ceil(calendarDays.length / 7) * 7;
  
  // Add empty cells at the end to fill the last row
  while (calendarDays.length < totalSlots) {
    calendarDays.push(null);
  }
  
  // Split days into weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }
  
  return { weeks };
}

// Days of the week for Russian locale
export const russianDaysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
