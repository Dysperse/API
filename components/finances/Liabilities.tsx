import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import CardContent from "@mui/material/CardContent";
import useFetch from "react-fetch-hook";

export function Liabilities() {
  const { isLoading, data }: any = useFetch(
    "/api/finance/liabilities/?" +
      new URLSearchParams({
        access_token: global.session.user.financeToken
      })
  );
  return isLoading ? (
    <Skeleton
      variant="rectangular"
      animation="wave"
      height={50}
      sx={{ borderRadius: 5, my: 2 }}
    />
  ) : (
    <>
      {data.error_code === "NO_LIABILITY_ACCOUNTS" && (
        <Box>
          <Card
            sx={{
              background: "rgba(200,200,200,.3)",
              p: 1,
              borderRadius: 5,
              mt: 2,
              mb: 1,
              textAlign: "center"
            }}
          >
            <CardContent>
              <Typography>
                Your bank either didn't give us permission to view your
                liabilities or doesn't support liabilities{" "}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
}
