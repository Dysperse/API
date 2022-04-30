import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NoData from "../../components/finances/NoData";
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
      <Typography variant="h5">Transactions</Typography>
      <pre>{isLoading ? "Loading..." : JSON.stringify(data, null, 3)}</pre>
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
