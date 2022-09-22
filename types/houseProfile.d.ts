export type Members = Member[];

export interface Member {
  id: number;
  permission: string;
  user: User;
}

export interface User {
  name: string;
  email: string;
}
