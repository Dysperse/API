import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import useFetch from "react-fetch-hook";
import { Goal } from "./Goal";
import { CreateGoalMenu } from "./CreateGoalMenu";
import { AccountHeader } from "./AccountHeader";
import { ZeroExpenseStreak } from "./ZeroExpenseStreak";

function Navbar({ setOpen, scrollTop, container, account }: any) {
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
          <CreateGoalMenu scrollTop={scrollTop} account={account} />
        </Toolbar>
      </AppBar>
    </>
  );
}

export function AccountData({ setOpen, scrollTop, account }: any) {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/finances/goals/",
    {
      method: "POST",
      body: new URLSearchParams({
        token: global.session.accessToken,
        accountId: account.account_id
      })
    }
  );
  return (
    <>
      <Navbar setOpen={setOpen} scrollTop={scrollTop} account={account} />
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
        {isLoading ? (
          <>
            {[...new Array(10)].map(() => (
              <Skeleton
                variant="rectangular"
                height={150}
                sx={{ borderRadius: 4, mt: 2 }}
                animation="wave"
              />
            ))}
          </>
        ) : (
          <>
            {data.data.length === 0 && (
              <Box
                sx={{
                  borderRadius: 4,
                  mt: 2,
                  p: 3,
                  background: "rgba(200,200,200,.3)"
                }}
              >
                You haven't set any goals yet.
              </Box>
            )}
            {data.data.map((goal: any) => (
              <Goal
                scrollTop={scrollTop}
                id={goal.id}
                image={goal.image}
                name={goal.name}
                note={goal.note}
                balance={account.balances.current}
                minAmountOfMoney={goal.minAmountOfMoney}
              />
            ))}
          </>
        )}
      </Box>
    </>
  );
}
