import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { currency_symbols } from "./AccountList";

export function TransactionList({ transactions }: any) {
  return (
    <>
      <List
        sx={{
          background:
            global.theme === "dark"
              ? "hsl(240, 11%, 13%)"
              : "rgba(200,200,200,.3)",
          p: 2,
          mt: 2,
          borderRadius: 5,
        }}
      >
        <Typography sx={{ fontWeight: "600", my: 2, ml: 2 }} variant="h5">
          Recent transactions
        </Typography>
        {transactions.slice(0, 10).map((transaction: any, id: number) => (
          <ListItem
            key={id.toString()}
            sx={{
              borderBottom:
                "1px solid " +
                (global.theme === "dark"
                  ? "hsl(240, 11%, 17%)"
                  : "rgba(200,200,200,.2)"),
              "&:hover": {
                borderRadius: 2,
                borderBottom: "1px solid transparent",
                background:
                  global.theme === "dark"
                    ? "hsl(240, 11%, 15%)"
                    : "rgba(200,200,200,.3)",
              },
              px: 3,
              py: 2,
              mt: "-5px",
            }}
          >
            <ListItemText
              primary={<Typography>{transaction.name}</Typography>}
              secondary={
                <>
                  <Typography gutterBottom>
                    {dayjs(transaction.date).fromNow()} &bull;{" "}
                    {currency_symbols[transaction.iso_currency_code] ?? "$"}
                    {transaction.amount}
                  </Typography>
                  {transaction.category.map((category: any, id: number) => (
                    <Chip
                      key={id.toString()}
                      label={category}
                      sx={{ mr: 1, mt: 1, borderRadius: 3 }}
                    />
                  ))}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}
