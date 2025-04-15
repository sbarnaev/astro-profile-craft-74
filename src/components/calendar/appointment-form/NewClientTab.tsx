
import React from "react";
import { ClientForm } from "@/components/clients/ClientForm";

interface NewClientTabProps {
  onCreateClient: (clientData: any) => void;
}

export function NewClientTab({ onCreateClient }: NewClientTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Создание нового клиента</h3>
      <ClientForm 
        onSubmit={onCreateClient} 
        showCodes={false} 
      />
    </div>
  );
}
