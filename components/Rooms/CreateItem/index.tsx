import { useApi } from "@/lib/client/useApi";
import { colors } from "@/lib/colors";
import type { CustomRoom as Room } from "@prisma/client";
import React, { cloneElement } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Puller } from "../../Puller";
import { CreateItemModal } from "./modal";

import { useBackButton } from "@/lib/client/useBackButton";
import { useSession } from "@/lib/client/useSession";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CssBaseline,
  DialogTitle,
  Grid,
  Icon,
  List,
  Skeleton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";

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
  const session = useSession();
  return (
    <Grid item xs={12} sm={4} spacing={2}>
      <CreateItemModal mutationUrl="" room={title}>
        <Card
          sx={{
            textAlign: {
              sm: "center",
            },
            boxShadow: 0,
            borderRadius: { xs: 1, sm: 4 },
            transition: "transform .2s, border-radius .2s",
            "&:active": {
              boxShadow: "none!important",
              transform: "scale(0.98)",
              transition: "none",
            },
          }}
        >
          <CardActionArea
            disableRipple
            sx={{
              "&:hover": {
                background: session.user.darkMode
                  ? "hsl(240,11%,15%)!important"
                  : `${colors[session?.themeColor || "grey"][100]}!important`,
              },
              borderRadius: 6,
              "&:focus-within": {
                background: session.user.darkMode
                  ? "hsl(240,11%,18%)!important"
                  : `${colors[session?.themeColor || "grey"][100]}!important`,
              },
              "&:active": {
                background: session.user.darkMode
                  ? "hsl(240,11%,25%)!important"
                  : `${colors[session?.themeColor || "grey"][100]}!important`,
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                gap: 2,
                py: 1,
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
  const session = useSession();
  const handleClickOpen = () => setOpen(true);

  if (error) {
    return <>An error occured while trying to fetch your rooms. </>;
  }

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        PaperProps={{
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
              {[...new Array(12)].map((_, i) => (
                <Grid item xs={12} sm={3} sx={{ p: 2, py: 1 }} key={i}>
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
                icon={<Icon className="outlined">inventory_2</Icon>}
              />
              <AddItemOption
                title="Camping"
                icon={<Icon className="outlined">camping</Icon>}
              />
              <AddItemOption
                title="Garden"
                icon={<Icon className="outlined">yard</Icon>}
              />
              {data.map((room: Room) => (
                <AddItemOption
                  title={room.id.toString()}
                  key={room.id.toString()}
                  alias={room.name}
                  icon={<Icon className="outlined">label</Icon>}
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
                  colors[session?.themeColor || "grey"][
                    session.user.darkMode ? 900 : 100
                  ]
                }!important`,
              },
              borderRadius: 6,
              "&:focus-within": {
                background: `${
                  colors[session?.themeColor || "grey"][
                    session.user.darkMode ? 900 : 100
                  ]
                }!important`,
              },
              "&:active": {
                background: `${
                  colors[session?.themeColor || "grey"][
                    session.user.darkMode ? 900 : 100
                  ]
                }!important`,
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                py: 1,
              }}
            >
              <Typography variant="h4">
                <Icon className="outlined">add_location_alt</Icon>
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
  const session = useSession();
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Grid container sx={{ p: 1 }}>
        {session.property.profile.type !== "study group" &&
          session.property.profile.type !== "dorm" && (
            <AddItemOption
              title="Kitchen"
              icon={<Icon className="outlined">blender</Icon>}
            />
          )}
        {session.property.profile.type !== "study group" && (
          <>
            <AddItemOption
              title="Bedroom"
              icon={<Icon className="outlined">bedroom_parent</Icon>}
            />
            <AddItemOption
              title="Bathroom"
              icon={<Icon className="outlined">bathroom</Icon>}
            />

            <AddItemOption
              title="Storage"
              icon={<Icon className="outlined">inventory_2</Icon>}
            />
          </>
        )}
        {session.property.profile.type !== "study group" &&
          session.property.profile.type !== "dorm" && (
            <>
              <AddItemOption
                title="Garage"
                icon={<Icon className="outlined">garage</Icon>}
              />
              <AddItemOption
                title={<>Living&nbsp;room</>}
                icon={<Icon className="outlined">living</Icon>}
              />
              <AddItemOption
                title={<>Dining</>}
                icon={<Icon className="outlined">dining</Icon>}
              />
              <AddItemOption
                title={<>Laundry&nbsp;room</>}
                icon={<Icon className="outlined">local_laundry_service</Icon>}
              />
              <MoreRooms />
            </>
          )}
        {session.property.profile.type === "study group" && (
          <AddItemOption
            title="Backpack"
            icon={<Icon className="outlined">backpack</Icon>}
          />
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
  const session = useSession();

  useHotkeys("ctrl+s", (e) => {
    e.preventDefault();
    setOpen(true);
  });

  useBackButton(() => setOpen(false));

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
    if (session.property.role !== "read-only") {
      setOpen(true);
    }
  };

  const trigger = cloneElement(children, {
    onclick: handleAddItemDrawerOpen,
  });

  return (
    <>
      <CssBaseline />
      {trigger}

      <SwipeableDrawer
        anchor="bottom"
        PaperProps={{
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
          },
        }}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={toggleDrawer(true)}
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
            sx={{ mx: "auto", textAlign: "center", fontWeight: "700" }}
          >
            Select a room
          </Typography>

          <Content />
        </Box>
      </SwipeableDrawer>
    </>
  );
}
