import { Analytics } from "@vercel/analytics/react";
import dynamic from "next/dynamic";
import { NextRouter } from "next/router";
import React from "react";
import { Toaster } from "react-hot-toast";
import { Error } from "../components/Layout/Error";
import { Loading } from "../components/Layout/Loading";

// CSS files
import "../styles/calendar.scss";
import "../styles/coach.scss";
import "../styles/globals.scss";

// Day.JS
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Hooks
import { RenderWithLayout } from "../components/Layout/Container";
import { useUser } from "../lib/client/useSession";

const AuthLoading = dynamic(() => import("../components/Auth/AuthLoading"), {
  loading: () => <Loading />,
});

export const Layout = dynamic(() => import("../components/Layout"), {
  loading: () => <Loading />,
});

dayjs.extend(relativeTime);

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
  const { data, isLoading, error, isError } = useUser();

  /**
   * URLs to display without the application container
   */
  const bareUrls = [
    "/auth",
    "/auth/signup",
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

  return disableLayout ? (
    <>
      <Component {...pageProps} />
      <Toaster containerClassName="noDrag" />
    </>
  ) : (
    <>
      <Analytics />
      {isLoading && <Loading />}
      {isError && <Error message={error} />}
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
  );
}
