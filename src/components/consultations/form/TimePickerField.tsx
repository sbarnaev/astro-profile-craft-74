
import { Clock } from "lucide-react";
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
import { useFormContext } from "react-hook-form";

// Generate time slots for the dropdown
const timeSlots = Array.from({ length: 24 }).flatMap((_, hour) => 
  ["00", "30"].map(minutes => `${hour.toString().padStart(2, '0')}:${minutes}`)
);

export function TimePickerField() {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Время начала</FormLabel>
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
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {time}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="time"
              className="w-28"
              onChange={(e) => field.onChange(e.target.value)}
              value={field.value}
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
