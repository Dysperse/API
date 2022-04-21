export {};

declare global {
	var user: any;
	var ACCOUNT_DATA: {
		accessToken: string;
		email: string;
		name: string;
		financePlan: string;
		image: string;
		notificationMin: number;
		budget: number;
		onboarding: number;
		verifiedEmail: number;
		purpose: string;
		defaultPage: string;
		studentMode: string;
		financeToken: string;
		familyCount: number;
		houseName: string;
		currency: string;
		theme: {
			dark: Array;
			original: Array;
			light: Array;
			tint: Array;
		};
		preferences: { homePage: string };
	};
}
