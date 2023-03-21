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
  const buttonStyles = {
    textTransform: "none",
    justifyContent: "start",
    color: "#000",
    borderRadius: 9,
    gap: 1.5,
    px: 1.5,
    background: "rgba(0,0,0,0.04)!important",
    transition: "transform .2s",
    "&:hover": {
      background: "rgba(0,0,0,0.06)!important",
    },
    "&:active": {
      transition: "none",
      transform: "scale(.95)",
      background: "rgba(0,0,0,0.08)!important",
    },
  };

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
          maxHeight: "calc(100vh - 20px)",
          overflowY: "scroll",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <picture>
          <img
            width={256}
            height={256}
            style={{
              width: "100%",
              maxWidth: "256px",
              margin: "auto",
            }}
            src="https://my.dysperse.com/images/error.png"
            alt="Error"
          />
        </picture>
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
        <Box
          sx={{
            gap: 2,
            display: "flex",
            alignItems: "center",
            mt: 2,
            justifyContent: "center",
          }}
        >
          <Button
            disableRipple
            sx={buttonStyles}
            target="_blank"
            href="https://status.dysperse.com/"
          >
            Server status
            <span className="material-symbols-rounded">open_in_new</span>
          </Button>
          <Button
            disableRipple
            sx={buttonStyles}
            onClick={() => {
              setOpen(!open);
            }}
          >
            Debug
            <span className="material-symbols-rounded">
              {open ? "expand_less" : "expand_more"}
            </span>
          </Button>
        </Box>
        <Collapse in={open} orientation="vertical">
          <Box
            sx={{
              background: "rgba(0,0,0,0.05)",
              p: 2,
              borderRadius: 2,
              mt: 2,
              textAlign: "left",
            }}
          >
            <u
              style={{ marginBottom: "3px", display: "block", fontWeight: 700 }}
            >
              Failed to fetch session data
            </u>
            <span className="font-secondary">{message.message}</span>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}
