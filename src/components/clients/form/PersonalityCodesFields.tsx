
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
  return (
    <>
      <div className="space-y-2 mb-4">
        <h3 className="text-lg font-medium">Коды личности</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="personalityCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Код личности</FormLabel>
              <FormControl>
                <Input readOnly {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="connectorCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Код коннектора</FormLabel>
              <FormControl>
                <Input readOnly {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="realizationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Код реализации</FormLabel>
              <FormControl>
                <Input readOnly {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="generatorCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Код генератора</FormLabel>
              <FormControl>
                <Input readOnly {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="missionCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Код миссии</FormLabel>
              <FormControl>
                <Input readOnly {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
