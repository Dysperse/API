export interface Reminder {
  readonly id: number;
  name: string;
  note: string;
  frequency: string;
  lastDone: string;
  nextDue: string;
  propertyId: string;
}
