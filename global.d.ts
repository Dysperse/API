import type { Color } from "../../types/color";
import type { User } from "../../types/session";
export {};

declare global {
  var themeColor: Color;
  var workbox: any;
  var user: User;
  var property: Property;
}
