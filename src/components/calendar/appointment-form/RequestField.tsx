
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "./types";

interface RequestFieldProps {
  form: UseFormReturn<AppointmentFormValues>;
}

export function RequestField({ form }: RequestFieldProps) {
  return (
    <FormField
      control={form.control}
      name="request"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Запрос клиента</FormLabel>
          <FormControl>
            <Input
              placeholder="Опишите запрос клиента..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
