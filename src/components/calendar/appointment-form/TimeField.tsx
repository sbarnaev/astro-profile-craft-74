
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "./types";

interface TimeFieldProps {
  form: UseFormReturn<AppointmentFormValues>;
}

export function TimeField({ form }: TimeFieldProps) {
  // Часы работы (с 9:00 до 19:00 с интервалом 30 минут)
  const timeSlots = [];
  for (let i = 9; i < 19; i++) {
    timeSlots.push(`${i}:00`);
    timeSlots.push(`${i}:30`);
  }
  
  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Время</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Выберите время" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="z-50">
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
