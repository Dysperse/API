import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import useSWR from "swr";

export function Liabilities() {
  const url =
    "/api/finance/liabilities?" +
    new URLSearchParams({
      access_token: global.session.user.financeToken,
    });
  const { data, error } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

  if (error) return <div>failed to load</div>;
  if (!data)
    return (
      <>
        {[...new Array(10)].map((_: any, id: number) => (
          <Skeleton
            key={id.toString()}
            variant="rectangular"
            animation="wave"
            height={152}
            sx={{ mt: 2, borderRadius: 5 }}
          />
        ))}
      </>
    );
  return (
    <>
      {Object.keys(data.liabilities).map((liability: any, id: number) => (
        <Card
          key={id.toString()}
          sx={{
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 13%)"
                : "rgba(200,200,200,.4)",
            borderRadius: 5,
            mt: 2,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              sx={{ textTransform: "capitalize", fontWeight: "600" }}
              variant="h6"
            >
              {liability}
            </Typography>
            {data.liabilities[liability].map((loan: any, id: number) => {
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
                      "& *": {
                        borderRadius: 99,
                        background: global.theme === "dark" ? "#fff" : "#000",
                      },
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
                  key={id.toString()}
                  sx={{
                    px: 2,
                    mt: 1,
                    py: 1,
                    background: "rgba(200,200,200,0)",
                    borderRadius: 4,
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
      ))}
    </>
  );
}
