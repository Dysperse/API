import React from "react";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";
import { currency_symbols } from "./AccountList";

export function TransactionList({ transactions }: any) {
  return (
    <>
      <Typography sx={{ fontWeight: "600", my: 1, mt: 4, ml: 1 }} variant="h5">
        Recent transactions
      </Typography>
      {transactions.map((transaction) => (
        <ListItem
          sx={{
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 20%)"
                : "rgba(200,200,200,.3)",
            mt: 2,
            borderRadius: 5,
            p: 3,
            px: 4,
          }}
        >
          <ListItemText
            primary={<Typography variant="h6">{transaction.name}</Typography>}
            secondary={
              <>
                <Typography gutterBottom>
                  {dayjs(transaction.date).fromNow()} &bull;{" "}
                  {currency_symbols[transaction.iso_currency_code] ?? "$"}
                  {transaction.amount}
                </Typography>
                {transaction.category.map((category) => (
                  <Chip
                    label={category}
                    sx={{ mr: 1, mt: 1, borderRadius: 3 }}
                  />
                ))}
              </>
            }
          />
        </ListItem>
      ))}
    </>
  );
}
