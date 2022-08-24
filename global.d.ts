import type { Account } from "../../types/account";

export {};

declare global {
  var theme: string;
  var setTheme: any;
  var themeColor: any;
  var setThemeColor: any;
  var OneSignal: any;

  var session: Account | any;
}
