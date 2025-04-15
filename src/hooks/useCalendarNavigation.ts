
import { useState } from "react";
import { addWeeks, subWeeks } from "date-fns";

export function useCalendarNavigation() {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  
  // Обработчики навигации по неделям
  const goToPrevWeek = () => {
    setCurrentWeek(prevWeek => subWeeks(prevWeek, 1));
  };
  
  const goToNextWeek = () => {
    setCurrentWeek(prevWeek => addWeeks(prevWeek, 1));
  };
  
  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };
  
  return {
    currentWeek,
    setCurrentWeek,
    goToPrevWeek,
    goToNextWeek,
    goToCurrentWeek
  };
}
