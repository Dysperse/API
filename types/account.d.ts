export interface Account {
  valid: boolean;
  account: AccountData;
  property: PropertyData;
}

export interface AccountData {
  name: string;
  email: string;
  image: string;
  onboarding: number;
  theme:
    | "red"
    | "green"
    | "blue"
    | "pink"
    | "purple"
    | "orange"
    | "teal"
    | "cyan"
    | "brown";
  notificationMin: number;
  verifiedEmail: number;
  financePlan: string;
  currency: string;
  verifyToken: any;
  authorizeToken: any;
  darkMode: boolean;
  budgetDaily: number;
  budgetWeekly: number;
  budgetMonthly: number;
  twoFactorAuthCode: string;
  accessToken: string;
  financeToken: string;
}

export interface PropertyData {
  propertyToken: string;
  email: string;
  name: string;
  name: string;
  houseType: string;
  accepted: boolean;
  role: string;
  accessToken: string;
}
