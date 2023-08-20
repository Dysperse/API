import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { Box, Button, Icon, SwipeableDrawer, TextField } from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import React, { cloneElement, useRef, useState } from "react";
import DatePicker from "react-calendar";
import { toast } from "react-hot-toast";

const SelectDateModal: any = React.memo(function SelectDateModal({
  date,
  setDate,
  children,
  dateOnly = false,
}: any) {
  const session = useSession();
  const timeRef: any = useRef();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [open, setOpen] = useState<boolean>(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const today = new Date(dayjs().startOf("day").toISOString());

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event) => setTimeOpen((s) => !s);
  const handleClose = () => setAnchorEl(null);

  const trigger = cloneElement(children, {
    onClick: (e) => {
      setOpen(true);
    },
  });

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
          <motion.div
            key="time"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Box sx={{ p: 2, display: "flex", gap: 2 }}>
              <TextField
                type="time"
                defaultValue={dayjs(date).format("HH:mm")}
                inputRef={timeRef}
                size="small"
                inputProps={{
                  step: "600",
                }}
              />
              <Button
                disableRipple
                onClick={() => {
                  const [hours, minutes] = timeRef.current.value.split(":");
                  const roundedMinutes = Math.round(parseInt(minutes) / 5) * 5; // Round minutes to nearest 5
                  setDate(
                    dayjs(date)
                      .set("hour", parseInt(hours))
                      .set("minute", roundedMinutes)
                  );
                  setTimeOpen(false);
                }}
                variant="contained"
              >
                <Icon>check</Icon>
              </Button>
            </Box>
          </motion.div>
        ) : (
          <motion.div
            key="date"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <DatePicker
              calendarType="US"
              value={dayjs(date).isValid() ? new Date(date) : new Date()}
              onChange={(e: any) => {
                setDate(e);
                toast(
                  <span>
                    <b>{dayjs(e).format("dddd, MMMM D")}</b>{" "}
                    {dayjs(e).format("HHmm") !== "0000" && (
                      <>
                        {" "}
                        at <b>{dayjs(e).format("h:mm A")}</b>
                      </>
                    )}
                  </span>,
                  toastStyles
                );
                setTimeout(() => setOpen(false), 50);
              }}
            />
          </motion.div>
        )}
        {!dateOnly && (
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
              disableRipple
              fullWidth
              variant="contained"
              onClick={handleClick}
            >
              <Icon>{timeOpen ? "today" : "access_time"}</Icon>
              {dayjs(date).isValid()
                ? dayjs(date).format(timeOpen ? "MMM D" : "h:mm a")
                : `Set ${timeOpen ? "date" : "time"}`}
            </Button>
            <Button
              disableRipple
              sx={{ borderRadius: 9 }}
              variant="contained"
              onClick={() => {
                setDate(today);
                setTimeOpen(false);
              }}
            >
              <Icon>refresh</Icon>
            </Button>
          </Box>
        )}
      </SwipeableDrawer>
    </>
  );
});
export default SelectDateModal;
