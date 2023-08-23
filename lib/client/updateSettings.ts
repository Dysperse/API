import { toastStyles } from "@/lib/client/useTheme";
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
export async function updateSettings(
  session,
  key: string,
  value: string,
  debug = false,
  callback: null | (() => void) = null,
  property = false,
  hideToast = false,
  errorText = "Couldn't save settings."
) {
  const promise = new Promise(async (resolve, reject) => {
    try {
      let url = `/api/user/settings/edit?${new URLSearchParams({
        sessionId: session.current.token,
        token: session.current.token,
        [key]: value,
      }).toString()}`;
      if (property) {
        url = `/api/property/edit?${new URLSearchParams({
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
      mutate("/api/session").then(() => resolve("Saved!"));
      if (debug) {
        resolve(JSON.stringify(res));
      }
    } catch (err: any) {
      reject(err.message);
    }
  });

  if (hideToast) {
    await promise;
    return;
  }
  toast.promise(
    promise,
    {
      loading: "Saving...",
      success: (message: any) => message,
      error: errorText,
    },
    toastStyles
  );
}
