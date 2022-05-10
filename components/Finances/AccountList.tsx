import { useState } from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { AccountData } from "./AccountData";
import useFetch from "react-fetch-hook";
import dayjs from "dayjs";
import { Liabilities } from "./Liabilities";

const currency_symbols = {
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
  VND: "₫" // Vietnamese Dong
};

function AccountTab({ account }: any) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SwipeableDrawer
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        open={open}
        anchor="right"
        PaperProps={{
          sx: {
            background: "#fff",
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
            height: { xs: "100vh", sm: "calc(100vh - 30px)" }
          }}
        >
          <AccountData account={account} />
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

function TransactionList({ transactions }: any) {
  return (
    <>
      <Typography sx={{ fontWeight: "600", my: 1, mt: 4 }} variant="h5">
        Recent transactions
      </Typography>
      {/* {JSON.stringify(transactions)} */}
      {transactions.map((transaction) => (
        <ListItem
          sx={{
            background: "rgba(200,200,200,.3)",
            mt: 2,
            borderRadius: 5,
            p: 3
          }}
        >
          <ListItemText
            primary={<Typography variant="h6">{transaction.name}</Typography>}
            secondary={
              <>
                <Typography gutterBottom>
                  {dayjs(transaction.date).fromNow()} &bull;{" "}
                  {currency_symbols[transaction.iso_currency_code] ?? "$"}
                  {transaction.amount}
                </Typography>
                {transaction.category.map((category) => (
                  <Chip label={category} sx={{ mr: 1, mt: 0.3 }} />
                ))}
              </>
            }
          />
        </ListItem>
      ))}
    </>
  );
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

export function AccountList() {
  const [value, setValue] = useState(-1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { isLoading, data }: any = useFetch(
    "/api/finance/fetchTransactions?" +
      new URLSearchParams({
        access_token: global.session.user.financeToken,
        start_date: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
        end_date: dayjs().add(7, "day").format("YYYY-MM-DD")
      })
  );
  return isLoading ? (
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
  ) : (
    <>
      {data.error_code !== "PRODUCT_NOT_READY" ? (
        <>
          <Tabs
            centered
            variant="scrollable"
            scrollButtons
            sx={{
              "& .MuiTabs-scrollButtons.Mui-disabled": {
                opacity: {
                  xs: 0.3,
                  lg: data.accounts.length > 4 ? 0.3 : 0
                },
                display: {
                  xs: "none !important"
                }
              },
              "& .MuiTabs-scrollButtons": {
                borderRadius: 5,
                background: "#eee!important",
                marginLeft: "5px",
                marginRight: "5px"
              },
              "& .MuiTabs-scroller": { borderRadius: 5 },

              maxWidth: "91vw",
              my: 2,
              "& .MuiTabs-indicator": {
                borderRadius: 5,
                height: "100%",
                background: "rgba(200,200,200,.4)",
                zIndex: -1
              },
              "& .Mui-selected": {
                color: global.theme === "dark" ? "#fff" : "#000!important"
              }
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
