import {
  Box,
  Button,
  Collapse,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";

export function Error({ message }) {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        textAlign: "center",
        background: "hsl(240,11%,95%)",
        height: "100%",
        width: "100%",
        color: "#000",
        left: 0,
        zIndex: 999999999999999,
      }}
    >
      <Box
        ref={() =>
          document
            .querySelector(`meta[name="theme-color"]`)
            ?.setAttribute("content", "#6E79C9")
        }
        sx={{
          position: "fixed",
          p: 5,
          borderRadius: 5,
          top: "50%",
          background: "hsl(240,11%,90%)",
          color: "#000",
          left: "50%",
          maxWidth: "calc(100vw - 20px)",
          width: "370px",
          transform: "translate(-50%, -50%)",
          textAlign: "left",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "700",
            textDecoration: "underline",
          }}
        >
          Oh no!
        </Typography>
        <Typography variant="body1">
          Something weird happened! If this problem persists, feel free to
          contact us at:{" "}
          <Link href="mailto:hello@dysperse.com" target="_blank" legacyBehavior>
            <MuiLink
              href="mailto:hello@dysperse.com"
              target="_blank"
              sx={{ color: "#000", textDecorationColor: "#000" }}
            >
              hello@dysperse.com
            </MuiLink>
          </Link>
        </Typography>
        <Button
          sx={{
            mt: 2,
            justifyContent: "start",
            color: "#000",
            borderRadius: 9,
            ...(open && {
              background: "rgba(255,255,255,0.05)",
            }),
          }}
          fullWidth
          onClick={() => {
            setOpen(!open);
          }}
        >
          Debug
          <span
            className="material-symbols-rounded"
            style={{ marginLeft: "auto" }}
          >
            expand_more
          </span>
        </Button>
        <Collapse in={open} orientation="vertical">
          <Box
            sx={{
              background: "rgba(255,255,255,0.05)",
              p: 2,
              borderRadius: 2,
              mt: 2,
            }}
          >
            <u style={{ marginBottom: "3px", display: "block" }}>
              Failed to fetch session data
            </u>
            <b>{message.message}</b>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}
