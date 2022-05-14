import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import CardActionArea from "@mui/material/CardActionArea";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";

export function Goal({
  name, image, balance, minAmountOfMoney
}: {
  name: string;
  image: string;
  balance: number;
  minAmountOfMoney: number;
}): JSX.Element {
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
            maxWidth: { sm: "70vw", xs: "100vw" },
            overflow: "hidden"
          }
        }}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{
            p: 3,
            background: "linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(" +
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
          <Typography variant="h6">
            ${balance} / {minAmountOfMoney} raised
          </Typography>
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
            placeholder="Click to add note" />
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
            {/* <div style={{ marginLeft: "auto" }}>
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
            </div> */}
          </Box>
        </Box>
      </SwipeableDrawer>
      <Card
        sx={{
          background: "linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(" +
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
                "& *": { borderRadius: 99, background: "#fff!important" }
              }}
              value={balance > minAmountOfMoney
                ? 100
                : (balance / minAmountOfMoney) * 100} />
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
