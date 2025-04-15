
export interface AppointmentInterface {
  id: number;
  clientName: string;
  clientId: number;
  date: Date;
  duration: number;
  type: string;
  request: string;
  cost?: number; // Make cost optional
}
