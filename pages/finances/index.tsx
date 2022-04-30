import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import NoData from "../../components/finances/NoData";
import { grey } from "@mui/material/colors";
import useFetch from "react-fetch-hook";

export function RenderFinances() {
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
      <Alert severity="error" variant="filled" sx={{ borderRadius: 5, mb: 1 }}>
        The data below is for currently for demo purposes. A production-ready
        finance page will be available soon!
      </Alert>
      <Card
        sx={{
          mb: 1,
          display: "flex",
          height: "350px",
          alignItems: "center",
          justifyContent: "center",
          background:
            "url(https://i.ibb.co/k4XFvhj/blurry-gradient-haikei.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          color: "white",
          borderRadius: 5
        }}
      >
        <CardContent sx={{ py: 5 }}>
          <Typography gutterBottom variant="h2" sx={{ textAlign: "center" }}>
            {isLoading ? "$123456" : "$0"}
          </Typography>
          <Typography sx={{ textAlign: "center" }} variant="h5">
            Budget left for this month
          </Typography>
        </CardContent>
      </Card>

      <Alert severity="error" sx={{ borderRadius: 5, mb: 1 }}>
        Oh no! Your budget is over! Try not to spend as little money as possible
      </Alert>
      <Alert severity="info" sx={{ borderRadius: 5, mb: 1 }}>
        Today's a weekend, your budget is lenient!
      </Alert>

      <Card>
        <CardContent>
          {isLoading ? "Loading..." : JSON.stringify(data, null, 3)}
        </CardContent>
      </Card>
    </>
  );
}
export default function Finances() {
  return (
    <Box sx={{ p: 3 }}>
      {global.session && global.session.user.financeToken === "" ? (
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
