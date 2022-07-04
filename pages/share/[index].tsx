import Head from "next/head";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Share() {
  return (
    <>
      <Head>
        <title>Share</title>
      </Head>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#C4B5B5",
        }}
      >
        <picture>
          <img
            src="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/v2/rounded.png"
            alt="Carbon"
          />
        </picture>
        <Typography>Carbon</Typography>
      </Box>
    </>
  );
}
