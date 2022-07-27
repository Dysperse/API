import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import toast from "react-hot-toast";
import { currency_symbols } from "../../Finances/AccountList";
import { Account } from "./TipCard";
import * as colors from "@mui/material/colors";
import { Puller } from "../../Puller";

export function CreateGoalDialog({
  name,
  moneyRequiredForGoal,
  data,
  error,
}: {
  name: string;
  data: any;
  error: any;
  moneyRequiredForGoal: number;
}): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        swipeAreaWidth={0}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
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
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 20%)",
            }),
          },
        }}
      >
        <Puller />
        <DialogTitle sx={{ fontWeight: "800", my: 2, textAlign: "center" }}>
          Select an account
        </DialogTitle>
        <DialogContent>
          {error && "An error occured while fetching your accounts"}
          {data ? (
            <>
              {data.accounts ? (
                data.accounts.map((account: Account, id: number) => (
                  <ListItem
                    key={id.toString()}
                    button
                    onClick={() => {
                      setOpen(false);
                      fetch(
                        "https://api.smartlist.tech/v2/finances/goals/create/",
                        {
                          method: "POST",
                          body: new URLSearchParams({
                            token: global.session && global.session.accessToken,
                            name: name,
                            image:
                              "https://images.unsplash.com/photo-1416169607655-0c2b3ce2e1cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774",
                            minAmountOfMoney: moneyRequiredForGoal.toString(),
                            accountId: account.account_id,
                          }),
                        }
                      )
                        .then((res) => res.json())
                        .then((res) => toast.success("Created goal!"));
                    }}
                    sx={{
                      mb: 1,
                      background: "rgba(200,200,200,.3)",
                      borderRadius: 3,
                      "&:hover": {
                        background: "rgba(200,200,200,.4)",
                      },
                      transition: "none",
                    }}
                  >
                    <ListItemText
                      primary={account.name}
                      secondary={
                        <>
                          {currency_symbols[
                            account.balances.iso_currency_code
                          ] ?? "$"}
                          {account.balances.current}
                        </>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem
                  sx={{
                    mb: 1,
                    background: "rgba(200,200,200,.3)",
                    borderRadius: 3,
                    "&:hover": {
                      background: "rgba(200,200,200,.4)",
                    },
                    transition: "none",
                  }}
                >
                  <ListItemText
                    primary={"No accounts found"}
                    secondary={
                      <>
                        Connect your bank account with Carbon to set financial
                        goals
                      </>
                    }
                  />
                </ListItem>
              )}
            </>
          ) : (
            "Loading..."
          )}
        </DialogContent>
      </SwipeableDrawer>

      <Button
        variant="contained"
        disabled={error || !data}
        sx={{ boxShadow: 0, borderRadius: 9, mt: 1, px: 6 }}
        size="large"
        onClick={() => setOpen(true)}
      >
        Add to my goals
      </Button>
    </>
  );
}
