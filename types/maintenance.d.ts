export interface Reminder {
  id: number;
  name: string;
  note: string;
  frequency: string;
  lastDone: string;
  nextDue: string;
  propertyId: string;
}
