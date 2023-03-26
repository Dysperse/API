export type AccountStorageState = boolean | "error" | "loading";

/**
 * Hook to check if the account storage limits have been reached
 */
export let useAccountStorage: () => null | {
  isReached: AccountStorageState;
  setIsReached: (newValue: AccountStorageState) => any;
} = () => null;

/**
 * Changes the function value of `useAccountStorage`
 * * Used in `pages/_app.tsx`
 * @param e New value of `useAccountStorage`
 */
export const modifyAccountStorageHook = (e) => {
  useAccountStorage = e;
};
