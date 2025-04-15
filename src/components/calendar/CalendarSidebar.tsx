
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ru } from "date-fns/locale";

interface CalendarSidebarProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export function CalendarSidebar({ date, onDateSelect }: CalendarSidebarProps) {
  return (
    <Card className="astro-card border-none md:col-span-5 lg:col-span-4">
      <CardHeader className="pb-2">
        <CardTitle>Календарь</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          locale={ru}
          className="mx-auto"
        />
      </CardContent>
    </Card>
  );
}
