"use client";

import AppLayout from "@/components/Layout";
import { SessionProvider } from "@/lib/client/session";
import { toastStyles, useCustomTheme } from "@/lib/client/useTheme";
import { ThemeProvider, createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";

const fetcher = ([url, params], session) => {
  if (url === null) return;
  const _params = {
    sessionId: session?.current?.token,
    property: session?.property?.propertyId,
    accessToken: session?.property?.accessToken,
    userIdentifier: session?.user?.identifier,
    ...params,
  };

  const _url = `/api/${url}?${new URLSearchParams(_params)}`;

  return fetch(_url).then((res) => {
    return res.json();
  });
};

export default function ClientLayout({ children, session }) {
  const userTheme = createTheme(
    useCustomTheme({
      darkMode: session.darkMode,
      themeColor: session.themeColor,
    })
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SWRConfig value={{ fetcher: (d) => fetcher(d, session) }}>
        <SessionProvider session={session} isLoading={false}>
          <ThemeProvider theme={userTheme}>
            <Toaster containerClassName="noDrag" toastOptions={toastStyles} />
            <AppLayout>{children}</AppLayout>
          </ThemeProvider>
        </SessionProvider>
      </SWRConfig>
    </LocalizationProvider>
  );
}
