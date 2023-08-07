import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { Box, Button, Icon, SwipeableDrawer, TextField } from "@mui/material";
import dayjs from "dayjs";
import React, { cloneElement, useState } from "react";
import DatePicker from "react-calendar";
import { toast } from "react-hot-toast";

const SelectDateModal: any = React.memo(function SelectDateModal({
  ref,
  styles,
  date,
  setDate,
  children,
}: any) {
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [open, setOpen] = useState<boolean>(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const today = new Date(dayjs().startOf("day").toISOString());

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event) => setTimeOpen((s) => !s);
  const handleClose = () => setAnchorEl(null);

  const trigger = cloneElement(children, { onClick: () => setOpen(true) });

  return (
    <>
      {trigger}
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
        {timeOpen ? (
          <Box sx={{ p: 2 }}>
            <TextField
              type="time"
              value={dayjs(date).format("HH:mm")}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":");
                const roundedMinutes = Math.round(parseInt(minutes) / 5) * 5; // Round minutes to nearest 5
                setDate(
                  dayjs(date)
                    .set("hour", parseInt(hours))
                    .set("minute", roundedMinutes)
                );
              }}
              inputProps={{
                step: "600",
              }}
            />
          </Box>
        ) : (
          <DatePicker
            calendarType="US"
            value={new Date(date)}
            onChange={(e: any) => {
              setDate(e);
              toast(
                <span>
                  <b>{dayjs(date).format("dddd, MMMM D")}</b>{" "}
                  {dayjs(date).format("HHmm") !== "0000" && (
                    <>
                      {" "}
                      at <b>{dayjs(date).format("h:mm A")}</b>
                    </>
                  )}
                </span>,
                toastStyles
              );
              setTimeout(() => setOpen(false), 50);
            }}
          />
        )}
        <Box
          sx={{
            mt: -1,
            gap: 1,
            display: "flex",
            p: 2,
            width: "100%",
          }}
        >
          <Button fullWidth variant="contained" onClick={handleClick}>
            <Icon>access_time</Icon>
            {dayjs(date).format("h:mm a")}
          </Button>
          <Button
            sx={{ borderRadius: 9 }}
            variant="contained"
            onClick={() => {
              setDate(today);
            }}
          >
            <Icon>refresh</Icon>
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
});
export default SelectDateModal;
