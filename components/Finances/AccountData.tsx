import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import CardActionArea from "@mui/material/CardActionArea";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import useFetch from "react-fetch-hook";
import dayjs from "dayjs";
import Slider, { SliderThumb } from "@mui/material/Slider";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";
import { currency_symbols } from "./AccountList";

function AirbnbThumbComponent(props: any) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="material-symbols-rounded">local_fire_department</span>
    </SliderThumb>
  );
}
function ZeroExpenseStreak({ accountId }: { accountId: string }) {
  const AirbnbSlider = styled(Slider)(({ theme }) => ({
    color: "#f9a825!important",
    height: 3,
    "& .MuiSlider-thumb": {
      height: 35,
      width: 35,
      boxShadow: 0,
      backgroundColor: "#fff!important",
      border: "2px solid #f9a825!important",
      "& .airbnb-bar": {
        height: 9,
        width: 1,
        backgroundColor: "currentColor!important"
      }
    },
    "& .MuiSlider-track": {
      height: 8,
      overflow: "hidden"
    },
    "& .MuiSlider-mark": {
      backgroundColor: "#aaa!important",
      height: 6,
      borderRadius: 9,
      width: 3,
      "&.MuiSlider-markActive": {
        opacity: 1,
        backgroundColor: "rgba(255,255,255,.3)!important"
      }
    },
    "& .MuiSlider-rail": {
      color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8!important",
      opacity: theme.palette.mode === "dark" ? undefined : 1,
      height: 8
    }
  }));
  const { isLoading, data }: any = useFetch(
    "/api/finance/fetchTransactions?" +
      new URLSearchParams({
        access_token: global.session.user.financeToken,
        start_date: dayjs().subtract(15, "day").format("YYYY-MM-DD"),
        end_date: dayjs().add(3, "day").format("YYYY-MM-DD")
      })
  );
  return isLoading ? (
    <Skeleton
      animation="wave"
      variant="rectangular"
      height={150}
      sx={{ borderRadius: 5, mt: 2 }}
    />
  ) : (
    <>
      <Card
        sx={{
          background: "rgba(200, 200, 200, .3)",
          borderRadius: 5,
          boxShadow: 0,
          p: 1,
          mt: 2
        }}
      >
        <CardContent>
          <AirbnbSlider
            components={{ Thumb: AirbnbThumbComponent }}
            step={1}
            marks
            min={0}
            disabled
            max={10}
            defaultValue={
              data.transactions.filter((e) => (e.account_id = accountId))[0]
                ? dayjs().diff(
                    data.transactions.filter(
                      (e) => (e.account_id = accountId)
                    )[0].authorized_date,
                    "d"
                  )
                : 0
            }
          />
          <Typography sx={{ mt: 1 }}>
            You haven't purchased anything for{" "}
            {data.transactions.filter((e) => (e.account_id = accountId))[0]
              ? dayjs().diff(
                  data.transactions.filter((e) => (e.account_id = accountId))[0]
                    .authorized_date,
                  "d"
                )
              : 0}{" "}
            days
            {(data.transactions.filter((e) => (e.account_id = accountId))[0]
              ? dayjs().diff(
                  data.transactions.filter((e) => (e.account_id = accountId))[0]
                    .authorized_date,
                  "d"
                )
              : 0) !== 0 && <> &ndash; Keep it up!</>}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}

function AccountHeader({
  balance,
  currency
}: {
  balance: number;
  currency: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "400px",
        alignItems: "center",
        borderRadius: { sm: "20px" },
        borderBottomLeftRadius: "0!important",
        borderBottomRightRadius: "0!important",
        justifyContent: "center",
        color: "white",
        background: "url(https://i.ibb.co/68RCqvc/image.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Typography gutterBottom variant="h2" sx={{ fontWeight: "800", mt: 5 }}>
          {currency_symbols[currency]}
          {balance}
        </Typography>
        <Typography variant="h6">Current balance</Typography>
      </div>
    </Box>
  );
}

function OptionsMenu() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <IconButton
        size="large"
        disableRipple
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{
          mr: -1,
          "&:hover": { background: "rgba(255,255,255,.1)" },
          transition: "none"
        }}
      >
        <span className="material-symbols-rounded">add</span>
      </IconButton>
    </>
  );
}

function Navbar({ setOpen, scrollTop, container }: any) {
  return (
    <>
      <AppBar
        position="absolute"
        sx={{
          background: scrollTop > 300 ? "#091f1e" : "transparent",
          transition: "backdrop-filter .2s, background .2s",
          color: "#fff",
          borderTopLeftRadius: { sm: "20px" },
          borderTopRightRadius: { sm: "20px" },
          ...(scrollTop > 100 && {
            backdropFilter: "blur(10px)"
          }),
          boxShadow: 0,
          p: 0.5,
          py: 1
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => setOpen(false)}
            aria-label="menu"
            sx={{
              mr: -1,
              "&:hover": { background: "rgba(255,255,255,.1)" },
              transition: "none"
            }}
            disableRipple
          >
            <span className="material-symbols-rounded">chevron_left</span>
          </IconButton>
          <Typography sx={{ flexGrow: 1, textAlign: "center" }} component="div">
            Overview
          </Typography>
          <OptionsMenu />
        </Toolbar>
      </AppBar>
    </>
  );
}

function Goal({ name, image }: { name: string; image: string }) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        onOpen={() => setOpen(true)}
        open={open}
        sx={{
          display: "flex",
          alignItems: { xs: "end", sm: "center" },
          height: "100vh",
          justifyContent: "center"
        }}
        PaperProps={{
          sx: {
            borderRadius: "28px",
            borderBottomLeftRadius: { xs: 0, sm: "28px!important" },
            borderBottomRightRadius: { xs: 0, sm: "28px!important" },
            position: "unset",
            mx: "auto",
            maxWidth: { sm: "80vw", xs: "100vw" },
            overflow: "hidden"
          }
        }}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{
            p: 3,
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(" +
              image +
              ")",
            color: "white",
            py: 6,
            px: 7,
            borderRadius: 5,
            mt: "-1px",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "600" }}>
            {name}
          </Typography>
          <Typography variant="h6">$100 / 200 raised</Typography>
        </Box>
        <Box sx={{ p: 5 }}>
          <TextField
            multiline
            fullWidth
            onBlur={(e) => {
              // alert(1);
              e.target.placeholder = "Click to add note";
              e.target.spellcheck = false;
            }}
            onKeyUp={(e: any) => {
              if (e.code === "Enter" && e.ctrlKey) {
                e.preventDefault();
                e.target.value = e.target.value.trim();
                e.target.blur();
              }
            }}
            InputProps={{
              disableUnderline: true,
              sx: {
                px: 2.5,
                py: 1.5,
                borderRadius: "15px"
              }
            }}
            spellCheck={false}
            variant="filled"
            // defaultValue={note}
            maxRows={4}
            minRows={4}
            onFocus={(e) => {
              e.target.placeholder = "CTRL+ENTER to save";
              e.target.spellcheck = true;
            }}
            placeholder="Click to add note"
          />
          <Divider sx={{ my: 4 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <div>
              <Button
                sx={{
                  textTransform: "none",
                  mr: 1,
                  mb: 1,
                  borderRadius: 5
                }}
                disableElevation
                variant="contained"
                size="large"
              >
                Mark as done
              </Button>
              <Button
                sx={{
                  textTransform: "none",
                  mb: 1,
                  borderRadius: 5
                }}
                disableElevation
                variant="outlined"
                size="large"
              >
                Remove goal
              </Button>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  display: { xs: "none", sm: "block" },
                  color: "#505050"
                }}
              >
                Goal set 69 years ago
              </Typography>
            </div>
          </Box>
        </Box>
      </SwipeableDrawer>
      <Card
        sx={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(" +
            image +
            ")",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          borderRadius: 5,
          mt: 2,
          color: "white"
        }}
      >
        <CardActionArea
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 5,
            p: 1
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "600" }}>
              {name}
            </Typography>
            <Typography>$100 / 200 raised</Typography>
            <LinearProgress
              variant="determinate"
              sx={{
                mt: 2,
                borderRadius: 99,
                height: 2,
                background: "rgba(200,200,200,.4)!important",
                "& *": { borderRadius: 99, background: "#fff!important" }
              }}
              value={69}
            />
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export function AccountData({ setOpen, scrollTop, account }: any) {
  return (
    <>
      <Navbar setOpen={setOpen} scrollTop={scrollTop} />
      <AccountHeader
        currency={account.balances.iso_currency_code}
        balance={account.balances.current}
      />

      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Streak
        </Typography>
        <ZeroExpenseStreak accountId={account.account_id} />
        <Typography variant="h5" sx={{ fontWeight: "600", mt: 5 }}>
          Goals
        </Typography>
        {/* <pre>{JSON.stringify(account, null, 2)}</pre> */}
        <Goal
          image="https://images.unsplash.com/photo-1524207874394-5ec7c8c8e1a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80"
          name="Save up for a vacation"
        />
        <Goal
          image="https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80"
          name="Go to a theme park"
        />
        <Goal
          image="https://images.unsplash.com/photo-1525921429624-479b6a26d84d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          name="Pay off debt"
        />
      </Box>
    </>
  );
}
