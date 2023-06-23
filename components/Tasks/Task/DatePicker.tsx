import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/useSession";
import {
  Box,
  Button,
  Icon,
  Menu,
  MenuItem,
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
  const hasTime =
    date && (dayjs(date).hour() !== 0 || dayjs(date).minute() !== 0);
  const [open, setOpen] = useState<boolean>(false);
  const today = new Date(dayjs().startOf("day").toISOString());

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Box sx={{ gap: 1, display: "flex" }}>
            <Box sx={{ flexGrow: 1 }}>
              {[...Array(12).keys()].map((i) => (
                <MenuItem
                  selected={i === dayjs(date).hour() % 12}
                  onClick={() => {
                    setDate(
                      dayjs(date)
                        .hour(i + (dayjs(date).hour() % 12))
                        .toDate()
                    );
                  }}
                  key={i}
                >
                  {i % 12 || 12}
                </MenuItem>
              ))}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              {[...Array(12).keys()].map((i) => (
                <MenuItem
                  selected={i * 5 === dayjs(date).minute()}
                  onClick={() => {
                    setDate(
                      dayjs(date)
                        .minute(i * 5)
                        .toDate()
                    );
                  }}
                  key={i}
                >
                  {(i * 5).toString().padStart(2, "0")}
                </MenuItem>
              ))}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              {[...Array(2).keys()].map((i) => (
                <MenuItem
                  selected={
                    i === 0 ? dayjs(date).hour() < 12 : dayjs(date).hour() >= 12
                  }
                  onClick={() => {
                    setDate(
                      dayjs(date)
                        .hour(dayjs(date).hour() + (i === 0 ? -12 : 12))
                        .toDate()
                    );
                  }}
                  key={i}
                >
                  {i === 0 ? "AM" : "PM"}
                </MenuItem>
              ))}
            </Box>
          </Box>
        </Menu>
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
      <Tooltip title="Date (alt • f)" placement="top">
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
              fontSize: hasTime ? "13px" : "15px",
              ...(hasTime && { mt: -0.4 }),
              display: { xs: "none", sm: "inline-flex" },
              textAlign: "left",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            {date && dayjs(date).format("MMMM D")}
            {hasTime && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: "11px",
                  mt: -0.5,
                  mb: -0.5,
                }}
              >
                {dayjs(date).format("h:mm a")}
              </Typography>
            )}
          </Typography>
        </Button>
      </Tooltip>
    </>
  );
};
