import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";
import useFetch from "react-fetch-hook";
import dayjs from "dayjs";

export function Liabilities() {
  const { isLoading, data }: any = useFetch(
    "/api/finance/liabilities?" +
      new URLSearchParams({
        access_token: global.session.user.financeToken
      })
  );

  return (
    <>
      <Typography sx={{ fontWeight: "600", ml: 1, my: 1, mt: 4 }} variant="h5">
        Debt
      </Typography>
      {isLoading ? (
        <>
          {[...new Array(10)].map(() => (
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={152}
              sx={{ mt: 2, borderRadius: 5 }}
            />
          ))}
        </>
      ) : (
        Object.keys(data.liabilities).map((liability) => (
          <Card
            sx={{
              background: "rgba(200,200,200,.4)",
              borderRadius: 5,
              mt: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                sx={{ textTransform: "capitalize", fontWeight: "600" }}
                variant="h6"
              >
                {liability}
              </Typography>
              {data.liabilities[liability].map((loan) => {
                let secondary = (
                  <>
                    {Math.round(
                      loan.ytd_interest_paid / loan.origination_principal_amount
                    )}
                    % paid
                    <LinearProgress
                      variant="determinate"
                      sx={{
                        mt: 2,
                        borderRadius: 99,
                        height: 2,
                        background: "rgba(200,200,200,.4)",
                        "& *": { borderRadius: 99, background: "#000" }
                      }}
                      value={
                        (loan.ytd_interest_paid /
                          loan.origination_principal_amount) *
                        100
                      }
                    />
                  </>
                );
                if (liability === "credit") {
                  secondary = (
                    <>
                      {(dayjs(loan.next_payment_due_date).isBefore(new Date())
                        ? "Last payment due "
                        : "Next payment due ") +
                        dayjs(loan.next_payment_due_date).fromNow()}
                    </>
                  );
                }
                return (
                  <ListItem
                    sx={{
                      px: 2,
                      mt: 1,
                      py: 1,
                      background: "rgba(200,200,200,.3)",
                      borderRadius: 4
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography gutterBottom>
                          {loan.loan_name ?? loan.loan_term ?? "Credit"}
                        </Typography>
                      }
                      secondary={secondary}
                    />
                  </ListItem>
                );
              })}
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
}
