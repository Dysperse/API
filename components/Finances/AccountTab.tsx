import React, { useState, useEffect } from "react";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { AccountData } from "./AccountData";
import CssBaseline from "@mui/material/CssBaseline";
import { currency_symbols } from "./AccountList";

export function AccountTab({ account }: any) {
  const [open, setOpen] = useState(false);
  const [scrollTop, setScrollTop] = useState<number>(0);
  useEffect(() => {
    document.documentElement
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        open ? (scrollTop > 300 ? "#091f1e" : "#2b5511") : "#fff"
      );
  });
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
            m: { sm: "15px" }
          }
        }}
        swipeAreaWidth={0}
      >
        <Box
          sx={{
            width: { xs: "100vw", sm: "50vw" },
            overflowY: "scroll",
            borderRadius: { sm: "20px" },
            height: { xs: "100vh", sm: "calc(100vh - 30px)" }
          }}
        >
          <Box
            onScroll={(e: any) => setScrollTop(e.target.scrollTop)}
            sx={{
              width: { xs: "100vw", sm: "50vw" },
              overflowY: "scroll",
              borderRadius: { sm: "20px" },
              height: { xs: "100vh", sm: "calc(100vh - 30px)" }
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
      <Tooltip title={account.official_name} enterDelay={500}>
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
                  p: 1
                }}
              >
                <span
                  style={{
                    position: "relative",
                    top: "3.3px"
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
              sx={{ textTransform: "capitalize", fontSize: "12px" }}
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
            background: "rgba(200,200,200,.2)",
            transition: "color .2s",
            "&.Mui-selected": {
              background: "rgba(200,200,200,.2)!important"
            },
            "&:hover": { background: "rgba(200,200,200,.3)" },
            "&:active": { background: "rgba(200,200,200,.4)" },
            textTransform: "none",
            borderRadius: 5
          }}
        />
      </Tooltip>
    </>
  );
}
