/**
 * Hook to get the user session data
 */
export let useSession: () =>
  | any
  | {
      user: any;
      property: any;
      permission: string;
      themeColor: string;
    } = () => null;

/**
 * Changes the function value of `useSession`
 * * Used in `pages/_app.tsx`
 * @param e New value of `useSession`
 */
export const modifySessionHook = (e) => {
  useSession = e;
};
