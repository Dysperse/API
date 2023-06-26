import { StorageContext } from "@/pages/_app";
import { useContext } from "react";

export type AccountStorageState = boolean | "error" | "loading";

type AccountStorageHook = {
  isReached: AccountStorageState;
  setIsReached: any;
};

/**
 * Hook to check if the account storage limits have been reached
 */
export let useAccountStorage: () => AccountStorageHook = () =>
  useContext(StorageContext);
