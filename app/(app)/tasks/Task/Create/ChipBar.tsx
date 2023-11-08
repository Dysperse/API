import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { Box, Chip, Icon, Tooltip, colors } from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { RRule } from "rrule";
import SelectDateModal from "../DatePicker";
import { NotificationChip } from "./NotificationChip";
import { RecurringChip } from "./RecurringChip";
import { TaskColorPicker } from "./TaskColorPicker";

const MemoizedChip = memo(Chip);

const ChipBar = React.memo(function ChipBar({
  boardData,
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
      let timeChip: JSX.Element | null = null;
      let recurrenceChip: JSX.Element | null = null;

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

        timeChip = (
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

      if (inputString.toLowerCase().includes("every ")) {
        try {
          const split = inputString.toLowerCase().toString().split("every ");
          const text = "Every " + split[split[1] ? 1 : 0];

          const rule = RRule.fromText(text);
          recurrenceChip =
            data.recurrenceRule?.toString() === rule?.toString() ? null : (
              <motion.div
                style={{ display: "inline-block" }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <MemoizedChip
                  label={capitalizeFirstLetter(rule.toText())}
                  icon={<Icon>loop</Icon>}
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      recurrenceRule: rule,
                    }))
                  }
                  sx={chipStyles(false)}
                />
              </motion.div>
            );
        } catch (e) {
          recurrenceChip = null;
        }
      }

      return (
        <>
          {timeChip}
          {recurrenceChip}
        </>
      );
    },
    [chipStyles, data.date, data.recurrenceRule, setData]
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
    [data.color, chipStyles, setTaskColor, titleRef]
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
            {...(boardData &&
              data.date && {
                onDelete: () => {
                  setData({ ...data, dateOnly: true, date: null });
                  titleRef.current.focus();
                },
              })}
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
                  ? dayjs(data.date).utc().isToday()
                    ? "Today"
                    : dayjs(data.date).utc().isTomorrow()
                    ? "Tomorrow"
                    : dayjs(data.date).utc().format("MMMM Do")
                  : dayjs(data.date).utc().fromNow()
                : ""
            }
          />
        </SelectDateModal>
      </Tooltip>
    ),
    [data, titleRef, chipStyles, setData, boardData]
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
            "&::-webkit-scrollbar": {
              display: "none",
            },
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
