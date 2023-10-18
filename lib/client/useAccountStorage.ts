"use client";
import { createContext, useContext } from "react";

export type AccountStorageState = boolean | "error" | "loading";

type AccountStorageHook = {
  isReached: AccountStorageState;
  setIsReached: any;
};

export const StorageContext: any = createContext(null);

/**
 * Hook to check if the account storage limits have been reached
 */
export let useAccountStorage: () => AccountStorageHook = () =>
  useContext(StorageContext);
