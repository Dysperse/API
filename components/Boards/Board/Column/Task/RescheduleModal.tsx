import {
  Button,
  Icon,
  MenuItem,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import { cloneElement, useState } from "react";
import { useSession } from "../../../../../lib/client/useSession";
import { colors } from "../../../../../lib/colors";
import { Puller } from "../../../../Puller";

export function RescheduleModal({ data, children, handlePostpone }) {
  const session = useSession();

  const [value, setValue] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const trigger = cloneElement(children, {
    onClick: handleClick,
  });

  const actions = [
    {
      label: "In one day",
      icon: "chevron_right",
      days: 1,
    },
    {
      label: "In two days",
      icon: "keyboard_double_arrow_right",
      days: 2,
    },
    {
      label: "In three days",
      icon: "north_east",
      days: 3,
    },
    {
      label: "In one week",
      icon: "view_week",
      days: 7,
    },
    {
      label: "In one month",
      icon: "calendar_view_month",
      days: 30,
    },
    {
      label: "One day before",
      icon: "chevron_left",
      days: -1,
    },
    {
      label: "Two days before",
      icon: "keyboard_double_arrow_left",
      days: -2,
    },
    {
      label: "Three days before",
      icon: "south_west",
      days: -3,
    },
    {
      label: "One week before",
      icon: "view_week",
      days: -7,
    },
    {
      label: "One month before",
      icon: "calendar_view_month",
      days: -30,
    },
  ];

  return (
    <>
      {trigger}

      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        onOpen={handleClick}
        anchor="bottom"
        PaperProps={{
          sx: {
            p: 1,
            pt: 0,
            "& .MuiMenuItem-root": {
              gap: 2,
              "&:focus-visible, &:hover": {
                background: session.user.darkMode
                  ? "hsl(240,11%,30%)"
                  : "rgba(200,200,200,.3)",
                color: session.user.darkMode
                  ? colors[session?.themeColor || "grey"][100]
                  : "#000",
                "& .MuiSvgIcon-root": {
                  color: session.user.darkMode
                    ? colors[session?.themeColor || "grey"][200]
                    : colors[session?.themeColor || "grey"][800],
                },
              },
              padding: "8.5px 12px",
              minHeight: 0,
              borderRadius: "10px",
              marginBottom: "1px",
              "& .MuiSvgIcon-root": {
                fontSize: 25,
                color: colors[session?.themeColor || "grey"][700],
                marginRight: 1.9,
              },
              "&:active": {
                background: session.user.darkMode ? "hsl(240,11%,35%)" : "#eee",
              },
            },
          },
        }}
      >
        <Puller />
        <Typography
          variant="h6"
          sx={{ textAlign: "center", mb: 2 }}
          gutterBottom
        >
          {dayjs(data.due).format("dddd, MMMM D")}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, px: 1, py: 2 }}>
          <Button
            fullWidth
            variant={value == 0 ? "outlined" : "contained"}
            onClick={() => setValue(1)}
          >
            Prepone
          </Button>
          <Button
            fullWidth
            variant={value == 1 ? "outlined" : "contained"}
            onClick={() => setValue(0)}
          >
            Postpone
          </Button>
        </Box>
        {actions
          .filter((action) => (value == 0 ? action.days > 0 : action.days < 0))
          .map((action, index) => (
            <MenuItem
              onClick={() => {
                handleClose();
                handlePostpone(action.days, "day");
              }}
              key={index}
            >
              <Icon className="outlined">{action.icon}</Icon>
              <span>
                <Typography sx={{ fontWeight: 700 }}>{action.label}</Typography>
                <Typography variant="body2">
                  {dayjs(data.due).add(action.days, "day").format("MMMM D")}
                </Typography>
              </span>
            </MenuItem>
          ))}
      </SwipeableDrawer>
    </>
  );
}
