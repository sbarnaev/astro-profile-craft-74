
export interface AppointmentInterface {
  id: number;
  clientId: number; // Changed from optional to required
  clientName: string;
  date: Date;
  duration: number;
  type: string; // Changed from optional to required
  request?: string;
  cost?: number;
  status?: "active" | "completed" | "cancelled";
}
