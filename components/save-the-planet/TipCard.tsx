import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import { green, orange } from "@mui/material/colors";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import toast from "react-hot-toast";
import useSWR from "swr";

function CreateGoalDialog({
  moneyRequiredForGoal,
  data,
  error,
}: {
  data: any;
  error: any;
  moneyRequiredForGoal: number;
}): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: 5,
            minWidth: "400px",
            maxWidth: "calc(100vw - 20px)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "800" }}>Select an account</DialogTitle>
        <DialogContent>
          {error && "An error occured while fetching your accounts"}
          {data ? JSON.stringify(data) : "Loading..."}
        </DialogContent>
      </Dialog>

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

function Badge({ tipOfTheDay, highlySuggested }: any) {
  return (
    <>
      {tipOfTheDay && (
        <div
          className="badge"
          style={{
            fontSize: "13px",
            display: "inline-flex",
            alignItems: "center",
            position: "absolute",
            top: "15px",
            right: "15px",
            justifyContent: "center",
            gap: "10px",
            background: green["A700"],
            color: "white",
            borderRadius: "99px",
            fontWeight: "500",
            padding: "3px 10px",
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "14px", color: "white" }}
          >
            tips_and_updates
          </span>{" "}
          Tip of the day
        </div>
      )}
      {highlySuggested && (
        <div
          className="badge"
          style={{
            fontSize: "13px",
            display: "inline-flex",
            alignItems: "center",
            position: "absolute",
            top: "15px",
            right: "15px",
            justifyContent: "center",
            gap: "10px",
            background: orange["A700"],
            color: "white",
            borderRadius: "99px",
            fontWeight: "500",
            padding: "3px 10px",
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "14px", color: "white" }}
          >
            auto_awesome
          </span>{" "}
          Highly suggested
        </div>
      )}
    </>
  );
}

export function TipCard({
  name,
  modalContent,
  funFact,
  tipOfTheDay = false,
  highlySuggested = false,
  moneyRequiredForGoal = 100,
  icon = "lightbulb",
}: any) {
  const [open, setOpen] = useState(false);
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
                <CreateGoalDialog
                  data={data}
                  error={error}
                  moneyRequiredForGoal={moneyRequiredForGoal}
                />
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
            color: global.theme === "dark" ? "#eee" : "#101010",
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
          transition: "color .2s",
          "&:active": {
            opacity: 1,
            "& .badge": {
              filter: "brightness(90%)",
            },
            background: tipOfTheDay
              ? global.theme === "dark"
                ? green["A400"]
                : green["A200"]
              : highlySuggested
              ? global.theme === "dark"
                ? orange["A700"]
                : orange["A200"]
              : "rgba(200,200,200,.5)",
            "& *": {
              opacity: 1,
              color: global.theme === "dark" ? "#fff" : "#000",
            },
          },
          textTransform: "none",
          borderRadius: 5,
        }}
      />
    </>
  );
}
