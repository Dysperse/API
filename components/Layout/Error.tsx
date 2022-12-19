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
  const [open, setOpen] = React.useState(false);
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        textAlign: "center",
        background: "#6b4b4b",
        height: "100%",
        width: "100%",
        color: "#232323",
        left: 0,
        zIndex: 999999999999999,
      }}
    >
      <Box
        ref={() =>
          document
            .querySelector(`meta[name="theme-color"]`)
            ?.setAttribute("content", "#6b4b4b")
        }
        sx={{
          position: "fixed",
          p: 5,
          borderRadius: 5,
          top: "50%",
          background: "#c4b5b5",
          left: "50%",
          maxWidth: "calc(100vw - 20px)",
          width: "350px",
          transform: "translate(-50%, -50%)",
          textAlign: "left",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Oh no!
        </Typography>
        <Typography variant="body1">
          Something weird happened! If this problem persists, feel free to
          contact us at:{" "}
          <Link
            href="mailto:hello@smartlist.tech"
            target="_blank"
            legacyBehavior
          >
            <MuiLink href="mailto:hello@smartlist.tech" target="_blank">
              hello@smartlist.tech
            </MuiLink>
          </Link>
        </Typography>
        <Button
          sx={{
            mt: 2,
            justifyContent: "start",
            color: "#232323",
            borderRadius: 9,
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
            className="font-secondary"
            sx={{
              background: "rgba(0,0,0,0.05)",
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
