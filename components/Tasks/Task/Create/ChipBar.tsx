import { Puller } from "@/components/Puller";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Chip,
  Icon,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Tooltip,
  colors,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import React, {
  cloneElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import SelectDateModal from "../DatePicker";
import { RecurringChip } from "./RecurringChip";

const MemoizedChip = memo(Chip);

function NotificationChip({ titleRef, data, setData, chipStyles }) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        style={{ display: "inline-block" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Chip
          onClick={() => setOpen(true)}
          sx={chipStyles(data.notifications.length > 0)}
          icon={<Icon>notifications</Icon>}
          label={
            data.notifications.length === 0
              ? "Notify me"
              : data.notifications.length === 1
              ? `${data.notifications[0]} minutes before`
              : `${data.notifications.length} notifications`
          }
        />
      </motion.div>

      <SwipeableDrawer
        open={open}
        onClose={() => {
          setOpen(false);
          titleRef?.current?.focus();
        }}
        anchor="bottom"
      >
        <Puller showOnDesktop />
        <Box sx={{ p: 2, pt: 0 }}>
          {[5, 10, 15, 20, 25, 30, 60].map((minutes) => (
            <ListItemButton
              key={minutes}
              sx={{ mb: 0.3 }}
              selected={
                data.notifications.includes(minutes) &&
                data.notifications.length !== 9
              }
              onClick={() => {
                setData((d) => {
                  if (d.notifications.includes(minutes)) {
                    return {
                      ...d,
                      notifications: d.notifications.filter(
                        (m) => m !== minutes
                      ),
                    };
                  } else {
                    return {
                      ...d,
                      notifications: [...d.notifications, minutes],
                    };
                  }
                });
              }}
            >
              <ListItemText primary={`${minutes} minutes before`} />
              {data.notifications.includes(minutes) &&
                data.notifications.length !== 9 && (
                  <Icon sx={{ ml: "auto" }}>check</Icon>
                )}
            </ListItemButton>
          ))}
          <Box sx={{ display: "flex", gap: 2 }}>
            <ListItemButton
              sx={{ background: palette[2], width: "100%" }}
              onClick={() => {
                setData((d) => ({
                  ...d,
                  notifications:
                    data.notifications.length !== 9
                      ? [5, 10, 15, 20, 25, 30, 40, 50, 60]
                      : [],
                }));
              }}
              selected={data.notifications.length === 9}
            >
              <ListItemText primary="Bother me" />
              {data.notifications.length === 9 && (
                <Icon sx={{ ml: "auto" }}>check</Icon>
              )}
            </ListItemButton>
            <ListItemButton
              sx={{ background: palette[2], width: "100%" }}
              onClick={() => setOpen(false)}
            >
              <ListItemText
                primary={data.notifications.length === 0 ? "Close" : "Done"}
              />
              <Icon>arrow_forward_ios</Icon>
            </ListItemButton>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export const TaskColorPicker = React.memo(function TaskColorPicker({
  children,
  color,
  setColor,
  titleRef,
}: any) {
  const [open, setOpen] = useState(false);
  const trigger = cloneElement(children, {
    onClick: () => setOpen(true),
  });
  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={() => {
          setOpen(false);
          titleRef?.current?.focus();
        }}
        anchor="bottom"
        variant="outlined"
      >
        <Puller showOnDesktop />
        <Box sx={{ p: 2, pt: 0 }}>
          {[
            "grey",
            "pink",
            "purple",
            "indigo",
            "blue",
            "cyan",
            "teal",
            "green",
            "yellow",
            "orange",
            "brown",
          ].map((colorChoice) => (
            <ListItemButton
              key={colorChoice}
              selected={color === colorChoice}
              onClick={() => {
                setColor(colorChoice);
                setOpen(false);
              }}
            >
              <Box
                sx={{
                  background: colors[colorChoice][500],
                  width: 15,
                  height: 15,
                  borderRadius: 999,
                }}
              />
              <ListItemText
                primary={capitalizeFirstLetter(
                  colorChoice.replace("grey", "default")
                )}
              />
              {color === colorChoice && <Icon sx={{ ml: "auto" }}>check</Icon>}
            </ListItemButton>
          ))}
        </Box>
      </SwipeableDrawer>
    </>
  );
});

const ChipBar = React.memo(function ChipBar({
  isSubTask,
  locationRef,
  showedFields,
  setShowedFields,
  data,
  setData,
  chipStyles,
  titleRef,
}: any) {
  const generateChipLabel = useCallback(
    (inputString) => {
      const regex = /(?:at|from|during)\s(\d+)/i;
      const match = inputString.match(regex);

      if (match) {
        const time = match[1];
        let amPm = inputString.toLowerCase().includes("p") ? "pm" : "am";

        if (
          !inputString.toLowerCase().includes("am") &&
          !inputString.toLowerCase().includes("pm")
        ) {
          // make it more sensible
          amPm = {
            "1": "pm",
            "2": "pm",
            "3": "pm",
            "4": "pm",
            "5": "pm",
            "6": "pm",
            "7": "pm",
            "8": "pm",
            "9": "pm",
            "10": "pm",
            "11": "am",
            "12": "pm",
          }[time];
        }

        if (Number(time) > 12) return null;

        return (
          <motion.div
            style={{ display: "inline-block" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <MemoizedChip
              label={`${time} ${amPm}`}
              icon={<Icon>access_time</Icon>}
              onClick={() =>
                setData((d) => ({
                  ...d,
                  date: dayjs(data.date).hour(
                    Number(time) + (amPm === "pm" && time !== "12" ? 12 : 0)
                  ),
                }))
              }
              sx={chipStyles(
                dayjs(data.date).hour() ===
                  Number(time) + (amPm === "pm" && time !== "12" ? 12 : 0)
              )}
            />
          </motion.div>
        );
      }

      return null;
    },
    [chipStyles, data.date, setData]
  );

  const [chipComponent, setChipComponent] = useState<any>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const chip = generateChipLabel(data.title);
      setChipComponent(chip);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [data.title, generateChipLabel]);

  const setTaskColor = useCallback(
    (e) => {
      setData((d) => ({ ...d, color: e }));
    },
    [setData]
  );

  const taskColorPicker = useMemo(
    () => (
      <TaskColorPicker
        color={data.color}
        setColor={setTaskColor}
        titleRef={titleRef}
      >
        <MemoizedChip
          icon={
            <Icon
              sx={{
                pl: 2,
                ...(data.color === "grey" && {
                  fontVariationSettings:
                    '"FILL" 0, "wght" 200, "GRAD" 0, "opsz" 40!important',
                }),
              }}
            >
              label
            </Icon>
          }
          onClick={() => {
            titleRef?.current?.blur();
          }}
          sx={{
            pr: "0!important",
            ...chipStyles(false),
            ...(data.color !== "grey" && {
              "&, &:hover, &:active, &:focus": {
                background: colors[data.color]["A400"] + "!important",
                borderColor: colors[data.color]["A400"] + "!important",
                "& *": {
                  color: "#000 !important",
                },
              },
            }),
          }}
        />
      </TaskColorPicker>
    ),
    [data.color, chipStyles, setTaskColor, titleRef, setShowedFields]
  );

  const taskDatePicker = useMemo(
    () => (
      <Tooltip
        title={
          dayjs(data.date).isValid()
            ? data.dateOnly
              ? dayjs(data.date).format("dddd, MMMM D, YYYY")
              : dayjs(data.date).format("dddd, MMMM D, YYYY h:mm A")
            : "Due date"
        }
        placement="top"
      >
        <SelectDateModal
          closeOnSelect
          date={data.date}
          setDate={(date) => setData((s) => ({ ...s, date }))}
          isDateOnly={data.dateOnly}
          setDateOnly={(dateOnly) => setData((d) => ({ ...d, dateOnly }))}
        >
          <Chip
            id="dateTrigger"
            sx={chipStyles(dayjs(data.date).isValid())}
            icon={
              <Icon
                sx={{
                  pl: dayjs(data.date).isValid() ? 0 : 1.5,
                  fontVariationSettings:
                    '"FILL" 0, "wght" 200, "GRAD" 0, "opsz" 40!important',
                }}
              >
                calendar_today
              </Icon>
            }
            label={
              dayjs(data.date).isValid()
                ? data.dateOnly
                  ? dayjs(data.date).format("MMMM Do")
                  : dayjs(data.date).fromNow()
                : ""
            }
          />
        </SelectDateModal>
      </Tooltip>
    ),
    [data.date, data.dateOnly, chipStyles, setData]
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 1,
          duration: 2,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <Box
          sx={{
            mb: 2,
            pl: { xs: 1, sm: 0 },
            overflowX: "scroll",
            overflowY: "visible",
            whiteSpace: "nowrap",
            display: "flex",
          }}
          onClick={() => titleRef?.current?.focus()}
        >
          {taskColorPicker}
          {!data.recurrenceRule && taskDatePicker}
          <Tooltip
            title={data.pinned ? "Marked as urgent" : "Mark as urgent"}
            placement="top"
          >
            <Chip
              onClick={() => setData((s) => ({ ...s, pinned: !s.pinned }))}
              sx={chipStyles(data.pinned)}
              icon={
                <Icon sx={{ pl: data.pinned ? 0 : 1.5 }}>priority_high</Icon>
              }
              label={data.pinned ? "Urgent" : ""}
            />
          </Tooltip>
          {chipComponent}
          {!showedFields.location &&
            [
              "meet",
              "visit",
              "watch",
              "go to",
              "drive ",
              "fly ",
              "attend ",
            ].some((word) => data.title.toLowerCase().includes(word)) && (
              <motion.div
                style={{ display: "inline-block" }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <MemoizedChip
                  label="Add location?"
                  icon={<Icon>location_on</Icon>}
                  onClick={() => {
                    setShowedFields((s) => ({ ...s, location: !s.location }));
                    setTimeout(() => locationRef.current?.focus(), 50);
                  }}
                  sx={chipStyles(showedFields.location)}
                />
              </motion.div>
            )}
          {!isSubTask && data.dateOnly ? (
            <Chip
              onClick={() => {
                toast("Set a due date");
                document.getElementById("dateTrigger")?.click();
              }}
              sx={chipStyles(false)}
              icon={
                <Icon
                  sx={{
                    pl: 1.5,
                    fontVariationSettings:
                      '"FILL" 0, "wght" 200, "GRAD" 0, "opsz" 40!important',
                  }}
                  className="outlined"
                >
                  notifications
                </Icon>
              }
            />
          ) : (
            !isSubTask && (
              <NotificationChip
                titleRef={titleRef}
                data={data}
                setData={setData}
                chipStyles={chipStyles}
              />
            )
          )}
          <RecurringChip
            data={data}
            setData={setData}
            chipStyles={chipStyles}
          />
        </Box>
      </motion.div>
    </div>
  );
});

export default ChipBar;
