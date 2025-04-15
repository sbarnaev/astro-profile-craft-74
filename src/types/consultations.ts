
export interface ConsultationType {
  id: string;
  name: string;
  duration: number;
}

export interface Consultation {
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
