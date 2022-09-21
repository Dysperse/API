import type { User } from "../../types/session";
import type { Color } from "../../types/color";
export {};

declare global {
  var theme: string;
  var setTheme: (e) => any;
  var themeColor: Color;
  var setThemeColor: (e) => any;
  var OneSignal: any;

  var user: User;
  var property: Property;
}
