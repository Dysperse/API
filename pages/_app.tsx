import { Error } from "@/components/Layout/Error";
import { Loading } from "@/components/Layout/Loading";
import { Analytics } from "@vercel/analytics/react";
import dynamic from "next/dynamic";
import { NextRouter } from "next/router";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";

// CSS files
import "../styles/calendar.scss";
import "../styles/coach.scss";
import "../styles/globals.scss";
import "../styles/normalize.scss";

// Day.JS
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";

// Hooks
import { RenderWithLayout } from "@/components/Layout/Container";
import { SessionProvider, useUser } from "@/lib/client/session";
import Head from "next/head";

import { AccountStorageState } from "@/lib/client/useAccountStorage";
import { createContext } from "react";

export const StorageContext: any = createContext(null);

const AuthLoading = dynamic(() => import("@/components/Auth/Loading"), {
  loading: () => <Loading />,
});

export const Layout = dynamic(() => import("@/components/Layout"), {
  loading: () => <Loading />,
});

dayjs.extend(relativeTime);
dayjs.extend(isBetween);

/**
 * Function to check whether to add a layout or not
 * @param router Next.JS router
 * @param Component Top-level page component
 * @param pageProps Page props
 * @returns JSX.Element
 */
export default function App({
  router,
  Component,
  pageProps,
}: {
  router: NextRouter;
  Component: typeof React.Component;
  pageProps: JSX.Element;
}) {
  const { data, isLoading, isError } = useUser();

  /**
   * URLs to display without the application container
   */
  const bareUrls = [
    "/auth",
    "/auth/signup",
    "/auth/qr-success",
    "/auth/reset-id",
    "/auth/reset-password/[id]",
    "/canny-auth",
    "/invite/[id]",
    "/share/[index]",
    "/_offline",
    "/404",
    "/scan",
    "/signup",
  ];

  const disableLayout = bareUrls.includes(router.pathname);

  const selectedProperty =
    data?.properties &&
    (data.properties.find((property: any) => property.selected) ||
      data.properties[0]);

  const themeColor = data?.user?.color;

  const [isReached, setIsReached]: any =
    useState<AccountStorageState>("loading");

  return (
    <SessionProvider
      session={
        data?.properties && {
          ...data,
          property: selectedProperty,
          permission: selectedProperty.permission,
          themeColor,
          darkMode: data.user.darkMode,
        }
      }
    >
      <StorageContext.Provider value={{ isReached, setIsReached }}>
        {disableLayout ? (
          <>
            <Component {...pageProps} />
            <Toaster containerClassName="noDrag" />
          </>
        ) : (
          <>
            <Head>
              <title>Dysperse</title>
            </Head>
            <Analytics />
            {isLoading && <Loading />}
            {isError && <Error />}
            {!isLoading && !isError && !data.error && (
              <RenderWithLayout
                router={router}
                Component={Component}
                pageProps={pageProps}
                data={data}
              />
            )}
            {!isLoading && !isError && data.error && <AuthLoading />}
          </>
        )}
      </StorageContext.Provider>
    </SessionProvider>
  );
}
