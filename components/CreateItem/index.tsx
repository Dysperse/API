import { Global } from "@emotion/react";
import type { CustomRoom as Room } from "@prisma/client";
import React, { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useApi } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { Puller } from "../Puller";
import { CreateItemModal } from "./modal";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CssBaseline,
  DialogTitle,
  Grid,
  List,
  Skeleton,
  styled,
  SwipeableDrawer,
  Typography,
} from "@mui/material";

const Root = styled("div")(() => ({
  height: "100%",
}));

/**
 * Item popup option
 * @param alias Room alias to replace room title
 * @param toggleDrawer Function to toggle drawer
 * @param icon Icon to display in drawer
 * @param title Title to display in drawer
 * @returns JSX.Element
 */
function AddItemOption({
  alias,
  icon,
  title,
}: {
  alias?: string;
  icon: JSX.Element | string;
  title: JSX.Element | string;
}): JSX.Element {
  return (
    <Grid item xs={12} sm={4}>
      <CreateItemModal room={title} alias={alias}>
        <Card
          sx={{
            textAlign: {
              sm: "center",
            },
            boxShadow: 0,
            borderRadius: { xs: 1, sm: 6 },
            transition: "transform .2s, border-radius .2s",
            "&:active": {
              boxShadow: "none!important",
              transform: "scale(0.98)",
              transition: "border-radius .2s, transform 0s!important",
              borderRadius: { xs: 9, sm: 9 },
            },
          }}
        >
          <CardActionArea
            disableRipple
            sx={{
              "&:hover": {
                background: global.user.darkMode
                  ? "hsl(240,11%,15%)!important"
                  : `${colors[themeColor][100]}!important`,
              },
              borderRadius: 6,
              "&:focus-within": {
                background: global.user.darkMode
                  ? "hsl(240,11%,18%)!important"
                  : `${colors[themeColor][100]}!important`,
              },
              "&:active": {
                background: global.user.darkMode
                  ? "hsl(240,11%,25%)!important"
                  : `${colors[themeColor][100]}!important`,
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                gap: 2,
                py: { xs: 1, sm: 2 },
                alignItems: "center",
              }}
            >
              <Typography variant="h4">{icon}</Typography>
              <Typography
                sx={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: "600",
                  overflow: "hidden",
                }}
              >
                {alias || title}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </CreateItemModal>
    </Grid>
  );
}
/**
 * More rooms collapsible
 * @returns JSX.Element
 */
function MoreRooms(): JSX.Element {
  const { error, data } = useApi("property/rooms");
  const [open, setOpen] = React.useState<boolean>(false);
  useStatusBar(open, 2);

  if (error) {
    return <>An error occured while trying to fetch your rooms. </>;
  }
  /**
   * Handle drawer toggle
   */
  const handleClickOpen = () => setOpen(true);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        PaperProps={{
          elevation: 0,
          sx: {
            width: {
              xs: "100vw",
              sm: "50vw",
            },
            maxHeight: "80vh",
            maxWidth: "700px",
            "& .MuiPaper-root": {
              background: "transparent!important",
            },
            "& *": { transition: "none!important" },
            borderRadius: "28px 28px 0 0 !important",
            mx: "auto",
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 20%)",
            }),
          },
        }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <Puller />
        <DialogTitle sx={{ textAlign: "center" }}>Other rooms</DialogTitle>
        <Box sx={{ height: "100%", overflow: "scroll" }}>
          {!data ? (
            <Grid container sx={{ p: 2 }}>
              {[...new Array(12)].map(() => (
                <Grid
                  item
                  xs={12}
                  sm={3}
                  sx={{ p: 2, py: 1 }}
                  key={Math.random().toString()}
                >
                  <div style={{ background: "#eee" }}>
                    <Skeleton
                      variant="rectangular"
                      height={69}
                      width={"100%"}
                      animation="wave"
                      sx={{ borderRadius: 5, background: "red!important" }}
                    />
                  </div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container sx={{ p: 2 }}>
              <AddItemOption
                title="Storage room"
                icon={
                  <span className="material-symbols-rounded">inventory_2</span>
                }
              />
              <AddItemOption
                title="Camping"
                icon={<span className="material-symbols-rounded">camping</span>}
              />
              <AddItemOption
                title="Garden"
                icon={<span className="material-symbols-rounded">yard</span>}
              />
              {data.map((room: Room) => (
                <AddItemOption
                  title={room.id.toString()}
                  key={room.id.toString()}
                  alias={room.name}
                  icon={<span className="material-symbols-rounded">label</span>}
                />
              ))}
            </Grid>
          )}
        </Box>
      </SwipeableDrawer>
      <Grid item xs={12} sm={4}>
        <Card
          sx={{
            textAlign: {
              sm: "center",
            },
            boxShadow: 0,
            borderRadius: { xs: 1, sm: 6 },
            transition: "transform .2s",
            "&:active": {
              boxShadow: "none!important",
              transform: "scale(0.98)",
              transition: "none",
            },
          }}
          onClick={handleClickOpen}
        >
          <CardActionArea
            disableRipple
            sx={{
              px: {
                xs: 3,
                sm: 0,
              },
              "&:hover": {
                background: `${
                  colors[themeColor][global.user.darkMode ? 900 : 100]
                }!important`,
              },
              borderRadius: 6,
              "&:focus-within": {
                background: `${
                  colors[themeColor][global.user.darkMode ? 900 : 100]
                }!important`,
              },
              "&:active": {
                background: `${
                  colors[themeColor][global.user.darkMode ? 900 : 100]
                }!important`,
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Typography variant="h4">
                <span className="material-symbols-rounded">
                  add_location_alt
                </span>
              </Typography>
              <Typography
                sx={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  fontWeight: "700",
                }}
              >
                More&nbsp;rooms
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </>
  );
}
/**
 *
 * @param toggleDrawer Function to toggle the drawer
 * @returns JSX.Element
 */
function Content(): JSX.Element {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Grid container sx={{ p: 1 }}>
        {global.property.profile.type !== "dorm" && (
          <AddItemOption
            title="Kitchen"
            icon={<span className="material-symbols-rounded">blender</span>}
          />
        )}
        <AddItemOption
          title="Bedroom"
          icon={
            <span className="material-symbols-rounded">bedroom_parent</span>
          }
        />
        <AddItemOption
          title="Bathroom"
          icon={<span className="material-symbols-rounded">bathroom</span>}
        />

        <AddItemOption
          title="Storage"
          icon={<span className="material-symbols-rounded">inventory_2</span>}
        />
        {global.property.profile.type !== "dorm" && (
          <>
            <AddItemOption
              title="Garage"
              icon={<span className="material-symbols-rounded">garage</span>}
            />
            <AddItemOption
              title={<>Living&nbsp;room</>}
              icon={<span className="material-symbols-rounded">living</span>}
            />
            <AddItemOption
              title={<>Dining</>}
              icon={<span className="material-symbols-rounded">dining</span>}
            />
            <AddItemOption
              title={<>Laundry&nbsp;room</>}
              icon={
                <span className="material-symbols-rounded">
                  local_laundry_service
                </span>
              }
            />
            <MoreRooms />
          </>
        )}
      </Grid>
    </List>
  );
}

/**
 * Select room to create item popup
 * @param props
 * @returns JSX.Element
 */

export default function AddPopup({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);

  useHotkeys("ctrl+s", (e) => {
    e.preventDefault();
    document.getElementById("add_trigger")?.click();
  });

  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  useStatusBar(open);

  /**
   * Toggles the drawer's open state
   * @param {boolean} newOpen
   * @returns {any}
   */
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  /**
   * handleAddItemDrawerOpen
   */
  const handleAddItemDrawerOpen = () => {
    if (global.property.role !== "read-only") {
      setOpen(true);
    }
  };

  return (
    <>
      <CssBaseline />
      <div aria-hidden id="add_trigger" onClick={handleAddItemDrawerOpen}>
        {children}
      </div>

      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        PaperProps={{
          elevation: 0,
          sx: {
            width: {
              xs: "100vw",
              sm: "100%",
            },
            maxHeight: "80vh",
            maxWidth: "600px",
            "& *:not(.MuiTouchRipple-child, .puller)": {
              background: "transparent!important",
            },
            borderRadius: "28px 28px 0 0 !important",
            mx: "auto",
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 20%)",
            }),
          },
        }}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={toggleDrawer(true)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Puller />
        <Box
          sx={{
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h6"
            className="font-secondary"
            sx={{ mx: "auto", textAlign: "center" }}
          >
            Create item
          </Typography>

          <Content />
        </Box>
      </SwipeableDrawer>
    </>
  );
}
