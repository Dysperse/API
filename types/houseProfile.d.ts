export type Members = Member[];

// Member information
export interface Member {
  id: number;
  permission: string;
  user: User;
}

export interface User {
  name: string;
  email: string;
}

// House profile
export interface House {
  propertyId: string;
  accessToken: string;
  selected: boolean;
  accepted: boolean;
  permission: string;
  profile: Profile;
}

export interface Profile {
  id: string;
  name: string;
  type: string;
  color: string;
}
