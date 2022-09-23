export interface Item {
  readonly id: number;
  name: string;
  quantity: string;
  note: string;
  lastModified: string;
  starred: boolean;
  category: string[];
  room: string;
  propertyId: string;
  trash: boolean;
}
