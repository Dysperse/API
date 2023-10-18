"use client";
import { createContext, useContext } from "react";
import useSWR from "swr";

export const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext) as any;
export const SessionProvider = ({ isLoading, session, children }) => {
  return (
    <SessionContext.Provider value={{ session, isLoading } as any}>
      {children}
    </SessionContext.Provider>
  );
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
  const url = "/api/session";
  const { data, isLoading, error } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

  return {
    data: data,
    isLoading,
    isError: error,
    error: error,
  };
}
