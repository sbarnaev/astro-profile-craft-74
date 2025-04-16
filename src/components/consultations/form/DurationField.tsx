
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
import { useFormContext } from "react-hook-form";

const durations = [
  { value: 30, label: "30 минут" },
  { value: 60, label: "1 час" },
  { value: 90, label: "1.5 часа" },
  { value: 120, label: "2 часа" },
];

export function DurationField() {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="duration"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Продолжительность</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(parseInt(value))}
            defaultValue={field.value?.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Выберите продолжительность" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="z-50">
              {durations.map((duration) => (
                <SelectItem
                  key={duration.value}
                  value={duration.value.toString()}
                >
                  {duration.label}
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
