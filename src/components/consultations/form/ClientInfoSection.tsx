
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ClientInfoSectionProps {
  client: any;
}

export function ClientInfoSection({ client }: ClientInfoSectionProps) {
  if (!client) return null;

  const formatClientDob = (date: any) => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return "Некорректная дата";
    }
    
    return format(dateObj, "d MMMM yyyy", { locale: ru });
  };

  return (
    <div className="p-4 border rounded-md bg-muted/30 mb-4">
      <h3 className="font-medium mb-2">Информация о клиенте</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">ФИО:</span>
          <span className="ml-2 font-medium">
            {client.lastName} {client.firstName} {client.patronymic || ""}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Телефон:</span>
          <span className="ml-2 font-medium">{client.phone}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Дата рождения:</span>
          <span className="ml-2 font-medium">
            {formatClientDob(client.dob)}
          </span>
        </div>
        {client.email && (
          <div>
            <span className="text-muted-foreground">Email:</span>
            <span className="ml-2 font-medium">{client.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}
