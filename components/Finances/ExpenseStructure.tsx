import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function ExpenseStructure({ transactions }: any) {
  let categories: Array<string> = [];
  let money: Array<number> = [];
  transactions.forEach((transaction: any) => {
    transaction.category.forEach((category: string) =>
      categories.push(category)
    );
  });

  [...new Set(categories)].forEach((category: string) => {
    let filtered = transactions.filter((transaction: any) =>
      transaction.category.includes(category)
    );
    let moneyByCategory = filtered.map(
      (transaction: any) => transaction.amount
    );
    moneyByCategory = moneyByCategory.reduce(
      (partialSum: any, a: any) => partialSum + a,
      0
    );
    money.push(moneyByCategory);
  });

  return (
    <Card
      sx={{
        background:
          global.theme === "dark"
            ? "hsl(240, 11%, 13%)"
            : "rgb(200, 200, 200, .3)",
        borderRadius: 5,
        boxShadow: 0,
        p: 1,
        mt: 2,
      }}
    >
      <Typography sx={{ fontWeight: "600", my: 2, ml: 2, mb: 0 }} variant="h5">
        Expense Structure
      </Typography>
      <CardContent
        sx={{
          p: 0,
          height: 520,
          maxWidth: "calc(100vw - 100px)",
          margin: "auto",
        }}
      >
        <Pie
          options={{
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 40,
              },
            },
            animation: {
              duration: 0,
            },
            plugins: {
              tooltip: {
                cornerRadius: 10,
                caretSize: 0,
                backgroundColor:
                  global.theme === "dark"
                    ? "hsl(240, 11%, 93%)"
                    : "hsl(240, 11%, 20%)",
                bodyColor: global.theme === "dark" ? "#000" : "#fff",
                boxPadding: 10,
                usePointStyle: true,
                padding: 10,
              },
              legend: {
                labels: {
                  padding: 19,
                  pointStyle: "rectRounded",
                  usePointStyle: true,
                },
                reverse: true,
                position: "bottom",
              },
            },
          }}
          data={{
            labels: [...new Set(categories)],
            datasets: [
              {
                label: "# of Votes",
                data: [...money],
                backgroundColor: [
                  "#d50000",
                  "#c51162",
                  "#ff9100",
                  "#2979ff",
                  "#aa00ff",
                  "#6200ea",
                  "#c6ff00",
                  "#304ffe",
                  "#00e5ff",
                  "#1de9b6",
                  "#76ff03",
                  "#ff3d00",
                  "#78909c",
                  "#651fff",
                ],
                borderWidth: 0,
              },
            ],
          }}
        />
      </CardContent>
    </Card>
  );
}
