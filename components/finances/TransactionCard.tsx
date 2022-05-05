import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { red } from "@mui/material/colors";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

export function TransactionCard({ transaction }: any) {
  return (
    <Card
      sx={{ background: "rgba(200,200,200,.3)", p: 1, borderRadius: 5, mb: 1 }}
    >
      <CardContent>
        {transaction.pending && (
          <Box sx={{ color: red[600], float: "right" }}>
            <Tooltip title="This transaction is pending. Make sure to pay your transactions before buying anything else!">
              <span className="material-symbols-rounded">warning</span>
            </Tooltip>
          </Box>
        )}

        <Typography gutterBottom variant="h6">
          {transaction.merchant_name ?? transaction.name}
        </Typography>
        <Typography gutterBottom>
          {dayjs(transaction.date).fromNow()} &bull; ${transaction.amount}
        </Typography>
        <Stack spacing={1} sx={{ mt: 1 }} direction="row">
          {transaction.category.map((category) => (
            <Chip label={category} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
