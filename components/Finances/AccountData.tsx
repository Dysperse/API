import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";

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

function Navbar({ scrollTop, container }: any) {
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
          p: 0.5
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <span className="material-symbols-rounded">chevron_left</span>
          </IconButton>
          <Typography sx={{ flexGrow: 1, textAlign: "center" }} component="div">
            Overview
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: -1 }}
          >
            <span className="material-symbols-rounded">more_horiz</span>
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
}

function Goal({ name, image }: { name: string; image: string }) {
  return (
    <Card
      sx={{
        background:
          "linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(" +
          image +
          ")",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        borderRadius: 5,
        p: 1,
        mt: 2,
        color: "white"
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
            background: "rgba(200,200,200,.4)",
            "& *": { borderRadius: 99, background: "#fff" }
          }}
          value={69}
        />
      </CardContent>
    </Card>
  );
}

export function AccountData({ scrollTop, account }: any) {
  return (
    <>
      <Navbar scrollTop={scrollTop} />
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
      </Box>
    </>
  );
}
