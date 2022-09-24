import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import BoringAvatar from "boring-avatars";
import hexToRgba from "hex-to-rgba";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { colors } from "../../lib/colors";
import { ProfileMenu } from "../Layout/Profile";
import { AppsMenu } from "./AppsMenu";
import { InviteButton } from "./InviteButton";
import { SearchPopup } from "./Search";

/**
 * Returns the initials of a name
 * @param {any} fullName
 * @returns {any}
 */
export const getInitials = (fullName) => {
  const allNames = fullName.trim().split(" ");
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, "");
  return initials;
};

/**
 * Navbar scroll trigger
 * @param {any} props
 * @returns {any}
 */
function ElevationScroll(props) {
  const { children, window } = props;
  const router = useRouter();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });
  useEffect(() => {
    if (document) {
      document
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute(
          "content",
          trigger
            ? global.user.darkMode
              ? "rgba(33,33,38)"
              : colors[router.asPath === "/maintenance" ? "green" : themeColor][
                  "100"
                ]
            : global.user.darkMode
            ? "hsl(240, 11%, 10%)"
            : router.asPath === "/maintenance"
            ? colors.green[100]
            : "#fff"
        );
    }
  });
  const badgeStyles = {
    "& .MuiBadge-badge": {
      transform: "none",
      border: `2px solid ${
        router.asPath === "/maintenance" ? colors.green[100] : "#fff"
      }`,
      width: 12,
      height: 12,
      borderRadius: "50%",
    },
    "& .active .MuiBadge-badge": {
      borderColor: "red!important",
    },
    "& .MuiBadge-invisible": {
      transform: "scale(0) translate(0px, 0px) !important",
    },
  };
  return React.cloneElement(children, {
    className: trigger ? "active" : "",
    sx: trigger
      ? {
          "& .MuiBadge-badge": {
            transform: "none",
            border: `2px solid ${
              colors[
                router.asPath === "/maintenance" ? "green" : themeColor
              ][100]
            }`,
            width: 12,
            height: 12,
            borderRadius: "50%",
          },
          color: global.user.darkMode ? "white" : "black",
          py: {
            sm: 1,
            xs: 0.9,
          },
          pr: 0.4,
          backdropFilter: "blur(20px)",
          background: global.user.darkMode
            ? "rgba(33,33,38)"
            : hexToRgba(
                colors[router.asPath === "/maintenance" ? "green" : themeColor][
                  "100"
                ],
                1
              ),

          ["@supports not (backdrop-filter: blur(20px))"]: {
            background:
              colors[
                router.asPath === "/maintenance" ? "green" : themeColor
              ][100],
          },
        }
      : {
          ...badgeStyles,
          color: global.user.darkMode ? "white" : "black",
          pr: 0.4,
          py: {
            sm: 1,
            xs: 0.9,
          },
          // transition: "all .2s",
          background: {
            xs: global.user.darkMode
              ? "rgba(0,0,0,0)"
              : router.asPath === "/maintenance"
              ? colors.green[100]
              : "rgba(255,255,255,.5)",
            sm: global.user.darkMode ? "rgba(0,0,0,0)" : "rgba(255,255,255,.5)",
          },
          backdropFilter: "blur(10px)",
        },
  });
}

/**
 * Navbar component
 * @returns {any}
 */
export function Navbar(): JSX.Element {
  return (
    <ElevationScroll>
      <AppBar elevation={0} position="fixed">
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <InviteButton />
          </Box>
          <SearchPopup />
          <Box sx={{ display: { xs: "none", sm: "unset" } }}>
            <AppsMenu />
          </Box>
          <ProfileMenu>
            <Tooltip title="My account">
              <Badge
                badgeContent={1}
                color="warning"
                variant="dot"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <IconButton
                  color="inherit"
                  disableRipple
                  sx={{
                    transition: "none",
                    p: 0,
                    ml: 0.6,
                    color: global.user.darkMode
                      ? "hsl(240, 11%, 90%)"
                      : "#606060",
                    "&:hover": {
                      background: "rgba(200,200,200,.3)",
                      color: global.user.darkMode
                        ? "hsl(240, 11%, 95%)"
                        : "#000",
                    },
                    "&:focus-within": {
                      background: `${
                        global.user.darkMode
                          ? colors[themeColor]["900"]
                          : colors[themeColor]["50"]
                      }!important`,
                      color: global.user.darkMode
                        ? "hsl(240, 11%, 95%)"
                        : "#000",
                    },
                  }}
                >
                  <BoringAvatar
                    size={35}
                    name={global.user.name}
                    variant="beam"
                    colors={[
                      "#801245",
                      "#F4F4DD",
                      "#DCDBAF",
                      "#5D5C49",
                      "#3D3D34",
                    ]}
                  />
                </IconButton>
              </Badge>
            </Tooltip>
          </ProfileMenu>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}
