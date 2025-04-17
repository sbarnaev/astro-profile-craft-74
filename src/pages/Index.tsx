import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, ClipboardList, UserPlus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
const Index = () => {
  // Статистика для примера
  const stats = [{
    title: "Всего клиентов",
    value: "43",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10"
  }, {
    title: "Анализы за неделю",
    value: "12",
    icon: ClipboardList,
    color: "text-secondary",
    bg: "bg-secondary/10"
  }, {
    title: "Встречи сегодня",
    value: "3",
    icon: Calendar,
    color: "text-astro-violet",
    bg: "bg-[hsl(var(--astro-violet)/0.1)]"
  }, {
    title: "Новых клиентов",
    value: "+7",
    icon: UserPlus,
    color: "text-accent",
    bg: "bg-accent/10"
  }];

  // Список последних клиентов
  const recentClients = [{
    id: 1,
    name: "Анна Смирнова",
    date: "14.04.2023",
    type: "Полный анализ"
  }, {
    id: 2,
    name: "Иван Петров",
    date: "28.02.1985",
    type: "Базовый анализ"
  }, {
    id: 3,
    name: "Мария Иванова",
    date: "10.10.1990",
    type: "Консультация"
  }, {
    id: 4,
    name: "Александр Козлов",
    date: "05.07.1982",
    type: "Полный анализ"
  }];
  return <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground">
      </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => <Card key={index} className="astro-card border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Недавние клиенты */}
        <Card className="astro-card border-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Недавние клиенты</CardTitle>
              <Link to="/clients" className="text-sm text-primary hover:underline">
                Все клиенты
              </Link>
            </div>
            <CardDescription>Последние добавленные клиенты</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.map(client => <div key={client.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">{client.name.charAt(0)}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.date}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted">
                    {client.type}
                  </span>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* График активности */}
        <Card className="astro-card border-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Активность</CardTitle>
              <div className="p-1 rounded-md bg-muted/50">
                <TrendingUp className="h-4 w-4 text-secondary" />
              </div>
            </div>
            <CardDescription>Данные за последний месяц</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">График активности</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Здесь будет отображаться график активности с данными
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Index;