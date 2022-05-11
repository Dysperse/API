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
import useFetch from "react-fetch-hook";
import dayjs from "dayjs";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

const currency_symbols = {
  USD: "$",
  EUR: "€",
  CRC: "₡",
  GBP: "£",
  ILS: "₪",
  INR: "₹",
  JPY: "¥",
  KRW: "₩",
  NGN: "₦",
  PHP: "₱",
  PLN: "zł",
  PYG: "₲",
  THB: "฿",
  UAH: "₴",
  VND: "₫"
};

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
    color: "#f9a825",
    height: 3,
    "& .MuiSlider-thumb": {
      height: 35,
      width: 35,
      boxShadow: 0,
      backgroundColor: "#fff",
      border: "2px solid #f9a825",
      "& .airbnb-bar": {
        height: 9,
        width: 1,
        backgroundColor: "currentColor"
      }
    },
    "& .MuiSlider-track": {
      height: 8,
      overflow: "hidden"
    },
    "& .MuiSlider-mark": {
      backgroundColor: "#aaa",
      height: 6,
      borderRadius: 9,
      width: 3,
      "&.MuiSlider-markActive": {
        opacity: 1,
        backgroundColor: "rgba(255,255,255,.3)"
      }
    },
    "& .MuiSlider-rail": {
      color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
      opacity: theme.palette.mode === "dark" ? undefined : 1,
      height: 8
    }
  }));
  const { isLoading, data }: any = useFetch(
    "/api/finance/fetchTransactions?" +
      new URLSearchParams({
        access_token: global.session.user.financeToken,
        start_date: dayjs().subtract(5, "day").format("YYYY-MM-DD"),
        end_date: dayjs().add(3, "day").format("YYYY-MM-DD")
      })
  );
  return isLoading ? (
    <>Loading...</>
  ) : (
    <>
      <Card
        sx={{
          background: "rgba(200, 200, 200, .3)",
          borderRadius: 5,
          boxShadow: 0,
          p: 1
        }}
      >
        <CardContent>
          <AirbnbSlider
            components={{ Thumb: AirbnbThumbComponent }}
            step={1}
            marks
            min={0}
            max={10}
            defaultValue={12}
          />
          {(
            data.transactions.filter((e) => (e.account_id = accountId))
          ).map(transaction => (
            <div>
              {dayjs(transaction.authorized_date).fromNow()}
            </div>
          ))}
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
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
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
        onOpen={() => setOpen(true)}
        open={open}
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100vh",
          justifyContent: "center"
        }}
        PaperProps={{
          sx: {
            borderRadius: 5,
            position: "unset",
            mx: "auto",
            // bottom: "50%",
            // transform: "translateY(50%)!important",
            maxWidth: "80vw",
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
          Goal set 5 months ago
          <Divider sx={{ my: 4 }} />
          <Button
            sx={{
              textTransform: "none",
              mr: 1,
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
              borderRadius: 5
            }}
            disableElevation
            variant="outlined"
            size="large"
          >
            Remove goal
          </Button>
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
        <Typography variant="h5" sx={{ fontWeight: "600", mt: 5 }}>
          Streak
        </Typography>
        <ZeroExpenseStreak accountId={account.account_id} />
      </Box>
    </>
  );
}
