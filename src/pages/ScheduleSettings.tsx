
import React from "react";
import { ScheduleSettings } from "@/components/settings/ScheduleSettings";

const ScheduleSettingsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Настройки расписания</h1>
        <p className="text-muted-foreground">Управление графиком работы и записью на консультации</p>
      </div>
      
      <ScheduleSettings />
    </div>
  );
};

export default ScheduleSettingsPage;
