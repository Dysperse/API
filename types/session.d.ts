export interface Session {
  user: User;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  twoFactorSecret: string;
  darkMode: boolean;
  color: string;
  onboardingComplete: boolean;
  verifiedEmail: boolean;
  properties: Property[];
  token: string;
}

export interface Property {
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
