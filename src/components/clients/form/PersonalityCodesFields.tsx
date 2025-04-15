
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema/clientFormSchema";

interface PersonalityCodesFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function PersonalityCodesFields({ form }: PersonalityCodesFieldsProps) {
  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="font-medium">Коды</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="personalityCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Код личности</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  value={field.value || ''} 
                  onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} 
                />
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
                <Input 
                  type="number" 
                  {...field} 
                  value={field.value || ''} 
                  onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} 
                />
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
                <Input 
                  type="number" 
                  {...field} 
                  value={field.value || ''} 
                  onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} 
                />
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
                <Input 
                  type="number" 
                  {...field} 
                  value={field.value || ''} 
                  onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} 
                />
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
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
