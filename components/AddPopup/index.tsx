import { Global } from "@emotion/react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { Puller } from "../Puller";
import { CreateItemModal } from "./CreateItemModal";
import { CreateListModal } from "./CreateListModal";
import * as colors from "@mui/material/colors";
import useSWR from "swr";

const Root = styled("div")(() => ({
  height: "100%",
}));

function AddItemOption({
  alias,
  s = 4,
  toggleDrawer,
  icon,
  title,
}: any): JSX.Element {
  return (
    <Grid item xs={s}>
      <CreateItemModal room={title} toggleDrawer={toggleDrawer}>
        <Card
          sx={{
            textAlign: "center",
            boxShadow: 0,
            borderRadius: 6,
            transition: "transform .2s",
            "&:active": {
              boxShadow: "none!important",
              transform: "scale(0.98)",
              transition: "none",
            },
          }}
        >
          <CardActionArea
            disableRipple
            onClick={() => toggleDrawer(false)}
            sx={{
              "&:hover": {
                background:
                  colors[themeColor][global.theme === "dark" ? 900 : 100] +
                  "!important",
              },
              borderRadius: 6,
              "&:focus-within": {
                background:
                  colors[themeColor][global.theme === "dark" ? 900 : 100] +
                  "!important",
                boxShadow:
                  "inset 0px 0px 0px 2px " +
                  colors[themeColor][global.theme === "dark" ? 200 : 800],
              },
              "&:active": {
                boxShadow: "none!important",
                background:
                  colors[themeColor][global.theme === "dark" ? 900 : 100] +
                  "!important",
              },
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h4">{icon}</Typography>
              <Typography>{alias ?? title}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </CreateItemModal>
    </Grid>
  );
}
function MoreRooms(): JSX.Element {
  const url = "https://api.smartlist.tech/v2/rooms/";
  const [open, setOpen] = React.useState<boolean>(false);
  const { error, data }: any = useSWR(url, () =>
    fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        token: global.session.accessToken,
      }),
    }).then((res) => res.json())
  );
  if (error) {
    return <>An error occured while trying to fetch your rooms. </>;
  }
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        PaperProps={{
          sx: {
            width: {
              xs: "100vw",
              sm: "50vw",
            },
            maxWidth: "700px",
            "& *:not(.MuiTouchRipple-child, .puller)": {
              background: "transparent!important",
            },
            borderRadius: "28px 28px 0 0 !important",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 20%)",
            }),
          },
        }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Puller />
        <DialogTitle sx={{ mt: 2, textAlign: "center" }}>
          Other rooms
        </DialogTitle>
        {!data ? (
          <Grid container sx={{ p: 2 }}>
            {[...new Array(12)].map(() => (
              <Grid
                item
                xs={3}
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
              toggleDrawer={() => setOpen(false)}
              title="Storage room"
              icon={
                <span className="material-symbols-rounded">inventory_2</span>
              }
            />
            <AddItemOption
              toggleDrawer={() => setOpen(false)}
              title="Camping"
              icon={<span className="material-symbols-rounded">image</span>}
            />
            <AddItemOption
              toggleDrawer={() => setOpen(false)}
              title="Garden"
              icon={<span className="material-symbols-rounded">yard</span>}
            />
            {
              data.data.map((room: any, key: any) => (
                <AddItemOption
                  toggleDrawer={() => setOpen(false)}
                  title={room.id}
                  key={key}
                  alias={room.name}
                  icon={<span className="material-symbols-rounded">label</span>}
                />
              ))}
          </Grid>
        )}
      </SwipeableDrawer>
      <Grid item xs={4}>
        <Card
          sx={{ textAlign: "center", boxShadow: 0, borderRadius: 6 }}
          onClick={() => setOpen(true)}
        >
          <CardActionArea
            disableRipple
            sx={{
              "&:hover": {
                background:
                  colors[themeColor][global.theme === "dark" ? 900 : 100] +
                  "!important",
              },
              borderRadius: 6,
              "&:focus-within": {
                background:
                  colors[themeColor][global.theme === "dark" ? 900 : 100] +
                  "!important",
                boxShadow:
                  "inset 0px 0px 0px 2px " +
                  colors[themeColor][global.theme === "dark" ? 200 : 800],
              },
              "&:active": {
                boxShadow: "none!important",
                background:
                  colors[themeColor][global.theme === "dark" ? 900 : 100] +
                  "!important",
              },
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h4">
                <span className="material-symbols-rounded">
                  add_location_alt
                </span>
              </Typography>
              <Typography>More rooms</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </>
  );
}
function Content({ toggleDrawer }: any) {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Grid container sx={{ p: 1 }}>
        <AddItemOption
          toggleDrawer={toggleDrawer}
          title="Kitchen"
          icon={<span className="material-symbols-rounded">oven_gen</span>}
        />
        <AddItemOption
          toggleDrawer={toggleDrawer}
          title="Bathroom"
          icon={<span className="material-symbols-rounded">bathroom</span>}
        />
        <AddItemOption
          toggleDrawer={toggleDrawer}
          title="Bedroom"
          icon={
            <span className="material-symbols-rounded">bedroom_parent</span>
          }
        />
        <AddItemOption
          toggleDrawer={toggleDrawer}
          title="Garage"
          icon={<span className="material-symbols-rounded">garage</span>}
        />
        <AddItemOption
          toggleDrawer={toggleDrawer}
          title="Living room"
          icon={<span className="material-symbols-rounded">living</span>}
        />
        <AddItemOption
          toggleDrawer={toggleDrawer}
          title="Dining room"
          icon={<span className="material-symbols-rounded">dining</span>}
        />
        <AddItemOption
          toggleDrawer={toggleDrawer}
          title="Laundry room"
          icon={
            <span className="material-symbols-rounded">
              local_laundry_service
            </span>
          }
        />
        <MoreRooms />
      </Grid>
      <Box sx={{ px: 5 }}>
        <Divider />
      </Box>

      <Grid container sx={{ p: 1,display:"none" }}>
        <Grid item xs={6}>
          <CreateListModal parent="-1" title="reminder">
            <Card sx={{ textAlign: "center", boxShadow: 0, borderRadius: 6 }}>
              <CardActionArea
                disableRipple
                onClick={() => toggleDrawer(false)}
                 id="listTrigger_0"
                sx={{
                  transition: "transform .2s",
                  "&:active": {
                    boxShadow: "none!important",
                    transform: "scale(0.98)",
                    transition: "none",
                  },
                  "&:focus-within": {
                    background:
                      colors[themeColor][global.theme === "dark" ? 900 : 100] +
                      "!important",
                    boxShadow:
                      "inset 0px 0px 0px 2px " +
                      colors[themeColor][global.theme === "dark" ? 200 : 800],
                  },
                  "&:hover": {
                    background:
                      colors[themeColor][global.theme === "dark" ? 900 : 100] +
                      "!important",
                    boxShadow: "none!important",
                  },
                  borderRadius: 6,
                }}
              >
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="h4">
                    <span className="material-symbols-rounded">check</span>
                  </Typography>
                  <Typography>To-do list</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </CreateListModal>
        </Grid>
        <Grid item xs={6}>
          <CreateListModal parent="-2" title="item">
            <Card sx={{ textAlign: "center", boxShadow: 0, borderRadius: 6 }}>
              <CardActionArea
               id="listTrigger_1"
                disableRipple
                onClick={() => toggleDrawer(false)}
                sx={{
                  "&:focus-within": {
                    background:
                      colors[themeColor][global.theme === "dark" ? 900 : 100] +
                      "!important",
                    boxShadow:
                      "inset 0px 0px 0px 2px " +
                      colors[themeColor][global.theme === "dark" ? 200 : 800],
                  },
                  "&:hover": {
                    background:
                      colors[themeColor][global.theme === "dark" ? 900 : 100] +
                      "!important",
                    boxShadow: "none!important",
                  },
                  borderRadius: 6,
                  transition: "transform .2s",
                  "&:active": {
                    boxShadow: "none!important",
                    transform: "scale(0.98)",
                    transition: "none",
                  },
                }}
              >
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="h4">
                    <span className="material-symbols-rounded">
                      receipt_long
                    </span>
                  </Typography>
                  <Typography>Shopping list</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </CreateListModal>
        </Grid>
      </Grid>
    </List>
  );
}
export default function AddPopup(props: any) {
  const [open, setOpen] = React.useState<boolean>(false);
  useEffect(() => {
    document.documentElement.classList[open ? "add" : "remove"](
      "prevent-scroll"
    );
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        open
          ? global.theme === "dark"
            ? "hsl(240, 11%, 5%)"
            : "#808080"
          : global.theme === "dark"
          ? "hsl(240, 11%, 10%)"
          : "#fff"
      );
  });
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: "auto",
            overflow: "visible",
          },
        }}
      />
      <Box onClick={toggleDrawer(true)}>{props.children}</Box>

      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        PaperProps={{
          sx: {
            width: {
              xs: "100vw",
              sm: "50vw",
            },
            maxWidth: "700px",
            "& *:not(.MuiTouchRipple-child, .puller)": {
              background: "transparent!important",
            },
            borderRadius: "28px 28px 0 0 !important",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 20%)",
            }),
          },
        }}
        open={open}
        onClose={() => {
          // router.push(window.location.pathname);
          // router.reload(window.location.pathname);
          setOpen(false);
        }}
        onOpen={toggleDrawer(true)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box sx={{ pt: 1 }}>
          <Puller />
        </Box>
        <DialogTitle sx={{ mt: 2, textAlign: "center", fontWeight: "600" }}>
          Create
        </DialogTitle>
        <Content toggleDrawer={toggleDrawer} />
      </SwipeableDrawer>
    </Root>
  );
}
