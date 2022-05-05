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
  const [open, setOpen] = useState(true);
  return (
    <>
      <Collapse in={open} sx={{ borderRadius: 5 }}>
        <Alert
          severity="error"
          variant="filled"
          sx={{ borderRadius: 5 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          The data below is for currently for demo purposes. A production-ready
          finance page will be available soon!
        </Alert>
      </Collapse>
      <AccountList />
    </>
  );
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
