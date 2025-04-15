
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema/clientFormSchema";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface DateOfBirthFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function DateOfBirthField({ form }: DateOfBirthFieldProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [calendarView, setCalendarView] = useState<"days" | "months" | "years">("days");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  
  // Форматирование даты для поля ввода
  const initialDate = form.getValues().dob;
  const initialFormatted = initialDate ? format(initialDate, "dd.MM.yyyy") : "";
  
  // Устанавливаем начальное значение для поля ввода
  if (inputValue === "" && initialFormatted) {
    setInputValue(initialFormatted);
  }

  // Обработчик ручного ввода даты
  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Валидация и установка даты при вводе
    if (value.length === 10) { // DD.MM.YYYY
      const parsedDate = parse(value, "dd.MM.yyyy", new Date());
      if (isValid(parsedDate)) {
        form.setValue("dob", parsedDate, { shouldValidate: true });
      }
    }
  };

  // Установка года для календаря
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setCalendarView("months");
  };

  // Установка месяца для календаря
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    setCalendarView("days");
  };

  // Переход на предыдущий год в режиме выбора года
  const prevYearPage = () => {
    setSelectedYear(prev => prev - 12);
  };

  // Переход на следующий год в режиме выбора года
  const nextYearPage = () => {
    setSelectedYear(prev => prev + 12);
  };

  // Рендер годов для выбора
  const renderYears = () => {
    const years = [];
    const startYear = selectedYear - 6; // Начинаем с 6 лет назад от выбранного года
    
    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      years.push(
        <div
          key={year}
          className={cn(
            "flex items-center justify-center h-9 w-9 rounded-md text-sm cursor-pointer",
            selectedYear === year ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
          onClick={() => handleYearChange(year)}
        >
          {year}
        </div>
      );
    }
    
    return (
      <div className="p-3">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="icon" onClick={prevYearPage}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">{startYear} - {startYear + 11}</div>
          <Button variant="outline" size="icon" onClick={nextYearPage}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-2">{years}</div>
      </div>
    );
  };

  // Рендер месяцев для выбора
  const renderMonths = () => {
    const months = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];
    
    return (
      <div className="p-3">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCalendarView("years")}
          >
            {selectedYear}
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, idx) => (
            <div
              key={month}
              className={cn(
                "flex items-center justify-center h-10 rounded-md text-sm p-2 cursor-pointer",
                selectedMonth === idx ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
              onClick={() => handleMonthChange(idx)}
            >
              {month}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <FormField
      control={form.control}
      name="dob"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Дата рождения</FormLabel>
          <div className="flex gap-2">
            <div className="flex-1">
              <FormControl>
                <Input
                  placeholder="ДД.ММ.ГГГГ"
                  value={inputValue}
                  onChange={handleManualInput}
                  className="w-full"
                />
              </FormControl>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="px-3"
                  type="button"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                {calendarView === "days" && (
                  <div>
                    <div className="flex justify-between items-center p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCalendarView("months")}
                      >
                        {format(new Date(selectedYear, selectedMonth), "LLLL yyyy", { locale: ru })}
                      </Button>
                    </div>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        if (date) {
                          setInputValue(format(date, "dd.MM.yyyy"));
                        }
                      }}
                      month={new Date(selectedYear, selectedMonth)}
                      onMonthChange={(date) => {
                        setSelectedMonth(date.getMonth());
                        setSelectedYear(date.getFullYear());
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1920-01-01")
                      }
                      initialFocus
                      locale={ru}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </div>
                )}
                {calendarView === "months" && renderMonths()}
                {calendarView === "years" && renderYears()}
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
