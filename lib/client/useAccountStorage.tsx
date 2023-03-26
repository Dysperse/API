/**
 * Hook to check if the account storage limits have been reached
 * @returns {object}
 */
export let useAccountStorage: () => null | {
  isReached: boolean | "error" | "loading";
  setIsReached: (newValue: boolean | "error" | "loading") => any;
} = () => null;

export const modifyAccountStorageHook = (e) => {
  useAccountStorage = e;
};
