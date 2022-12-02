import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import React from "react";

export function Error() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        textAlign: "center",
        background: "hsl(240, 11%, 10%)",
        height: "100%",
        width: "100%",
        color: "#fff",
        left: 0,
      }}
    >
      <Box
        ref={() =>
          document
            .querySelector(`meta[name="theme-color"]`)
            ?.setAttribute("content", "hsl(240, 11%, 10%)")
        }
        sx={{
          position: "fixed",
          p: 5,
          borderRadius: 5,
          top: "50%",
          textAlign: "center",
          background: "hsl(240, 11%, 13%)",
          left: "50%",
          maxWidth: "calc(100vw - 20px)",
          width: "350px",
          transform: "translate(-50%, -50%)",
        }}
      >
        <picture>
          <img
            src="https://i.ibb.co/1GnBXX4/image.png"
            alt="An error occurred"
          />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            An error occurred
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            Please try again later. If the problem persists, please contact us
            at{" "}
            <Link href="mailto:hello@smartlist.tech" target="_blank">
              <MuiLink href="mailto:hello@smartlist.tech" target="_blank">
                hello@smartlist.tech
              </MuiLink>
            </Link>
          </Typography>
        </picture>
      </Box>
    </Box>
  );
}
