
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { User, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ClientInfoSectionProps {
  client: {
    name: string;
    phone: string;
    dob: Date;
  };
}

export function ClientInfoSection({ client }: ClientInfoSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Информация о клиенте</CardTitle>
        <CardDescription>Данные для расчета</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">ФИО:</span>
          </div>
          <span className="font-medium">{client.name}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Дата рождения:</span>
          </div>
          <span className="font-medium">
            {format(client.dob, "d MMMM yyyy", { locale: ru })}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Телефон:</span>
          </div>
          <span className="font-medium">{client.phone}</span>
        </div>
      </CardContent>
    </Card>
  );
}
