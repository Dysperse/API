import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { colors } from "../../lib/colors";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { mutate } from "swr";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Puller } from "../Puller";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { MaintenanceReminder } from "@prisma/client";
import { getSuggestions } from "./suggestions";

/**
 * Reminder component
 * @param {any} {reminder}
 * @returns {any}
 */
export function Reminder({ reminder }: { reminder: MaintenanceReminder }) {
  const [open, setOpen] = useState<boolean>(false);
  const [markAsDoneLoading, setMarkAsDoneLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  /**
   *Handles update note
   * @param { React.FocusEvent<HTMLInputElement> } e
   */
  const handleUpdateNote = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      target.value = target.value.trim();
      target.blur();
    }
  };
  /**
   * Handles note blur update
   * @param { React.FocusEvent<HTMLInputElement> } e
   */
  const handleNoteBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    target.placeholder = "Click to add note";
    target.spellcheck = false;
    fetchApiWithoutHook("property/maintenance/updateNote", {
      id: reminder.id,
      note: target.value,
    });
    mutate(
      `/api/property/maintenance/reminders/?${new URLSearchParams({
        property: global.property.propertyId,
        accessToken: global.property.accessToken,
      }).toString()}`
    );
  };

  /**
   * Handles focus event
   */

  const handleFocusEvent = (e: React.FocusEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    target.placeholder = "SHIFT+ENTER for new lines";
    target.spellcheck = true;
  };

  return (
    <>
      <SwipeableDrawer
        disableSwipeToOpen
        swipeAreaWidth={0}
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            mx: "auto",
            maxWidth: "500px",
            background: global.user.darkMode
              ? "hsl(240, 11%, 18%)"
              : colors[themeColor][50],
            borderRadius: "20px 20px 0 0",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 4, mt: 2, textAlign: "center" }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: "600" }}>
            {reminder.name}
          </Typography>
          <Typography sx={{ mb: 3 }}>
            <span style={{ textTransform: "capitalize" }}>
              {reminder.frequency}
            </span>{" "}
            &bull; Due{" "}
            {dayjs(reminder.lastDone.toString().split("T")[0]).fromNow()}
          </Typography>
          <TextField
            multiline
            fullWidth
            onBlur={handleNoteBlur}
            onKeyUp={handleUpdateNote}
            InputProps={{
              disableUnderline: true,
              sx: {
                background: `${
                  global.user.darkMode
                    ? "hsl(240, 11%, 24%)"
                    : colors[themeColor][100]
                }!important`,
                cursor: "pointer",
                p: 2.5,
                borderRadius: "15px",
                display: "block",
              },
            }}
            minRows={3}
            spellCheck={false}
            variant="filled"
            defaultValue={reminder.note}
            maxRows={4}
            onFocus={handleFocusEvent}
            disabled={global.property.role === "read-only"}
            placeholder={
              global.property.role !== "read-only"
                ? "Click to add note"
                : "You do not have permission to edit this item"
            }
          />
          <Box sx={{ display: "flex", mt: 2, gap: 2 }}>
            <Button
              fullWidth
              size="large"
              disabled
              variant="outlined"
              sx={{ borderWidth: "2px!important", borderRadius: 999 }}
            >
              Postpone
            </Button>
            <LoadingButton
              loading={deleteLoading}
              fullWidth
              onClick={() => {
                setDeleteLoading(true);
                fetchApiWithoutHook("property/maintenance/delete", {
                  id: reminder.id,
                }).then(() => {
                  mutate(
                    `/api/property/maintenance/reminders/?${new URLSearchParams(
                      {
                        property: global.property.propertyId,
                        accessToken: global.property.accessToken,
                      }
                    ).toString()}`
                  );
                  setOpen(false);
                  toast.success("Reminder deleted");
                });
              }}
              size="large"
              variant="outlined"
              sx={{ borderWidth: "2px!important", borderRadius: 999 }}
            >
              Delete
            </LoadingButton>
          </Box>
          <LoadingButton
            fullWidth
            loading={markAsDoneLoading}
            onClick={() => {
              setMarkAsDoneLoading(true);
              fetchApiWithoutHook("property/maintenance/markAsDone", {
                id: reminder.id,
                frequency: reminder.frequency,
                lastDone: new Date().toISOString(),
              })
                .then(() => {
                  mutate(
                    `/api/property/maintenance/reminders/?${new URLSearchParams(
                      {
                        property: global.property.propertyId,
                        accessToken: global.property.accessToken,
                      }
                    ).toString()}`
                  );
                  setMarkAsDoneLoading(false);
                  setOpen(false);
                })
                .catch(() => {
                  toast.error("Couldn't mark as done. Please try again later.");
                });
            }}
            size="large"
            variant="contained"
            sx={{
              mt: 2,
              border: "2px solid transparent !important",
              borderRadius: 999,
            }}
            disableElevation
            disabled={global.property.permission === "read-only"}
          >
            Mark as done
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
      <Card
        sx={{
          mb: 2,
          background: global.user.darkMode
            ? "hsl(240, 11%, 18%)"
            : "rgba(200,200,200,.3)",
          borderRadius: 5,
        }}
      >
        <CardActionArea onClick={() => setOpen(true)}>
          <CardContent
            sx={{
              px: 3.5,
              py: 3,
              ...(dayjs(reminder.lastDone.toString().split("T")[0]).isBefore(
                dayjs()
              ) && {
                background: colors.red[global.user.darkMode ? 900 : 50],
              }),
            }}
          >
            <Typography variant="h6">{reminder.name}</Typography>
            <Typography variant="body2">
              <span style={{ textTransform: "capitalize" }}>
                {reminder.frequency}
              </span>{" "}
              &bull; Due{" "}
              {dayjs(reminder.lastDone.toString().split("T")[0]).fromNow()}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
