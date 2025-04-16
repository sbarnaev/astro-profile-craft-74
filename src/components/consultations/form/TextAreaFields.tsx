
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

interface TextAreaFieldProps {
  name: "request" | "notes";
  label: string;
  placeholder: string;
  required?: boolean;
  minHeight?: string;
}

export function TextAreaField({ 
  name, 
  label, 
  placeholder, 
  required = false,
  minHeight = "80px" 
}: TextAreaFieldProps) {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-destructive ml-1">*</span>}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              style={{ minHeight }}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
