
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, MoreHorizontal, UserPlus } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Пример данных о клиентах
const clientsData = [
  { id: 1, name: "Анна Смирнова", date: "14.04.1993", phone: "+7 (900) 123-45-67", analysisCount: 3, lastAnalysis: "02.03.2025" },
  { id: 2, name: "Иван Петров", date: "28.02.1985", phone: "+7 (911) 987-65-43", analysisCount: 2, lastAnalysis: "15.02.2025" },
  { id: 3, name: "Мария Иванова", date: "10.10.1990", phone: "+7 (905) 555-55-55", analysisCount: 5, lastAnalysis: "10.04.2025" },
  { id: 4, name: "Александр Козлов", date: "05.07.1982", phone: "+7 (926) 111-22-33", analysisCount: 1, lastAnalysis: "01.04.2025" },
  { id: 5, name: "Екатерина Новикова", date: "22.12.1988", phone: "+7 (903) 777-88-99", analysisCount: 4, lastAnalysis: "05.03.2025" },
  { id: 6, name: "Дмитрий Соколов", date: "18.06.1995", phone: "+7 (999) 444-33-22", analysisCount: 2, lastAnalysis: "20.02.2025" },
];

const Clients = () => {
  const [searchValue, setSearchValue] = useState("");
  
  // Функция фильтрации клиентов
  const filteredClients = clientsData.filter(client => 
    client.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    client.phone.includes(searchValue)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Клиенты</h1>
          <p className="text-muted-foreground">Управление базой клиентов</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Добавить клиента
        </Button>
      </div>

      <Card className="astro-card border-none">
        <CardHeader className="pb-2">
          <CardTitle>Список клиентов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Поиск по имени или телефону..." 
                className="pl-8"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex-shrink-0">
              <Filter className="mr-2 h-4 w-4" />
              Фильтры
            </Button>
          </div>

          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 font-medium">
                    <th className="py-3 px-4 text-left">Имя</th>
                    <th className="py-3 px-4 text-left">Дата рождения</th>
                    <th className="py-3 px-4 text-left hidden md:table-cell">Телефон</th>
                    <th className="py-3 px-4 text-center hidden lg:table-cell">Анализы</th>
                    <th className="py-3 px-4 text-left hidden lg:table-cell">Последний анализ</th>
                    <th className="py-3 px-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                              <span className="text-xs font-medium text-primary">{client.name.charAt(0)}</span>
                            </div>
                            <span>{client.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{client.date}</td>
                        <td className="py-3 px-4 hidden md:table-cell">{client.phone}</td>
                        <td className="py-3 px-4 text-center hidden lg:table-cell">{client.analysisCount}</td>
                        <td className="py-3 px-4 hidden lg:table-cell">{client.lastAnalysis}</td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Профиль</DropdownMenuItem>
                              <DropdownMenuItem>Новый анализ</DropdownMenuItem>
                              <DropdownMenuItem>Редактировать</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Удалить</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
