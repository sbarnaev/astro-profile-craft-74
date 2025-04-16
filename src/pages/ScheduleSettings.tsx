
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
      
      <div className="bg-muted/50 rounded-lg p-4 border border-dashed border-muted">
        <h3 className="font-medium mb-2">Как это работает?</h3>
        <p className="text-sm text-muted-foreground">
          Настройте свой график работы и создайте публичную ссылку для записи на консультации. 
          Клиенты смогут выбрать удобное время, указать свои данные и записаться к вам. 
          Вы получите уведомление о новой записи и сможете подтвердить или отклонить запрос.
        </p>
      </div>
    </div>
  );
};

export default ScheduleSettingsPage;
