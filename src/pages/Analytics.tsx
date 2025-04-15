
import { BarChartBig } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChartBig className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Аналитика</h1>
      </div>
      
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clients">Клиенты</TabsTrigger>
          <TabsTrigger value="finance">Финансы</TabsTrigger>
          <TabsTrigger value="effectiveness">Эффективность</TabsTrigger>
          <TabsTrigger value="reports">Отчёты</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="mt-4">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Статистика по клиентам</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Здесь будет отображаться статистика по клиентам, включая новых клиентов, повторные обращения и т.д.</p>
              <div className="h-[300px] w-full rounded-lg bg-muted/50 mt-4 flex items-center justify-center">
                <p className="text-muted-foreground">Место для графика данных по клиентам</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finance" className="mt-4">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Финансовая статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Здесь будет отображаться финансовая статистика, доходы по категориям и периодам.</p>
              <div className="h-[300px] w-full rounded-lg bg-muted/50 mt-4 flex items-center justify-center">
                <p className="text-muted-foreground">Место для графика финансовых показателей</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="effectiveness" className="mt-4">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Анализ эффективности</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Здесь будет отображаться аналитика эффективности консультаций и работы мастера.</p>
              <div className="h-[300px] w-full rounded-lg bg-muted/50 mt-4 flex items-center justify-center">
                <p className="text-muted-foreground">Место для показателей эффективности</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Отчёты и графики</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Здесь будут доступны различные отчеты и графики для анализа работы.</p>
              <div className="h-[300px] w-full rounded-lg bg-muted/50 mt-4 flex items-center justify-center">
                <p className="text-muted-foreground">Место для отчётов и графиков</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
