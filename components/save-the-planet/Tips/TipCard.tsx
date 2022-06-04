import Box from "@mui/material/Box";
import { green, orange } from "@mui/material/colors";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import useSWR from "swr";
import { Badge } from "./Badge";
import { CreateGoalDialog } from "./CreateGoalDialog";
import * as colors from "@mui/material/colors";

export type Account = {
  account_id: string;
  balances: {
    available: any;
    current: number;
    iso_currency_code: string;
    limit: number;
    unofficial_currency_code: any;
  };
  mask: string;
  name: string;
  official_name: string;
  subtype: string;
  type: string;
};

export function TipCard({
  name,
  funFact,
  tipOfTheDay = false,
  highlySuggested = false,
  moneyRequiredForGoal = 100,
  icon = "lightbulb",
}: any) {
  const [open, setOpen] = useState<boolean>(false);
  const { error, data } = useSWR(
    "/api/finance/accounts?access_token=" + global.session.user.financeToken,
    () =>
      fetch(
        "/api/finance/accounts?access_token=" + global.session.user.financeToken
      ).then((res) => res.json())
  );

  return (
    <>
      <Tab
        onClick={() => setOpen(true)}
        icon={
          <>
            <Badge
              tipOfTheDay={tipOfTheDay}
              highlySuggested={highlySuggested}
            />
            <Typography sx={{ float: "left", fontWeight: "800" }} variant="h6">
              <span
                className="material-symbols-rounded"
                style={{
                  fontSize: "28px",
                  display: "block",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                {icon}
              </span>
              {name}
            </Typography>
            <SwipeableDrawer
              anchor="bottom"
              swipeAreaWidth={0}
              onOpen={() => setOpen(true)}
              open={open}
              BackdropProps={{
                onClick() {
                  setTimeout(() => setOpen(false), 10);
                },
              }}
              sx={{
                display: "flex",
                alignItems: { xs: "end", sm: "center" },
                height: "100vh",
                justifyContent: "center",
              }}
              PaperProps={{
                sx: {
                  borderRadius: "28px",
                  borderBottomLeftRadius: { xs: 0, sm: "28px!important" },
                  borderBottomRightRadius: { xs: 0, sm: "28px!important" },
                  position: "unset",
                  mx: "auto",
                  maxWidth: { sm: "70vw", xs: "100vw" },
                  overflow: "hidden",
                },
              }}
              onClose={() => setOpen(false)}
            >
              <Box
                sx={{
                  p: 3,
                  py: 6,
                  px: 7,
                  borderRadius: 5,
                  mt: "-1px",
                  borderBottomLeftRadius: 0,
                  position: "relative",
                  borderBottomRightRadius: 0,
                }}
              >
                <Badge
                  tipOfTheDay={tipOfTheDay}
                  highlySuggested={highlySuggested}
                />
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: "600" }}
                >
                  {name}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {funFact}
                </Typography>
                {moneyRequiredForGoal !== 0 && (
                  <CreateGoalDialog
                    name={name}
                    data={data}
                    error={error}
                    moneyRequiredForGoal={moneyRequiredForGoal}
                  />
                )}
              </Box>
            </SwipeableDrawer>
          </>
        }
        label={
          <Typography
            variant="body2"
            sx={{
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {funFact}
          </Typography>
        }
        disableRipple
        sx={{
          mr: 1,
          px: 3,
          py: 1,
          pb: 2,
          textAlign: "left!important",
          alignItems: "start",
          width: "90vw",
          opacity: 1,
          "& *": {
            opacity: 1,
            color: global.theme === "dark" ? "#eee" : "hsl(240, 11%, 5%)",
          },
          background: tipOfTheDay
            ? global.theme === "dark"
              ? green["A400"]
              : green["A100"]
            : highlySuggested
            ? global.theme === "dark"
              ? orange["A400"]
              : orange["A100"]
            : "rgba(200,200,200,.3)",

          textTransform: "none",
          transition: "transform .2s",
          "&:active": {
            transform: "scale(.98)",
            opacity: 1,
            transition: "none",
            background: "rgba(200,200,200,.5)",
            "& *": {
              opacity: 1,
              color: global.theme === "dark" ? "#fff" : "#000",
            },
          },
          borderRadius: 5,
          "&:focus-within": {
            background: tipOfTheDay
              ? colors["green"]["200"] + "!important"
              : highlySuggested
              ? colors["orange"]["200"] + "!important"
              : colors[themeColor]["100"] + "!important",
            boxShadow:
              "inset 0px 0px 0px 2px " +
              colors[highlySuggested ? "orange" : themeColor]["800"],
            "& *": {
              opacity: 1,
              color: global.theme === "dark" ? "#fff" : "#000",
            },
          },
        }}
      />
    </>
  );
}
