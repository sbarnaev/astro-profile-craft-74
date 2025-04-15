import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema/clientFormSchema";
interface PersonalityCodesFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}
export function PersonalityCodesFields({
  form
}: PersonalityCodesFieldsProps) {
  return;
}