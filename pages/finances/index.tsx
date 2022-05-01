import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import { red } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // import plugin
import { useState } from "react";
import useFetch from "react-fetch-hook";
import NoData from "../../components/finances/NoData";

dayjs.extend(relativeTime);

function TransactionCard({ transaction }: any) {
  return (
    <Card
      sx={{ background: "rgba(200,200,200,.3)", p: 1, borderRadius: 5, mb: 1 }}
    >
      <CardContent>
        {transaction.pending && (
          <Box sx={{ color: red[600], float: "right" }}>
            <Tooltip title="This transaction is pending. Make sure to pay your transactions before buying anything else!">
              <span className="material-symbols-rounded">warning</span>
            </Tooltip>
          </Box>
        )}

        <Typography gutterBottom variant="h6">
          {transaction.merchant_name ?? transaction.name}
        </Typography>
        <Typography gutterBottom>
          {dayjs(transaction.date).fromNow()} &bull; ${transaction.amount}
        </Typography>
        <Stack spacing={1} sx={{ mt: 1 }} direction="row">
          {transaction.category.map((category) => (
            <Chip label={category} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function Transactions({ account }: any) {
  const { isLoading, data }: any = useFetch(
    "/api/finance/fetchTransactions/?" +
      new URLSearchParams({
        access_token: global.session.user.financeToken,
        start_date: "2022-01-01",
        end_date: "2022-05-01"
      })
  );
  return (
    <>
      <Card
        sx={{
          my: 1,
          display: "flex",
          height: "300px",
          alignItems: "center",
          justifyContent: "center",
          background: isLoading
            ? "rgba(200,200,200,.3)"
            : "url(https://i.ibb.co/k4XFvhj/blurry-gradient-haikei.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          color: "white",
          borderRadius: 5
        }}
      >
        <CardContent sx={{ py: 5 }}>
          <Typography gutterBottom variant="h2" sx={{ textAlign: "center" }}>
            {isLoading ? (
              <Skeleton
                width={200}
                variant="rectangular"
                sx={{ display: "inline-block", borderRadius: 5 }}
                animation="wave"
                height={50}
              />
            ) : (
              "$" + account.balances.available
            )}
          </Typography>
          {isLoading ? (
            <Skeleton
              width={200}
              variant="rectangular"
              sx={{ display: "inline-block", borderRadius: 5 }}
              animation="wave"
            />
          ) : (
            <Typography sx={{ textAlign: "center" }} variant="h6">
              Available balance
            </Typography>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <>
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
          <Alert severity="error" sx={{ borderRadius: 5, mb: 1 }}>
            Oh no! Your budget is over! Try not to spend as little money as
            possible
          </Alert>
          <Alert severity="info" sx={{ borderRadius: 5, mb: 1 }}>
            Today's a weekend, your budget is lenient!
          </Alert>
        </>
      )}

      <Card>
        <CardContent>
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              {data.transactions.map((transaction) => (
                <TransactionCard transaction={transaction} />
              ))}
            </>
          )}
        </CardContent>
      </Card>
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
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function AccountList() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { isLoading, data }: any = useFetch(
    "/api/finance/accounts/?" +
      new URLSearchParams({
        access_token: global.session.user.financeToken
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
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        centered
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{
          "& .MuiTabs-scrollButtons.Mui-disabled": {
            opacity: {
              xs: 0.3,
              lg: data.accounts.length > 4 ? 0.3 : 0
            },
            display: {
              xs: data.accounts.length > 1 ? "" : "none",
              sm: data.accounts.length > 4 ? "" : "none"
            }
          },
          "& .MuiTabs-scrollButtons": {
            borderRadius: 5,
            borderLeft: "4px solid #fff",
            borderRight: "4px solid #fff"
          },
          "& .MuiTabs-scroller": { borderRadius: 5 },

          maxWidth: "90vw",
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
          <Tooltip title={account.official_name} enterDelay={500}>
            <Tab
              icon={
                <Typography sx={{ float: "left" }}>{account.name}</Typography>
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ textTransform: "capitalize", fontSize: "12px" }}
                >
                  &bull;&bull;&bull; &bull;&bull;&bull; &bull;&bull;&bull;{" "}
                  {account.mask} &bull; {account.type}
                </Typography>
              }
              disableRipple
              sx={{
                mr: 1,
                px: 8,
                background: "rgba(200,200,200,.2)",
                transition: "color .2s",
                "&.Mui-selected": {
                  background: "rgba(200,200,200,.2)!important"
                },
                "&:active": { background: "rgba(200,200,200,.3)" },
                textTransform: "none",
                borderRadius: 5
              }}
            />
          </Tooltip>
        ))}
      </Tabs>
      {data.accounts.map((account, index) => (
        <TabPanel value={value} index={index}>
          <Transactions account={account} />
        </TabPanel>
      ))}
    </>
  );
}

export function RenderFinances() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Collapse in={open} sx={{ borderRadius: 5 }}>
        <Alert
          severity="error"
          variant="filled"
          sx={{ borderRadius: 5 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          The data below is for currently for demo purposes. A production-ready
          finance page will be available soon!
        </Alert>
      </Collapse>
      <AccountList />
    </>
  );
}
export default function Finances() {
  return (
    <Box sx={{ p: 3 }}>
      {global.session &&
      (global.session.user.financeToken === "" ||
        !global.session.user.financeToken.startsWith("access-sandbox-")) ? (
        <>
          <Typography variant="h5">Finances</Typography>
          <NoData />
        </>
      ) : (
        <RenderFinances />
      )}
    </Box>
  );
}
