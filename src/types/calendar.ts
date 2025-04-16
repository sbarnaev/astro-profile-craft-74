
export interface AppointmentInterface {
  id: number;
  clientId?: number;
  clientName: string;
  date: Date;
  duration: number;
  type?: string;
  request?: string;
  cost?: number;
  status?: "active" | "completed" | "cancelled";
}
