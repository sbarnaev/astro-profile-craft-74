
import React, { useState } from "react";
import { ClientForm } from "@/components/clients/ClientForm";

interface NewClientTabProps {
  onCreateClient: (clientData: any, analysisData?: any) => void;
}

export function NewClientTab({ onCreateClient }: NewClientTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (clientData: any, analysisData?: any) => {
    try {
      setIsSubmitting(true);
      console.log("NewClientTab - Client created:", clientData);
      console.log("NewClientTab - Analysis data:", analysisData);
      await onCreateClient(clientData, analysisData);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Создание нового клиента</h3>
      <ClientForm 
        onSubmit={handleSubmit} 
        showCodes={false} 
        generateAnalysis={true}
        redirectAfterSubmit={false}
      />
    </div>
  );
}
