
import { Bell } from "lucide-react";

export default function Reminders() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Напоминания</h1>
      </div>
      <div className="rounded-lg border bg-card p-8 text-card-foreground shadow">
        <p className="text-muted-foreground">Раздел напоминаний находится в разработке</p>
      </div>
    </div>
  );
}
