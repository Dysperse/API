import { openSpotlight } from "@/components/Layout/Navigation/Search";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Button, Collapse, Icon, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Logo } from "../pages";
import { GroupModal } from "./Group/GroupModal";

export function Navbar({
  showLogo = false,
  right,
  showRightContent = false,
}: {
  showLogo?: boolean;
  right?: JSX.Element;
  showRightContent?: boolean;
}) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const groupPalette = useColor(
    session.property.profile.color,
    useDarkMode(session.darkMode)
  );
  const router = useRouter();

  const [showGroup, setShowGroup] = useState(router.asPath === "/");

  useEffect(() => {
    setTimeout(() => {
      setShowGroup(false);
    }, 1000);
  }, []);

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
              ml: showRightContent && right ? "" : "auto",
              color: palette[9],
              "&:active": { transform: "scale(.9)" },
              transition: "all .4s",
            }}
            onClick={openSpotlight}
          >
            <Icon className="outlined">search</Icon>
          </IconButton>
          <GroupModal list>
            <Button
              sx={{
                ml: { sm: "auto" },
                minWidth: "unset",
                px: showGroup ? 2 : 1,
                color: showGroup ? groupPalette[9] : palette[9],
                background: showGroup ? groupPalette[3] : palette[1],
                gap: showGroup ? 1.5 : 0,
                "&:hover": { background: "transparent" },
                "&:active": { background: palette[2] },
                transition: "all .4s!important",
              }}
              onClick={() =>
                router.push("/spaces/" + session?.property?.propertyId)
              }
            >
              <Icon className="outlined">group</Icon>
              <Collapse
                orientation="horizontal"
                in={showGroup}
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                {session.property.profile.name}
              </Collapse>
            </Button>
          </GroupModal>
          {router.asPath === "/" && (
            <IconButton
              sx={{ color: palette[9] }}
              onClick={() => router.push("/settings")}
            >
              <Icon className="outlined">settings</Icon>
            </IconButton>
          )}
        </>
      )}
    </Box>
  );
}
