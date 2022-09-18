export interface Item {
  readonly id: number;
  lastUpdated: string;
  quantity: string;
  title: string;
  categories: string[];
  note: string;
  star: number;
  room: string;
}
