
import React from "react";
import { DollarSign } from "lucide-react";
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

interface CostFieldProps {
  form: UseFormReturn<AppointmentFormValues>;
  onCustomCostChange: (value: number | null) => void;
}

export function CostField({ form, onCustomCostChange }: CostFieldProps) {
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      onCustomCostChange(value);
      form.setValue("cost", value);
    } else {
      onCustomCostChange(null);
    }
  };
  
  return (
    <FormField
      control={form.control}
      name="cost"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Стоимость</FormLabel>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="number"
              placeholder="Стоимость"
              className="pl-10"
              value={field.value || ""}
              onChange={(e) => {
                field.onChange(parseInt(e.target.value) || 0);
                handleCostChange(e);
              }}
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
