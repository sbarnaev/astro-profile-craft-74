
import { Link, useNavigate } from "react-router-dom";
import { ClientActionMenu } from "./ClientActionMenu";

export interface Client {
  id: string; // изменено с number на string для соответствия UUID из Supabase
  name: string;
  date: string;
  phone: string;
  analysisCount: number;
  lastAnalysis: string;
  source?: string;
  communicationChannel?: string;
}

interface ClientsTableProps {
  clients: Client[];
  getCommunicationIcon: (channel: string) => React.ReactNode;
}

export function ClientsTable({ clients, getCommunicationIcon }: ClientsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 font-medium">
              <th className="py-3 px-4 text-left">Имя</th>
              <th className="py-3 px-4 text-left">Дата рождения</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">Телефон</th>
              <th className="py-3 px-4 text-center hidden lg:table-cell">Канал</th>
              <th className="py-3 px-4 text-center hidden lg:table-cell">Анализы</th>
              <th className="py-3 px-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr 
                  key={client.id} 
                  className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/clients/${client.id}`} className="block">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-primary">{client.name.charAt(0)}</span>
                        </div>
                        <span>{client.name}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 px-4">{client.date}</td>
                  <td className="py-3 px-4 hidden md:table-cell">{client.phone}</td>
                  <td className="py-3 px-4 text-center hidden lg:table-cell">
                    {getCommunicationIcon(client.communicationChannel || '')}
                  </td>
                  <td className="py-3 px-4 text-center hidden lg:table-cell">{client.analysisCount}</td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <ClientActionMenu clientId={client.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-center text-muted-foreground">
                  Клиенты не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
