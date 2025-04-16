
export interface ConsultationType {
  id: number;
  clientId: number;
  clientName: string;
  clientPhone: string;
  clientDob: Date;
  date: Date;
  duration: number;
  type: string;
  format: "video" | "in-person";
  status: "scheduled" | "completed";
  notes?: string;
  request: string;
}

// Переименованный тип для сессий
export interface SessionType {
  id: number;
  clientId: number;
  clientName: string;
  clientPhone: string;
  clientDob: Date;
  date: Date;
  duration: number;
  type: string;
  format: "video" | "in-person";
  status: "scheduled" | "completed";
  notes?: string;
  request: string;
}
