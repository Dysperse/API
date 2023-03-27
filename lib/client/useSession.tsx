import useSWR from "swr";

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

/**
 * Fetches user session data
 * @returns {any}
 */
export function useUser(): {
  data: any;
  isLoading: boolean;
  isError: boolean;
  error: any;
} {
  const url = "/api/user";
  const { data, error } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    error: error,
  };
}
