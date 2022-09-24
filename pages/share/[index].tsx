import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { NextRouter, useRouter } from "next/router";

/**
 * Query function
 * @param {any} {query}
 * @returns {any}
 */
function Query({ query }) {
  let of = false;
  if (
    query.quantity.toLowerCase().endsWith("boxes") ||
    query.quantity.toLowerCase().endsWith("packs") ||
    query.quantity.toLowerCase().endsWith("jars") ||
    query.quantity.toLowerCase().endsWith("cups") ||
    query.quantity.toLowerCase().endsWith("cups") ||
    query.quantity.toLowerCase().endsWith("mugs") ||
    query.quantity.toLowerCase().endsWith("📦") ||
    query.quantity.toLowerCase().endsWith("packages")
  ) {
    of = true;
  }
  return (
    <Typography
      variant="h1"
      sx={{ color: "#232323", fontSize: { xs: "40px", sm: "50px" } }}
    >
      <abbr title="Person">{query.name}</abbr> has{" "}
      <abbr title="Item name">{query.quantity}</abbr>
      {of ? " of " : " "}
      <abbr title="Item quantity">{query.title.toLowerCase()}</abbr> in the{" "}
      <abbr title="Room">kitchen</abbr>
    </Typography>
  );
}

/**
 * Top-level component for the share page
 * @returns {any}
 */
export default function Share() {
  const router = useRouter();
  const query = router && router.query.index;

  return (
    <>
      <Head>
        <title>Share</title>
        <meta name="theme-color" content="#C4B5B5" />
      </Head>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#C4B5B5",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            p: 3,
            alignItems: "center",
            gap: "20px",
            position: "fixed",
            top: 0,
            left: 0,
            userSelect: "none",
          }}
        >
          <picture>
            <img
              width="90"
              draggable="false"
              height="90"
              src="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/v2/rounded.png"
              alt="Carbon"
            />
          </picture>
          <Typography variant="h4" sx={{ color: "#232323" }}>
            Carbon
          </Typography>
        </Box>
        <Box
          sx={{
            p: 4,
            width: "100%",
            pt: 8,
            "& *::selection": {
              background: "#6B4B4B",
              color: "#fff",
            },
          }}
        >
          {query ? (
            <Query query={query} />
          ) : (
            <>
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{ width: "90%", height: "60px", borderRadius: 5 }}
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{ width: "30%", height: "60px", borderRadius: 5, mt: 3 }}
              />
            </>
          )}
          <Button
            variant="text"
            size="small"
            href="//smartlist.tech"
            target="_blank"
            sx={{
              boxShadow: 0,
              textTransform: "none",
              mt: 4,
              color: "#6B4B4B!important",
            }}
          >
            Track your inventory for free with a Carbon account
          </Button>
        </Box>
      </Box>
    </>
  );
}
