import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import React from "react";
import useSWR from "swr";
import { AccountTab } from "./AccountTab";
import { Liabilities } from "./Liabilities";
import { TransactionList } from "./TransactionList";

export const currency_symbols = {
  USD: "$", // US Dollar
  EUR: "€", // Euro
  CRC: "₡", // Costa Rican Colón
  GBP: "£", // British Pound Sterling
  ILS: "₪", // Israeli New Sheqel
  INR: "₹", // Indian Rupee
  JPY: "¥", // Japanese Yen
  KRW: "₩", // South Korean Won
  NGN: "₦", // Nigerian Naira
  PHP: "₱", // Philippine Peso
  PLN: "zł", // Polish Zloty
  PYG: "₲", // Paraguayan Guarani
  THB: "฿", // Thai Baht
  UAH: "₴", // Ukrainian Hryvnia
  VND: "₫",
};

export function AccountList() {
  const url =
    "/api/finance/fetchTransactions/?" +
    new URLSearchParams({
      access_token: global.session.user.financeToken,
      start_date: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
      end_date: dayjs().add(7, "day").format("YYYY-MM-DD"),
    });

  const { data, error } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

  if (error) return <div>failed to load</div>;
  if (!data)
    return (
      <>
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={100}
          sx={{ borderRadius: 5, my: 2 }}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={300}
          sx={{ borderRadius: 5, my: 2 }}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={50}
          sx={{ borderRadius: 5, my: 2 }}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={50}
          sx={{ borderRadius: 5, my: 2 }}
        />
      </>
    );

  return (
    <>
      {data.error_code !== "PRODUCT_NOT_READY" ? (
        <>
          <Typography
            sx={{ fontWeight: "600", my: 1, mt: 4, ml: 1 }}
            variant="h5"
          >
            Accounts
          </Typography>
          <Tabs
            centered
            variant="scrollable"
            scrollButtons
            sx={{
              "& .MuiTabs-scrollButtons.Mui-disabled": {
                // opacity: "0!important",
                maxWidth: "0px!important",
                margin: "0",
              },
              "& .MuiTabs-scrollButtons": {
                maxWidth: "100px",
                overflow: "hidden",
                transition: "all .2s",
                borderRadius: 4,
                background: "rgba(200,200,200,.4)",
                color: "#404040",
                "&:hover": {
                  background: "rgba(200,200,200,.5)",
                  color: "#000",
                },
                marginLeft: "5px",
                marginRight: "5px",
              },
              "& .MuiTabs-scroller": { borderRadius: 5 },

              maxWidth: "91vw",
              my: 2,
              "& .MuiTabs-indicator": {
                borderRadius: 5,
                height: "100%",
                background: "rgba(200,200,200,.4)",
                zIndex: -1,
              },
              "& .Mui-selected": {
                color: global.theme === "dark" ? "#fff" : "#000!important",
              },
            }}
          >
            {data.accounts.map((account) => (
              <AccountTab account={account} />
            ))}
          </Tabs>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TransactionList transactions={data.transactions} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                sx={{ fontWeight: "600", ml: 1, my: 1, mt: 4 }}
                variant="h5"
              >
                Debt
              </Typography>
              <Liabilities />
            </Grid>
          </Grid>
        </>
      ) : (
        <Box sx={{ textAlign: "center", p: 5 }}>
          <Card
            sx={{ py: 5, background: "rgba(200,200,200,.4)", borderRadius: 5 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                We're getting your finance dashboard ready...
              </Typography>
              <Typography gutterBottom>
                Check back in a few minutes, and we'll get your dashboard ready
              </Typography>
              <Typography variant="body2">
                Having problems? Email us at hello@smartlist.tech
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
}
