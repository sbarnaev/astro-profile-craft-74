
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "./types";

interface TimeFieldProps {
  form: UseFormReturn<AppointmentFormValues>;
}

export function TimeField({ form }: TimeFieldProps) {
  // Hours of operation (9:00 to 19:00 with 30-minute intervals)
  const timeSlots = [];
  for (let i = 9; i < 19; i++) {
    timeSlots.push(`${i}:00`);
    timeSlots.push(`${i}:30`);
  }
  
  const [isCustomTime, setIsCustomTime] = useState(false);
  
  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Время</FormLabel>
          {isCustomTime ? (
            <div className="flex space-x-2">
              <FormControl>
                <Input
                  placeholder="Введите время (HH:MM)"
                  pattern="[0-9]{1,2}:[0-9]{2}"
                  {...field}
                  className="flex-1"
                />
              </FormControl>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setIsCustomTime(false)}
              >
                Выбрать
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите время" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px] overflow-y-auto z-50">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setIsCustomTime(true)}
              >
                Своё
              </Button>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
