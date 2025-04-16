
import React from "react";
import { cn } from "@/lib/utils";

interface MonthViewHeaderProps {
  daysOfWeek: string[];
}

export function MonthViewHeader({ daysOfWeek }: MonthViewHeaderProps) {
  return (
    <div className="grid grid-cols-7 gap-1 mb-4">
      {daysOfWeek.map((day, index) => (
        <div 
          key={index} 
          className={cn(
            "text-center py-2 text-sm font-semibold",
            index >= 5 ? "text-red-500" : "text-muted-foreground"
          )}
        >
          {day}
        </div>
      ))}
    </div>
  );
}
