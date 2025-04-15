
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Moon, 
  Sun,
  Smartphone,
  Save,
  UserCircle2
} from "lucide-react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">Управление аккаунтом и предпочтениями</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Профиль
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Lock className="mr-2 h-4 w-4" />
            Безопасность
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            Внешний вид
          </TabsTrigger>
        </TabsList>
        
        {/* Вкладка профиля */}
        <TabsContent value="profile" className="mt-0 space-y-6">
          <Card className="astro-card border-none">
            <CardHeader>
              <CardTitle>Профиль</CardTitle>
              <CardDescription>
                Управляйте информацией о вашем профиле
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="mx-auto sm:mx-0">
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center relative overflow-hidden">
                    <UserCircle2 className="h-20 w-20 text-muted-foreground" />
                    <button className="absolute inset-0 bg-black/50 text-white opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-sm">
                      Изменить
                    </button>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Полное имя</Label>
                      <Input id="fullName" placeholder="Иван Иванов" value="Мастер Анализа" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userName">Имя пользователя</Label>
                      <Input id="userName" value="master_analysis" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value="example@mail.ru" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" type="tel" value="+7 (900) 123-45-67" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Профессиональная информация</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Специализация</Label>
                    <Input id="specialization" value="Анализ личности по дате рождения" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Опыт работы (лет)</Label>
                    <Input id="experience" type="number" value="5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">О себе</Label>
                  <textarea 
                    id="bio" 
                    className="w-full min-h-24 p-3 rounded-md border border-input bg-background"
                    defaultValue="Профессиональный мастер по анализу личности по дате рождения с опытом более 5 лет. Помогаю людям раскрыть их потенциал и понять свое предназначение."
                  />
                </div>
              </div>
              
              <Button className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Вкладка безопасности */}
        <TabsContent value="security" className="mt-0 space-y-6">
          <Card className="astro-card border-none">
            <CardHeader>
              <CardTitle>Безопасность</CardTitle>
              <CardDescription>
                Управляйте настройками безопасности вашего аккаунта
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Текущий пароль</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Новый пароль</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button className="mt-2">Изменить пароль</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Вкладка уведомлений */}
        <TabsContent value="notifications" className="mt-0 space-y-6">
          <Card className="astro-card border-none">
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
              <CardDescription>
                Настройте способы получения уведомлений
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Уведомления клиентов</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Новые клиенты</p>
                    <p className="text-sm text-muted-foreground">
                      Получать уведомления при регистрации новых клиентов
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Запросы на анализ</p>
                    <p className="text-sm text-muted-foreground">
                      Получать уведомления о новых запросах на анализ
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <h3 className="text-lg font-medium">Напоминания о встречах</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Предстоящие встречи</p>
                    <p className="text-sm text-muted-foreground">
                      Получать напоминания о предстоящих встречах
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Изменения в расписании</p>
                    <p className="text-sm text-muted-foreground">
                      Получать уведомления об изменениях в расписании
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <h3 className="text-lg font-medium">Способы уведомлений</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email уведомления</p>
                    <p className="text-sm text-muted-foreground">
                      Получать уведомления на email
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push-уведомления</p>
                    <p className="text-sm text-muted-foreground">
                      Получать уведомления в браузере
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Вкладка внешнего вида */}
        <TabsContent value="appearance" className="mt-0 space-y-6">
          <Card className="astro-card border-none">
            <CardHeader>
              <CardTitle>Внешний вид</CardTitle>
              <CardDescription>
                Настройте внешний вид приложения
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium">Темная тема</p>
                      <p className="text-sm text-muted-foreground">
                        Переключиться на {darkMode ? "светлый" : "темный"} режим
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Компактный режим</p>
                      <p className="text-sm text-muted-foreground">
                        Оптимизирует интерфейс для маленьких экранов
                      </p>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
