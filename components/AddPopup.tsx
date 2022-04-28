import React, { useEffect } from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DialogTitle from "@mui/material/DialogTitle";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import { CreateItemModal } from "./CreateItemModal";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { CreateListModal } from "./CreateListModal";
import { useRouter } from "next/router";

const Root = styled("div")(({ theme }) => ({
  height: "100%"
}));

function AddItemOption({ s = 3, toggleDrawer, icon, title }: any): JSX.Element {
  return (
    <Grid item xs={s}>
      <CreateItemModal room={title} toggleDrawer={toggleDrawer}>
        <Card sx={{ textAlign: "center", boxShadow: 0, borderRadius: 6 }}>
          <CardActionArea
            disableRipple
            onClick={() => toggleDrawer(false)}
            sx={{
              "&:hover": {
                background: "rgba(200,200,200,.3)!important"
              },
              "&:focus": {
                background: "rgba(200,200,200,.5)!important"
              },
              "&:active": {
                background: "rgba(200,200,200,.6)!important"
              }
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h4">{icon}</Typography>
              <Typography>{title}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </CreateItemModal>
    </Grid>
  );
}
function Content({ toggleDrawer }: any) {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Grid container sx={{ p: 1 }}>
        <AddItemOption
          toggleDrawer={toggleDrawer}
          title="Kitchen"
          icon={<span className="material-symbols-rounded">microwave</span>}
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
        <AddItemOption
          toggleDrawer={toggleDrawer}
          title="Storage room"
          icon={<span className="material-symbols-rounded">inventory_2</span>}
        />
      </Grid>
      <Box sx={{ px: 5 }}>
        <Divider />
      </Box>

      <Grid container sx={{ p: 1 }}>
        <Grid item xs={6}>
          <CreateListModal parent="-1" title="reminder">
            <Card sx={{ textAlign: "center", boxShadow: 0, borderRadius: 6 }}>
              <CardActionArea
                disableRipple
                onClick={() => toggleDrawer(false)}
                sx={{
                  "&:hover": {
                    background: "rgba(200,200,200,.3)!important"
                  },
                  "&:focus": {
                    background: "rgba(200,200,200,.5)!important"
                  },
                  "&:active": {
                    background: "rgba(200,200,200,.6)!important"
                  }
                }}
              >
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="h4">
                    <span className="material-symbols-rounded">check</span>
                  </Typography>
                  <Typography>Reminder</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </CreateListModal>
        </Grid>
        <Grid item xs={6}>
          <CreateListModal parent="-2" title="item">
            <Card sx={{ textAlign: "center", boxShadow: 0, borderRadius: 6 }}>
              <CardActionArea
                disableRipple
                onClick={() => toggleDrawer(false)}
                sx={{
                  "&:hover": {
                    background: "rgba(200,200,200,.3)!important"
                  },
                  "&:focus": {
                    background: "rgba(200,200,200,.5)!important"
                  },
                  "&:active": {
                    background: "rgba(200,200,200,.6)!important"
                  }
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
function Puller() {
  return (
    <Box
      className="puller"
      sx={{
        width: "50px",
        backgroundColor: global.theme === "dark" ? "#505050" : "#eee",
        height: "7px",
        margin: "auto",
        borderRadius: 9,
        mt: 1,
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        display: "inline-block"
      }}
    />
  );
}

export default function AddPopup(props: any) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
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
            ? "#101010"
            : "#808080"
          : global.theme === "dark"
          ? "#101010"
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
            overflow: "visible"
          }
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
              sm: "50vw"
            },
            "& *:not(.MuiTouchRipple-child, .puller)": {
              background: "transparent!important"
            },
            borderRadius: "28px 28px 0 0 !important",
            mx: "auto"
          }
        }}
        open={open}
        onClose={() => {
          router.push(window.location.pathname);
          setOpen(false);
        }}
        onOpen={toggleDrawer(true)}
        ModalProps={{
          keepMounted: true
        }}
      >
        <Puller />
        <DialogTitle sx={{ mt: 2, textAlign: "center" }}>Create</DialogTitle>
        <Content toggleDrawer={toggleDrawer} />
      </SwipeableDrawer>
    </Root>
  );
}
