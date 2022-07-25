import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { currency_symbols } from "../AccountList";

export function AccountHeader({
  balance,
  currency,
}: {
  balance: number;
  currency: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "60vh",
        alignItems: "center",
        borderRadius: { sm: "20px" },
        borderBottomLeftRadius: "0!important",
        borderBottomRightRadius: "0!important",
        justifyContent: "center",
        color: "white",
        background: "url(/image.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Typography gutterBottom variant="h2" sx={{ fontWeight: "700", mt: 5 }}>
          {currency_symbols[currency]}
          {balance}
        </Typography>
        <Typography variant="h6">Current balance</Typography>
      </div>
    </Box>
  );
}
