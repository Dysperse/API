"use client";
import { createContext, useContext } from "react";
import useSWR from "swr";

export const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext) as any;
export const SessionProvider = ({
  isLoading,
  session,
  children,
  setSession,
}) => {
  return (
    <SessionContext.Provider value={{ session, setSession, isLoading } as any}>
      {children}
    </SessionContext.Provider>
  );
};

export async function mutateSession(setSession) {
  const data = await fetch("/api/session").then((res) => res.json());

  const selectedProperty =
    data?.properties &&
    (data.properties.find((property: any) => property.selected) ||
      data.properties[0]);

  const themeColor = data?.user?.color || "violet";

  const s = data?.properties && {
    ...data,
    property: selectedProperty,
    permission: selectedProperty.permission,
    themeColor,
    darkMode: data.user.darkMode,
  };

  setSession(s);
}

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
