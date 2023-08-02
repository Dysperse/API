import { useStatusBar } from "@/lib/client/useStatusBar";
import {
  Box,
  Button,
  Link as MuiLink,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";

export function Error() {
  const dark = useMediaQuery("(prefers-color-scheme: dark)");

  const buttonStyles = {
    textTransform: "none",
    justifyContent: "start",
    color: `hsl(240,11%,${dark ? 90 : 10}%)`,
    borderRadius: 9,
    gap: 1.5,
    px: 1.5,
    background: dark ? "hsl(240,11%,20%)" : "rgba(0,0,0,0.04)!important",
    transition: "transform .2s",
    "&:hover": {
      background: dark ? "hsl(240,11%,23%)" : "rgba(0,0,0,0.06)!important",
    },
    "&:active": {
      transition: "none",
      transform: "scale(.95)",
      background: dark ? "hsl(240,11%,25%)" : "rgba(0,0,0,0.08)!important",
    },
  };

  useStatusBar(`hsl(240,11%,${dark ? 10 : 95}%)`);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        textAlign: "center",
        background: `hsl(240,11%,${dark ? 10 : 95}%)`,
        height: "100%",
        width: "100%",
        color: "#000",
        left: 0,
        zIndex: 999999999999999,
      }}
    >
      <Box
        sx={{
          position: "fixed",
          p: 5,
          borderRadius: 5,
          top: "50%",
          background: `hsl(240,11%,${dark ? 15 : 90}%)`,
          color: `hsl(240,11%,${dark ? 90 : 10}%)`,
          left: "50%",
          userSelect: "none",
          maxWidth: "calc(100vw - 20px)",
          width: "370px",
          maxHeight: "calc(100dvh - 20px)",
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
              ...(dark && {
                filter: "invert(1)",
              }),
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
              sx={{
                color: `hsl(240,11%,${dark ? 90 : 10}%)`,
                textDecorationColor: `hsl(240,11%,${dark ? 90 : 10}%)`,
              }}
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
        </Box>
      </Box>
    </Box>
  );
}
