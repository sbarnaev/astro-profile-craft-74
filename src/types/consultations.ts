
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

export interface ReminderData {
  date: Date;
  text: string;
  consultationId?: number;
}

export interface AnalysisType {
  id: number;
  clientId: number;
  clientName: string;
  clientPhone: string;
  clientDob: Date;
  date: Date;
  type: "full" | "brief" | "relationship";
  status: "completed" | "in-progress";
  title: string;
  codes: {
    personality?: number | string;
    connector?: number | string;
    implementation?: number | string;
    generator?: number | string;
    mission?: number | string;
    compatibility?: string;
    challenges?: string;
  };
  partnerName?: string;
  notes?: string;
}
