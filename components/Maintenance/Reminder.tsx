import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import * as colors from "@mui/material/colors";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useState } from "react";
import { Puller } from "../Puller";

export function Reminder({ reminder }: any) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            mx: "auto",
            maxWidth: "500px",
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 18%)"
                : colors[themeColor][50],
            borderRadius: "30px 30px 0 0",
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
            &bull; Due {dayjs(reminder.nextDue).fromNow()}
          </Typography>
          <TextField
            multiline
            fullWidth
            onBlur={(e) => {
              e.target.placeholder = "Click to add note";
              e.target.spellcheck = false;
            }}
            onKeyUp={(e: any) => {
              if (e.code === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.target.value = e.target.value.trim();
                e.target.blur();
              }
            }}
            InputProps={{
              disableUnderline: true,
              sx: {
                background:
                  (global.theme === "dark"
                    ? "hsl(240, 11%, 24%)"
                    : colors[themeColor][100]) + "!important",
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
            onFocus={(e) => {
              e.target.placeholder = "SHIFT+ENTER for new lines";
              e.target.spellcheck = true;
            }}
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
              variant="outlined"
              sx={{ borderWidth: "2px!important", borderRadius: 999 }}
            >
              Postpone
            </Button>
            <Button
              fullWidth
              size="large"
              variant="outlined"
              sx={{ borderWidth: "2px!important", borderRadius: 999 }}
            >
              Delete
            </Button>
          </Box>
          <Button
            fullWidth
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
          </Button>
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
              ...(dayjs(reminder.nextDue).isBefore(dayjs()) && {
                background: colors.red[global.user.darkMode ? 900 : 50],
              }),
            }}
          >
            <Typography variant="h6">{reminder.name}</Typography>
            <Typography variant="h6">{reminder.note}</Typography>
            <Typography variant="body2">
              <span style={{ textTransform: "capitalize" }}>
                {reminder.frequency}
              </span>{" "}
              &bull; Due {dayjs(reminder.nextDue).fromNow()}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
