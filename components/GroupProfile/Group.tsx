import LoadingButton from "@mui/lab/LoadingButton";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { House } from "../../types/houseProfile";
import { EditProperty } from "./EditProperty";
import { MemberList } from "./MemberList";
import { Storage } from "./Storage";

import {
  Box,
  Chip,
  Drawer,
  Icon,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { toastStyles } from "../../lib/useCustomTheme";
import { Changelog } from "./Changelog";

/**
 * House popup
 * @param {any} {handleClose}
 * @param {any} {data}
 * @returns {any}
 */
export const Group = React.memo(function Group({
  handleClose,
  data,
}: {
  handleClose: () => void;
  data: House;
}): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const color: string = data.profile.color ?? "lime";
  const router = useRouter();
  const invertColors: boolean = [
    "lime",
    "cyan",
    "green",
    "teal",
    "blue",
  ].includes(color);

  useEffect(() => {
    if (open && data.propertyId === global.property.propertyId) {
      setTimeout(() => {
        document
          .querySelector(`meta[name="theme-color"]`)
          ?.setAttribute("content", colors[color]["A400"]);
      });
      neutralizeBack(() => setOpen(false));
    } else {
      revivalBack();
      document
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute("content", colors[themeColor][100]);
    }
  }, [color, open, data.propertyId]);

  return (
    <>
      <ListItem
        id={
          data.propertyId === global.property.propertyId
            ? "activeProperty"
            : undefined
        }
        onClick={async () => {
          if (data.propertyId == global.property.propertyId) {
            setOpen(true);
          } else {
            try {
              router.push("/tasks");
              setLoading(true);
              const res = await fetchApiWithoutHook("property/join", {
                email: global.user.email,
                accessToken1: data.accessToken,
              });
              setLoading(false);
              handleClose();
              await mutate("/api/user");
              toast.success(
                <>
                  Switched to &ldquo;<u>{res.profile.name}</u>&rdquo;
                </>,
                toastStyles
              );
            } catch (error) {
              toast.error(
                "Oh no! An error occured while trying to switch groups. Please try again later.",
                toastStyles
              );
              setLoading(false);
            }
          }
        }}
        sx={{
          transition: "none",
          "& .MuiListItem-root": { transition: "all .1s" },
          "&:active .MuiListItem-root": {
            transform: "scale(.98)",
          },
          cursor: "unset",
          userSelect: "none",
          "&:hover": {
            background: `${
              colors[themeColor][global.user.darkMode ? 800 : 100]
            }!important`,
          },
          "&:active": {
            background: `${
              colors[themeColor][global.user.darkMode ? 800 : 200]
            }!important`,
          },
          ...(data.propertyId === global.property.propertyId && {
            background: global.user.darkMode
              ? "hsl(240,11%,25%)"
              : `${colors[themeColor][200]}!important`,
            "&:active": {
              background: global.user.darkMode
                ? "hsl(240,11%,25%)"
                : `${colors[themeColor][400]}!important`,
            },
            "&:hover": {
              background: global.user.darkMode
                ? "hsl(240,11%,25%)"
                : `${colors[themeColor][300]}!important`,
            },
          }),
        }}
      >
        <ListItem sx={{ gap: 1.5, px: 0, py: 0 }}>
          <ListItemAvatar sx={{ width: "auto", minWidth: "auto" }}>
            <Box
              sx={{
                width: 35,
                height: 35,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000!important",
                borderRadius: 4,
                background: colors[data.profile.color]["A400"],
                marginRight: 1,
              }}
            >
              <Icon>tag</Icon>
            </Box>
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                <Typography variant="h6" sx={{ fontWeight: "600" }}>
                  {data.profile.name}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    textTransform: "capitalize",
                    mt: 1,
                  }}
                >
                  <Icon className="outlined">
                    {data.profile.type === "dorm"
                      ? "cottage"
                      : data.profile.type === "apartment"
                      ? "location_city"
                      : data.profile.type === "study group"
                      ? "school"
                      : "home"}
                  </Icon>
                  {data.profile.type}
                </Typography>
                {!data.accepted && (
                  <Chip size="small" color="error" label="Invitation pending" />
                )}
              </>
            }
          />
          <ListItemIcon>
            <LoadingButton
              disableRipple
              loading={loading}
              sx={{
                px: 0,
                minWidth: "auto",
                borderRadius: 9,
                ml: "auto",
                color: "inherit",
              }}
            >
              {data.propertyId === global.property.propertyId && (
                <Icon className="outlined">east</Icon>
              )}
            </LoadingButton>
          </ListItemIcon>
        </ListItem>
      </ListItem>
      {data.propertyId === global.property.propertyId && (
        <Drawer
          anchor="right"
          ModalProps={{
            keepMounted: false,
          }}
          PaperProps={{
            sx: {
              height: "100vh",
              background:
                colors[data.profile.color][global.user.darkMode ? 900 : 50] +
                "!important",
              width: { xs: "100vw", md: "80vw", sm: "50vw" },
              maxWidth: "600px",
              overflow: "scroll",
            },
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Box
            sx={{
              overflow: "scroll",
            }}
          >
            <Box
              sx={{
                background: colors[color]["A400"],
                px: 3,
                height: "calc(300px + env(titlebar-area-height, 0px))",
                position: "relative",
                color: invertColors ? "black" : "white",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  p: 2,
                  width: "100%",
                  display: "flex",
                  paddingTop: "env(titlebar-area-height, 10px)",
                  alignItems: "center",
                }}
              >
                <IconButton
                  disableRipple
                  onClick={() => {
                    setOpen(false);
                  }}
                  sx={{
                    color: "inherit",
                    mr: 0.2,
                  }}
                >
                  <Icon>west</Icon>
                </IconButton>
                <Typography sx={{ mx: "auto", fontWeight: "600" }}>
                  Group
                </Typography>
                <Changelog />
                <EditProperty color={color} />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  p: 5,
                  py: 4,
                }}
              >
                <Typography
                  sx={{
                    textTransform: "capitalize",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                    background: invertColors
                      ? "rgba(0,0,0,0.2)"
                      : "rgba(255,255,255,0.2)",
                    px: 1.5,
                    pr: 2,
                    py: 0.5,
                    borderRadius: 5,
                    fontSize: "14px",
                  }}
                >
                  <Icon>
                    {global.property.profile.type === "dorm"
                      ? "cottage"
                      : global.property.profile.type === "apartment"
                      ? "location_city"
                      : global.property.profile.type === "study group"
                      ? "school"
                      : "home"}
                  </Icon>
                  {global.property.profile.type}
                </Typography>
                <Typography variant="h4" className="underline">
                  {global.property.profile.name || "Untitled property"}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                p: 2.5,
                px: { sm: "30px" },
              }}
            >
              <Storage color={color} />
              <Typography variant="h5" sx={{ fontWeight: "700", my: 2, mb: 1 }}>
                Members
              </Typography>
              <MemberList color={color} setOpen={setOpen} />
            </Box>
          </Box>
        </Drawer>
      )}
    </>
  );
});
