import { useState } from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { AccountData } from "./AccountData";
import useFetch from "react-fetch-hook";

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
      {data.error_code !== "PRODUCT_NOT_READY" ? (
        <>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
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
                  // sm: data.accounts.length > 4 ? "" : "none"
                }
              },
              "& .MuiTabs-scrollButtons": {
                borderRadius: 5,
                background: "#eee!important",
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
                    <Typography sx={{ float: "left" }} variant="h6">
                      {account.name}
                    </Typography>
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
                    py: 3,
                    width: { sm: "40vw" },
                    maxWidth: { sm: "40vw" },
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
              <AccountData account={account} />
            </TabPanel>
          ))}
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
