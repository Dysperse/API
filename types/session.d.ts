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
  readonly propertyId: string;
  readonly accessToken: string;
  selected: boolean;
  accepted: boolean;
  permission: string;
  profile: Profile;
}

export interface Profile {
  readonly id: string;
  name: string;
  type: string;
  color: string;
}
