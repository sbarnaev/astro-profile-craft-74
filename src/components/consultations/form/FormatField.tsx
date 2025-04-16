
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

export function FormatField() {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="format"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Формат консультации</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Выберите формат" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="z-50">
              <SelectItem value="video">Видео-консультация</SelectItem>
              <SelectItem value="in-person">Очная встреча</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
