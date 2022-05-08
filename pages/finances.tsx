import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NoData from "../components/finances/NoData";
import { AccountList } from "../components/finances/AccountList";

dayjs.extend(relativeTime);

export function RenderFinances() {
  return <AccountList />;
}
export default function Finances() {
  return (
    <Box sx={{ px: 3, py: 1 }}>
      {global.session &&
      global.session.user.financeToken &&
      global.session.user.financeToken.startsWith("access-sandbox-") ? (
        <RenderFinances />
      ) : (
        <>
          <Typography variant="h5">Finances</Typography>
          <NoData />
        </>
      )}
    </Box>
  );
}
