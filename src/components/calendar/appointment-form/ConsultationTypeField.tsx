
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
import { AppointmentFormValues, consultationTypes } from "./types";

interface ConsultationTypeFieldProps {
  form: UseFormReturn<AppointmentFormValues>;
}

export function ConsultationTypeField({ form }: ConsultationTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="consultationType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Тип консультации</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(parseInt(value))}
            defaultValue={field.value?.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип консультации" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {consultationTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name} ({type.duration} мин)
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
