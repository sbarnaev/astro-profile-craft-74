
import { Library } from "lucide-react";

export default function Knowledge() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Library className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">База знаний</h1>
      </div>
      <div className="rounded-lg border bg-card p-8 text-card-foreground shadow">
        <p className="text-muted-foreground">Раздел базы знаний находится в разработке</p>
      </div>
    </div>
  );
}
