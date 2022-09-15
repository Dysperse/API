import toast from "react-hot-toast";
import { mutate } from "swr";
export function updateSettings(
  key: string,
  value: string,
  debug = false,
  callback: any = () => {},
  property = false,
  showSeparateSyncToastMessage = true
) {
  let url =
    "/api/user/update?" +
    new URLSearchParams({
      token: global.user.token,
      [key]: value,
    });
  if (property) {
    url =
      "/api/property/updateInfo?" +
      new URLSearchParams({
        property: global.property.propertyId,
        accessToken: global.property.accessToken,
        [key]: value,
      });
  }
  let d = fetch(url, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((res) => {
      callback && callback();
      toast.success("Saved!");
      mutate("/api/user");
      if (debug) {
        alert(JSON.stringify(res));
      }
    });
  return d;
}
