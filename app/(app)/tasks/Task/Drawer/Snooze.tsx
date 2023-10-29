import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Icon,
  MenuItem,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, {
  cloneElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Puller } from "../../../../../components/Puller";
import SelectDateModal from "../DatePicker";
import { useTaskContext } from "./Context";

export const RescheduleModal = React.memo(function RescheduleModal({
  children,
  handlePostpone,
}: any) {
  const { session } = useSession();
  const dateRef = useRef();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const task = useTaskContext();

  const [value, setValue] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const trigger = cloneElement(children, {
    onClick: handleClick,
  });

  const actions = useMemo(
    () => [
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
    ],
    []
  );

  const setDate = useCallback(
    (d) => {
      task.set((prev) => ({
        ...prev,
        due: d ? null : d?.toISOString(),
      }));
      task.edit(task.id, "due", d.toISOString());
    },
    [task]
  );

  const currentActions = useMemo(
    () =>
      actions.filter((action) =>
        value == 0 ? action.days > 0 : action.days < 0
      ),
    [value, actions]
  );

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        anchor="bottom"
        PaperProps={{
          sx: {
            p: 1,
            pt: 0,
            "& .MuiMenuItem-root": {
              gap: 2,
              "&:focus-visible, &:hover": {
                background: palette[2],
              },
              padding: "8.5px 12px",
              minHeight: 0,
              borderRadius: "10px",
              marginBottom: "1px",
              "& .MuiSvgIcon-root": {
                fontSize: 25,
                marginRight: 1.9,
              },
              "&:active": {
                background: palette[3],
              },
            },
          },
        }}
      >
        <Puller showOnDesktop />
        <SelectDateModal ref={dateRef} date={task.due} setDate={setDate}>
          <Typography
            variant="h4"
            className="font-heading"
            sx={{ textAlign: "center" }}
          >
            {dayjs(task.due).format("dddd, MMMM D")}
          </Typography>
        </SelectDateModal>
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
        {currentActions.map((action, index) => (
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
                {dayjs(task.due).add(action.days, "day").format("MMMM D")}
              </Typography>
            </span>
          </MenuItem>
        ))}
      </SwipeableDrawer>
    </>
  );
});
