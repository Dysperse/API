export type Lists = List[];

export interface List {
  id: number;
  name: string;
  description: string;
  items: Item[];
}

export interface Item {
  id: number;
  name: string;
  details: string;
  pinned: boolean;
  completed: boolean;
  listId: number;
}
