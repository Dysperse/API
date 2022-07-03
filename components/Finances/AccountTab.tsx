import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { AccountData } from "./AccountData";
import { currency_symbols } from "./AccountList";
import * as colors from "@mui/material/colors";

export function AccountTab({ account }: any) {
  const [open, setOpen] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState<number>(0);
  useEffect(() => {
    document.documentElement
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        open
          ? scrollTop > 300
            ? "#091f1e"
            : "#2b5511"
          : global.theme === "dark"
          ? "hsl(240, 11%, 10%)"
          : "#fff"
      );
  }, [open, scrollTop]);
  return (
    <>
      <CssBaseline />
      <SwipeableDrawer
        onOpen={() => setOpen(true)}
        onClose={() => {
          setScrollTop(0);
          setOpen(false);
        }}
        open={open}
        anchor="right"
        PaperProps={{
          sx: {
            overscrollBehavior: "none",
            overflow: "hidden",
            borderRadius: { sm: "20px" },
            m: { sm: "15px" },
          },
        }}
        swipeAreaWidth={0}
      >
        <Box
          sx={{
            width: { xs: "100vw", sm: "50vw" },
            overflowY: "scroll",
            borderRadius: { sm: "20px" },
            height: { xs: "100vh", sm: "calc(100vh - 30px)" },
          }}
        >
          <Box
            onScroll={(e: any) => setScrollTop(e.target.scrollTop)}
            sx={{
              width: { xs: "100vw", sm: "50vw" },
              overflowY: "scroll",
              borderRadius: { sm: "20px" },
              height: { xs: "100vh", sm: "calc(100vh - 30px)" },
            }}
          >
            <AccountData
              setOpen={setOpen}
              scrollTop={scrollTop}
              account={account}
            />
          </Box>
        </Box>
      </SwipeableDrawer>
      <Tooltip title={account.official_name ?? account.name} enterDelay={500}>
        <Tab
          onClick={() => setOpen(true)}
          icon={
            <>
              <Typography
                sx={{
                  fontWeight: "600",
                  position: "absolute",
                  right: 1,
                  top: 0,
                  p: 2,
                }}
              >
                <span
                  style={{
                    position: "relative",
                    top: "3.3px",
                  }}
                >
                  ****
                </span>{" "}
                {account.mask}
              </Typography>
              <Typography
                sx={{ float: "left", fontWeight: "800" }}
                variant="h6"
              >
                {currency_symbols[account.iso_currency_code] ?? "$"}
                {account.balances.current}
              </Typography>
            </>
          }
          label={
            <Typography
              variant="body2"
              sx={{
                textTransform: "capitalize",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {account.name}
            </Typography>
          }
          disableRipple
          sx={{
            mr: 1,
            px: 3,
            py: 3,
            textAlign: "left!important",
            alignItems: "start",
            height: "130px",
            width: "90vw",
            opacity: 1,
            "& *": {
              opacity: 1,
              color: global.theme === "dark" ? "#eee" : "#505050",
            },
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 20%)"
                : "rgba(200,200,200,.3)",
            transition: "transform .2s",
            "&:focus-within": {
              background:
                colors[themeColor][global.theme === "dark" ? 900 : 100] +
                "!important",
              boxShadow: "inset 0px 0px 0px 2px " + colors[themeColor]["800"],
              "& *": {
                opacity: 1,
                color: global.theme === "dark" ? "#fff" : "#000",
              },
            },
            "&:hover": {
              opacity: 1,
              background:
                global.theme === "dark"
                  ? "hsl(240, 11%, 25%)"
                  : "rgba(200,200,200,.4)",
              "& *": {
                opacity: 1,
                color: global.theme === "dark" ? "#fff" : "hsl(240, 11%, 10%)",
              },
            },
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
            textTransform: "none",
            borderRadius: 5,
          }}
        />
      </Tooltip>
    </>
  );
}
