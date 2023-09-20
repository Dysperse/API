import { openSpotlight } from "@/components/Layout/Navigation/Search";
import { Logo } from "@/components/Logo";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Icon, IconButton } from "@mui/material";
import { useRouter } from "next/router";

export function Navbar({
  showLogo = false,
  right,
  showRightContent = false,
}: {
  showLogo?: boolean;
  right?: JSX.Element;
  showRightContent?: boolean;
}) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        "& svg": {
          display: showLogo ? { sm: "none" } : "none",
        },
      }}
    >
      <Logo />
      {right}
      {(!right || showRightContent) && (
        <>
          <IconButton
            sx={{
              display: { sm: "none" },
              color: palette[8],
              ml: showRightContent && right ? "" : "auto",
            }}
            onClick={openSpotlight}
          >
            <Icon className="outlined" sx={{ fontSize: "28px!important" }}>
              search
            </Icon>
          </IconButton>
          <IconButton
            onClick={() =>
              router.push(
                `/users/${session.user.username || session.user.email}`
              )
            }
            sx={{
              color: palette[8],
              ml: { sm: showRightContent && right ? "" : "auto" },
            }}
          >
            <Icon className="outlined" sx={{ fontSize: "28px!important" }}>
              account_circle
            </Icon>
          </IconButton>
          {router.asPath === "/" && (
            <IconButton
              sx={{ color: palette[8] }}
              onClick={() => router.push("/settings")}
            >
              <Icon className="outlined" sx={{ fontSize: "28px!important" }}>
                settings
              </Icon>
            </IconButton>
          )}
        </>
      )}
    </Box>
  );
}
