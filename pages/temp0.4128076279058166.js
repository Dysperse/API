import * as wrapee from "/workspaces/Smartlist/pages/_app.tsx";
export * from "/workspaces/Smartlist/pages/_app.tsx";
import * as Sentry from "@sentry/nextjs";

/**
 * This file is a template for the code which will be substituted when our webpack loader handles non-API files in the
 * `pages/` directory.
 *
 * We use `/workspaces/Smartlist/pages/_app.tsx` as a placeholder for the path to the file being wrapped. Because it's not a real package,
 * this causes both TS and ESLint to complain, hence the pragma comments below.
 */

var userPageModule = wrapee;

var pageComponent = userPageModule.default;

var origGetInitialProps = pageComponent.getInitialProps;
var origGetStaticProps = userPageModule.getStaticProps;
var origGetServerSideProps = userPageModule.getServerSideProps;

var getInitialPropsWrappers = {
  "/_app": Sentry.withSentryServerSideAppGetInitialProps,
  "/_document": Sentry.withSentryServerSideDocumentGetInitialProps,
  "/_error": Sentry.withSentryServerSideErrorGetInitialProps,
};

var getInitialPropsWrapper =
  getInitialPropsWrappers["/_app"] ||
  Sentry.withSentryServerSideGetInitialProps;

if (typeof origGetInitialProps === "function") {
  pageComponent.getInitialProps = getInitialPropsWrapper(origGetInitialProps);
}

var getStaticProps =
  typeof origGetStaticProps === "function"
    ? Sentry.withSentryGetStaticProps(origGetStaticProps, "/_app")
    : undefined;
var getServerSideProps =
  typeof origGetServerSideProps === "function"
    ? Sentry.withSentryGetServerSideProps(origGetServerSideProps, "/_app")
    : undefined;

export { pageComponent as default, getServerSideProps, getStaticProps };
