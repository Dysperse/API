import Grid from "@mui/material/Grid";
import { TransactionCard } from "./TransactionCard";
import { Liabilities } from "./Liabilities";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import useFetch from "react-fetch-hook";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import dayjs from "dayjs";

export function AccountData({ account }: any) {
  const { isLoading, data }: any = useFetch(
    "/api/finance/fetchTransactions/?" +
      new URLSearchParams({
        access_token: global.session.user.financeToken,
        start_date: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
        end_date: dayjs().add(7, "day").format("YYYY-MM-DD")
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
          <Typography
            gutterBottom
            variant="h2"
            sx={{ textAlign: "center", fontWeight: "700" }}
          >
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
          {/* <Alert severity="error" sx={{ borderRadius: 5, mb: 1 }}>
            Oh no! Your budget is over! Try not to spend as little money as
            possible
          </Alert> */}
          {/* <Alert severity="info" sx={{ borderRadius: 5, mb: 1 }}>
            Today's a weekend, your budget is lenient!
          </Alert> */}
        </>
      )}
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          {!isLoading ? (
            <Typography sx={{ mt: 2, mb: 3, fontWeight: "500" }} variant="h5">
              Recent transactions
            </Typography>
          ) : (
            <Skeleton
              width={"auto"}
              variant="rectangular"
              animation="wave"
              height={20}
              sx={{
                borderRadius: 5,
                mt: 2,
                mb: 3
              }}
            />
          )}
          {isLoading ? (
            <>
              {[...new Array(5)].map((_) => (
                <Skeleton
                  animation="wave"
                  width={"auto"}
                  variant="rectangular"
                  sx={{ borderRadius: 5, mb: 2 }}
                  height={100}
                />
              ))}
            </>
          ) : (
            <>
              {data.transactions.map((transaction) => (
                <TransactionCard transaction={transaction} />
              ))}
              {data.transactions.length === 0 && (
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
                    <Typography variant="h5" gutterBottom>
                      Impressive!
                    </Typography>
                    <Typography variant="body2">
                      You haven't made any recent transactions. Great job!
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </Grid>
        <Grid item sm={6} xs={12}>
          {!isLoading ? (
            <>
              <Typography sx={{ mt: 2, mb: 3, fontWeight: "500" }} variant="h5">
                Debt
              </Typography>
              <Liabilities />
            </>
          ) : (
            <Skeleton
              width={200}
              variant="rectangular"
              animation="wave"
              height={20}
              sx={{ borderRadius: 5, mt: 2, mb: 3 }}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
