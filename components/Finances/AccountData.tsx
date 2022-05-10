import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import useScrollTrigger from "@mui/material/useScrollTrigger";

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
          transition: "backdrop-filter .2s",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          color: "#fff",
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
        <pre>{JSON.stringify(account, null, 2)}</pre>
      </Box>
    </>
  );
}
