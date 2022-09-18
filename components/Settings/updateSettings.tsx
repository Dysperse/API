import toast from "react-hot-toast";
import { mutate } from "swr";

/**
 * Function to update a user's setting and save it to the database.
 * @param key - The key of the setting to update.
 * @param value - The value of the setting to update.
 * @param debug - Show the result of the save
 * @param callback - Callback function to run after the setting is saved.
 * @param property - Update property settings, or user settings?
 * @returns Object
 */
export function updateSettings(
  key: string,
  value: string,
  debug = false,
  callback: any = () => {},
  property = false
) {
  let url = `/api/user/update?${new URLSearchParams({
    token: global.user.token,
    [key]: value,
  }).toString()}`;
  if (property) {
    url = `/api/property/updateInfo?${new URLSearchParams({
      property: global.property.propertyId,
      accessToken: global.property.accessToken,
      [key]: value,
    }).toString()}`;
  }
  const fetcher = fetch(url, {
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
  return fetcher;
}
