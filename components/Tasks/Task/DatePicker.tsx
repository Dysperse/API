import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/useSession";
import {
  Box,
  Button,
  Icon,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import DatePicker from "react-calendar";

export const SelectDateModal: any = function SelectDateModal({
  ref,
  styles,
  date,
  setDate,
}: any) {
  const session = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const today = new Date(dayjs().startOf("day").toISOString());

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            maxWidth: { sm: "350px" },
            mb: { sm: 10 },
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
          },
        }}
      >
        <Puller sx={{ mb: -1 }} showOnDesktop />
        <DatePicker
          value={new Date(date)}
          onChange={(e: any) => {
            setDate(e);
          }}
        />
        <Box
          sx={{
            mt: -1,
            gap: 1,
            display: "flex",
            p: 2,
            width: "100%",
          }}
        >
          <Button
            fullWidth
            sx={{ borderRadius: 9 }}
            variant="contained"
            onClick={() => {
              setDate(today);
            }}
          >
            Today
          </Button>
        </Box>
      </SwipeableDrawer>
      <Tooltip title="Select date (alt • f)" placement="top">
        <Button
          id="dateModal"
          ref={ref}
          disableRipple
          variant={date ? "contained" : "outlined"}
          sx={{
            ...styles,
            borderRadius: 9999,
            px: 2,
            transition: "all .2s",
          }}
          onClick={() => setOpen(!open)}
        >
          <Icon>today</Icon>
          <Typography
            sx={{
              fontSize: "15px",
              display: { xs: "none", sm: "inline-flex" },
            }}
          >
            {date && dayjs(date).format("MMMM D")}
          </Typography>
        </Button>
      </Tooltip>
    </>
  );
};
