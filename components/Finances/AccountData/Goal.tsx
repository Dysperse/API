import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

export function Goal({
  scrollTop,
  id,
  name,
  image,
  balance,
  note,
  minAmountOfMoney,
}: {
  scrollTop: number;
  id: number;
  name: string;
  image: string;
  balance: number;
  note: string;
  minAmountOfMoney: number;
}): JSX.Element {
  const [noteContent, setNote] = useState<string>(note);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  React.useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        open ? (scrollTop > 300 ? "#05100f" : "#0f200b") : "#091f1e"
      );
  });
  return deleted ? (
    <></>
  ) : (
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
            backgroundRepeat: "no-repeat",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "600" }}>
            {name}
          </Typography>
          <Typography variant="h6">
            ${balance} / {minAmountOfMoney} raised
          </Typography>
        </Box>
        <Box sx={{ p: 5 }}>
          <TextField
            multiline
            fullWidth
            defaultValue={noteContent}
            onBlur={(e) => {
              setNote(e.target.value);
              fetch("https://api.smartlist.tech/v2/finances/goals/editNote/", {
                method: "POST",
                body: new URLSearchParams({
                  token: global.session.account.accessToken,
                  id: id.toString(),
                  note: e.target.value,
                }),
              });
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
                borderRadius: "15px",
              },
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
                onClick={() => {
                  alert(id);
                }}
                sx={{
                  textTransform: "none",
                  mr: 1,
                  mb: 1,
                  borderRadius: 5,
                }}
                disableElevation
                variant="contained"
                size="large"
              >
                Mark as done
              </Button>
              <LoadingButton
                sx={{
                  textTransform: "none",
                  mb: 1,
                  borderRadius: 5,
                }}
                disableElevation
                loading={loading}
                variant="outlined"
                onClick={() => {
                  setLoading(true);
                  fetch(
                    "https://api.smartlist.tech/v2/finances/goals/delete/",
                    {
                      method: "POST",
                      body: new URLSearchParams({
                        token: global.session.property.propertyToken,
                        id: id.toString(),
                      }),
                    }
                  )
                    .then((res) => res.json())
                    .then((res) => {
                      setLoading(false);
                      setOpen(false);
                      setDeleted(true);
                    });
                }}
                size="large"
              >
                Remove goal
              </LoadingButton>
            </div>
            {/* <div style={{ marginLeft: "auto" }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  display: { xs: "none", sm: "block" },
                  color: "#505050"
                }}
              >
                Goal set 10 years ago
              </Typography>
            </div> */}
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
          color: "white",
        }}
      >
        <CardActionArea
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 5,
            p: 1,
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "600" }}>
              {name}
            </Typography>
            <Typography>
              ${balance} / {minAmountOfMoney} raised
            </Typography>
            <LinearProgress
              variant="determinate"
              sx={{
                mt: 2,
                borderRadius: 99,
                height: 2,
                background: "rgba(200,200,200,.4)!important",
                "& *": { borderRadius: 99, background: "#fff!important" },
              }}
              value={
                balance > minAmountOfMoney
                  ? 100
                  : (balance / minAmountOfMoney) * 100
              }
            />
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
