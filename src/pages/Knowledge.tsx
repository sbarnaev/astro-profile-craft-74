
import { Library, Search, Tag, Book, Lock, Unlock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Knowledge() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Library className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">База знаний</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Поиск по материалам..." 
            className="pl-8"
          />
        </div>
        <Button className="w-full sm:w-auto">
          <Book className="mr-2 h-4 w-4" />
          Новая запись
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Все материалы</TabsTrigger>
          <TabsTrigger value="public">Публичные</TabsTrigger>
          <TabsTrigger value="private">Приватные</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Все материалы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Статья #{item}</h3>
                      {item % 2 === 0 ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Unlock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Краткое описание статьи или материала, который содержится в базе знаний.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        <Tag className="h-3 w-3 inline mr-1" />
                        Тег #{item}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        Категория #{item}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="public" className="mt-4">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Публичные материалы</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Здесь будут отображаться публичные материалы и статьи.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="private" className="mt-4">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Приватные материалы</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Здесь будут отображаться приватные материалы и статьи.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
