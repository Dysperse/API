import Box from "@mui/material/Box";
import useSWR from "swr";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Head from "next/head";

/**
 * Gets query parameter by name
 * @param name - Name of query parameter
 */
function getQueryParameterByName(name) {
  const pairStrings = window.location.search.slice(1).split("&");
  const pairs: any = pairStrings.map((pair) => pair.split("="));

  return pairs.reduce((value, pair) => {
    if (value) return value;
    return pair[0] === name ? decodeURIComponent(pair[1]) : null;
  }, null);
}

/**
 * Renders the data once loaded to redirect to the sso page
 * @param {any} {data}
 * @returns {any}
 */
function RenderData({ data }) {
  const redirectURL = getQueryParameterByName("redirect");
  const companyID = getQueryParameterByName("companyID");
  if (redirectURL.indexOf("https://") !== 0 || !companyID) {
    return null;
  }

  const url = `https://canny.io/api/redirects/sso?companyID=${companyID}&ssoToken=${encodeURIComponent(
    data
  )}&redirect=${encodeURIComponent(redirectURL)}`;
  window.location.href = url;
  return <div />;
}

/**
 * Top-level component for the Canny SSO page.
 */
export default function CannyAuth() {
  const url = "/api/canny-auth";
  const { data, error } = useSWR(url, () =>
    fetch(url).then((res) => res.text())
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        background: "#000",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          background: "rgba(255,255,255,.1)",
          color: "#fff",
          p: 3,
          borderRadius: 4,
          width: "auto",
          maxWidth: "calc(100vw - 20px)",
        }}
      >
        <Head>
          <meta name="theme-color" content="#000" />
        </Head>
        <CircularProgress size="20px" color="inherit" />
        <Typography>Redirecting you to the feedback center</Typography>
        {error && "An error occured, please try again later..."}
        {data && <RenderData data={data} />}
      </Box>
    </Box>
  );
}
