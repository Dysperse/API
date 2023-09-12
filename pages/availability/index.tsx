import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Box,
  Chip,
  Icon,
  IconButton,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

function CreateAvailability({ setShowMargin }) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs().endOf("day"));
  const [name, setName] = useState(
    `${session.user?.name?.split(" ")[0]}'s meeting`
  );

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setShowMargin(submitted);
  }, [submitted, setShowMargin]);

  return (
    <SwipeableDrawer
      open
      anchor="bottom"
      hideBackdrop
      onClose={() => {}}
      PaperProps={{
        sx: {
          background: palette[2],
          mx: { xs: 0, sm: "auto" },
          maxHeight: submitted ? "220px" : "270px",
          ...(submitted && {
            transition: "all .4s cubic-bezier(.17,.67,.08,1)!important",
            borderRadius: 5,
            bottom: "calc(100dvh - 320px) !important",
            mx: { xs: 4, sm: "auto" },
          }),
        },
      }}
    >
      {submitted && (
        <Skeleton
          variant="rectangular"
          sx={{
            height: "100%",
            position: "absolute",
            width: "100%",
            top: 0,
            left: 0,
            borderRadius: 5,
            zIndex: 9999,
            background: "transparent",
            pointerEvents: "none",
          }}
          animation="wave"
        />
      )}
      <Puller
        sx={{
          mt: submitted ? "-50px" : "0px",
          transition: "all .4s cubic-bezier(.17,.67,.08,1)!important",
          overflow: "hidden",
        }}
      />
      <AppBar sx={{ px: 1, border: 0, background: "transparent" }}>
        <Toolbar>
          <Typography variant="h4" className="font-heading">
            Gather availability
          </Typography>
          <IconButton
            sx={{
              ml: "auto",
              background: palette[3],
              transition: "all .4s",
              ...(submitted && {
                transform: "rotate(90deg)",
              }),
            }}
            onClick={() => setSubmitted((e) => !e)}
          >
            <Icon>north</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          px: 3,
          pb: 3,
          transition: "all .4s",
          ...(submitted && {
            filter: "blur(10px)",
          }),
        }}
      >
        <Box
          sx={{
            mt: 1,
            mb: 2,
            display: "flex",
            gap: 1.5,
            overflowX: "scroll",
            px: 3,
            mr: -3,
            ml: -3,
          }}
        >
          <Chip icon={<Icon sx={{ ml: "18px!important" }}>tune</Icon>} />
          <Chip icon={<Icon>check</Icon>} label="Today" />
          <Chip label="This weekend" />
          <Chip label="Weekends this month" />
          <Chip label="Weekdays this month" />
        </Box>
        <TextField
          sx={{ mt: 1 }}
          placeholder="Event name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>
    </SwipeableDrawer>
  );
}

export default function Page() {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [showMargin, setShowMargin] = useState(false);

  return (
    <Box>
      <AppBar>
        <Toolbar>
          <IconButton>
            <Icon>arrow_back_ios_new</Icon>
          </IconButton>
          <Typography>Availability</Typography>
        </Toolbar>
      </AppBar>
      <CreateAvailability setShowMargin={setShowMargin} />
      <Box sx={{ p: 4, display: "flex", gap: "20px", flexDirection: "column" }}>
        <Box
          sx={{
            paddingTop: showMargin ? "220px" : "0px",
            transition: "all .4s cubic-bezier(.17,.67,.08,1)!important",
            overflow: "hidden",
          }}
        />
        <Box
          sx={{
            p: 3,
            borderRadius: 5,
            background: palette[3],
            color: palette[11],
            height: "220px",
          }}
        >
          <Typography variant="h4" className="font-heading">
            Your availability
          </Typography>
        </Box>
        <Box
          sx={{
            p: 3,
            borderRadius: 5,
            background: palette[3],
            color: palette[11],
            height: "220px",
          }}
        >
          <Typography variant="h4" className="font-heading">
            Your availability
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
