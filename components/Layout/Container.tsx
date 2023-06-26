import { Box } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { Layout } from "../../pages/_app";

/**
 * Main function, including layout and theme.
 * @param data User session data
 * @param Component Top-level page component
 * @param pageProps Page props
 * @param router Next.JS router
 * @returns JSX.Element
 */
export function RenderWithLayout({
  data,
  Component,
  pageProps,
  router,
}: {
  data: any;
  Component: typeof React.Component;
  pageProps: JSX.Element;
  router: NextRouter;
}) {
  const _router = useRouter();

  if (data.properties.length === 0) {
    return (
      <Box>
        Hmmm.... You find yourself in a strange place. You don&apos;t have
        access to any groups, or there are none in your account. Please contact
        support if this problem persists.
      </Box>
    );
  }

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <Layout
        key={
          _router.asPath.includes("/tasks")
            ? "/tasks"
            : _router.asPath.includes("/settings")
            ? "/settings"
            : _router.asPath
        }
      >
        <Component {...pageProps} key={_router.asPath} />
      </Layout>
    </AnimatePresence>
  );
}
