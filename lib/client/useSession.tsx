/**
 * Hook to get the user session data
 * @returns {object}
 */
export let useSession: () =>
  | any
  | {
      user: any;
      property: any;
      permission: string;
      themeColor: string;
    } = () => null;

export const modifySessionHook = (e) => {
  useSession = e;
};
