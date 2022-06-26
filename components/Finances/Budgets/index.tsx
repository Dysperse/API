import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Budget } from "./Budget";
import dayjs from "dayjs";

export function Budgets({ transactions }: { transactions: any }) {
  const spentToday = transactions
    .filter(
      (transaction: any) => transaction.date == dayjs().format("YYYY-MM-DD")
    )
    .map((transaction: any) => transaction.amount)
    .reduce((a: any, b: any) => a + b, 0);

  const spentMonth = transactions
    .filter(
      (transaction: any) =>
        dayjs(transaction.date).month() === new Date().getMonth() &&
        dayjs(transaction.date).year() === new Date().getFullYear()
    )
    .map((transaction: any) => transaction.amount)
    .reduce((a: any, b: any) => a + b, 0);

  return (
    <>
      <Card
        sx={{
          background:
            global.theme === "dark"
              ? "hsl(240, 11%, 13%)"
              : "rgba(200, 200, 200, .3)",
          borderRadius: 5,
          boxShadow: 0,
          p: 1,
          mt: 2,
        }}
      >
        <Typography
          sx={{ fontWeight: "600", my: 2, ml: 2, mb: 0 }}
          variant="h5"
        >
          Budgets
        </Typography>
        <CardContent>
          <Typography
            sx={{ mt: -1, fontSize: "13px", textTransform: "uppercase" }}
          >
            This month
          </Typography>
          <Budget category="Food and Drink" amount="1000" type="monthly" />
          <Budget category="Sporting Goods" amount="500" type="monthly" />

          <Typography
            sx={{ mt: 1, fontSize: "13px", textTransform: "uppercase" }}
          >
            Hard limits
          </Typography>
          <Budget
            hardLimit={true}
            category="Today"
            amount={global.session.user.budgetDaily}
            type="daily"
          />
          <Budget
            hardLimit={true}
            category="This week"
            amount={global.session.user.budgetWeekly}
            type="weekly"
          />
          <Budget
            hardLimit={true}
            category="This month"
            amountSpent={spentMonth}
            amount={global.session.user.budgetMonthly}
            type="monthly"
          />
        </CardContent>
      </Card>
    </>
  );
}
