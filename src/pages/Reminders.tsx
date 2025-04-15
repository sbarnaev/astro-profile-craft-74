
import { Bell, Calendar, Mail, CheckCircle, PlusCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Reminders() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Напоминания</h1>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Создать напоминание
        </Button>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="upcoming">Предстоящие</TabsTrigger>
          <TabsTrigger value="completed">Выполненные</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Активные напоминания</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-4 border rounded-lg flex items-start gap-3 hover:bg-muted/50 transition-colors">
                    <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 justify-between mb-1">
                        <h3 className="font-medium">Напоминание о консультации</h3>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-sm text-muted-foreground">Сегодня, 15:00</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Напомнить клиенту Анне Смирновой о предстоящей консультации.
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary">
                          <Bell className="h-3 w-3" />
                          Telegram
                        </span>
                        <span className="text-xs flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                          <Mail className="h-3 w-3" />
                          Email
                        </span>
                        <Button variant="ghost" size="sm" className="ml-auto h-7">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Отметить выполненным
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-4">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Предстоящие напоминания</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Здесь будут отображаться предстоящие напоминания.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Выполненные напоминания</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Здесь будут отображаться выполненные напоминания.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
