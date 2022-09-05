import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import * as colors from "@mui/material/colors";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useState } from "react";
import useSWR from "swr";
import { ErrorHandler } from "../components/ErrorHandler";
import { Puller } from "../components/Puller";

function Reminder({ reminder }: any) {
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
            background: colors[themeColor]["50"],
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
                minHeight: "100px",
              },
            }}
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
            disabled={global.property.permissions === "read-only"}
          >
            Postpone for 1 day
          </Button>
          <Button
            fullWidth
            size="large"
            variant="outlined"
            sx={{ mt: 1, borderWidth: "2px!important", borderRadius: 999 }}
          >
            Delete
          </Button>
        </Box>
      </SwipeableDrawer>
      <Card
        sx={{
          mb: 2,
          background: "rgba(200,200,200,.3)",
          borderRadius: 5,
        }}
      >
        <CardActionArea onClick={() => setOpen(true)}>
          <CardContent sx={{ px: 3.5, py: 3 }}>
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

function Header({ count }) {
  return (
    <Box sx={{ p: { sm: 3 } }}>
      <Box
        sx={{
          width: "100%",
          background:
            "linear-gradient(45deg, " +
            colors.green["100"] +
            " 0%, " +
            colors.green["300"] +
            " 100%)",
          color: colors.green["900"],
          height: "320px",
          borderRadius: { sm: 10 },
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h1">{count}</Typography>
        <Typography variant="h6">tasks left for this month</Typography>
      </Box>
    </Box>
  );
}

export default function Maintenance(req, res) {
  const url =
    "/api/property/maintenance/reminders?" +
    new URLSearchParams({
      property: global.property.id,
      accessToken: global.property.accessToken,
    });
  const { data, error } = useSWR(url, () => fetch(url).then((r) => r.json()));

  return (
    <Box sx={{ mb: 4 }}>
      <Header count={data ? data.length : 0} />
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "600", mb: 3 }}>
          Upcoming
        </Typography>
        {data ? (
          <>
            {data.map((reminder) => (
              <Reminder reminder={reminder} key={reminder.id.toString()} />
            ))}
          </>
        ) : (
          <>
            {[...new Array(5)].map((_, i) => (
              <Skeleton
                variant="rectangular"
                animation="wave"
                key={i}
                height={130}
                sx={{ mb: 3, borderRadius: 10 }}
              />
            ))}
          </>
        )}
        {error && (
          <ErrorHandler
            error={
              "An error occured while trying to fetch your upcoming maintenance tasks."
            }
          />
        )}
      </Box>
    </Box>
  );
}
