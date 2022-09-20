import type { User } from "../../types/session";
import type { Color } from "../../types/color";
export {};

declare global {
  var theme: string;
  var setTheme: Function;
  var themeColor: Color;
  var setThemeColor: () => void;
  var OneSignal: any;

  var user: User;
  var property: Property;
}
