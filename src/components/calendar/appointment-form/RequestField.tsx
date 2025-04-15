
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
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
            <Textarea
              placeholder="Опишите запрос клиента..."
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
