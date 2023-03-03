import toast from "react-hot-toast";
import { mutate } from "swr";
import { toastStyles } from "../../lib/useCustomTheme";
import { useSession } from "../../pages/_app";

/**
 * Function to update a user's setting and save it to the database.
 * @param key - The key of the setting to update.
 * @param value - The value of the setting to update.
 * @param debug - Show the result of the save
 * @param callback - Callback function to run after the setting is saved.
 * @param property - Update property settings, or user settings?
 * @returns Object
 */
export async function updateSettings(
  key: string,
  value: string,
  debug = false,
  callback: null | (() => void) = null,
  property = false
) {
  const session = useSession();

  toast.promise(
    new Promise(async (resolve, reject) => {
      try {
        let url = `/api/user/update?${new URLSearchParams({
          sessionId: session.user.token,
          token: session.user.token,
          [key]: value,
        }).toString()}`;
        if (property) {
          url = `/api/property/update?${new URLSearchParams({
            property: session.property.propertyId,
            accessToken: session.property.accessToken,
            userName: session.user.name,
            timestamp: new Date().toISOString(),
            [key]: value,
            changedKey: key,
            changedValue: value,
          }).toString()}`;
        }
        let res: any = await fetch(url, {
          method: "POST",
        });
        res = await res.json();
        callback && callback();
        mutate("/api/user").then(() => resolve("Saved!"));
        if (debug) {
          resolve(JSON.stringify(res));
        }
      } catch (err: any) {
        reject(err.message);
      }
    }),
    {
      loading: "Saving...",
      success: (message: any) => message,
      error: (err: any) => err,
    },
    toastStyles
  );
}
