import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchRawApi } from "./useApi";
import { mutateSession } from "./session";

type SettingsUpdateParams = [key: string, value: string | boolean];
interface SettingsUpdateConfig {
  session: any;
  setSession:any,
  type?: "user" | "property";
}

export async function updateSettings(
  [key, value]: SettingsUpdateParams,
  config: SettingsUpdateConfig
) {
  try {
    const { session,setSession } = config;
    let type = config.type || "user";

    const endpoint = type === "user" ? "user/settings/edit" : "property/edit";
    const params = {
      [key]: String(value),
      token: session.current.token,
      timestamp: new Date().toISOString(),

      // Used for editing property settings
      userName: session.user.name,
      changedKey: key,
      changedValue: value,
    };

    const res = await fetchRawApi(session, endpoint, params);
    await mutateSession(setSession);
    return res;
  } catch (e) {
    toast.error("Couldn't save changes. Please try again later");
  }
}
