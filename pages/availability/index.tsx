import { ErrorHandler } from "@/components/Error";
import { Puller } from "@/components/Puller";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Box,
  Chip,
  Icon,
  IconButton,
  Skeleton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import useSWR from "swr";

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
    <Box
      sx={{
        zIndex: 9999,
        position: "fixed",
        bottom: 0,
        maxWidth: !submitted ? "100%" : "calc(100dvw - 64px)",
        width: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        background: submitted ? palette[3] : addHslAlpha(palette[3], 0.5),
        backdropFilter: submitted ? "" : "blur(10px)",
        overflow: "hidden",
        maxHeight: submitted ? "220px" : "270px",
        borderRadius: submitted ? 5 : "20px 20px 0 0",
        transition: "all .4s cubic-bezier(.17,.67,.08,1)!important",
        ...(submitted && {
          bottom: "calc(100dvh - 320px) !important",
        }),
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
      <AppBar
        sx={{
          px: 1,
          border: 0,
          background: "transparent!important",
          backdropFilter: "none",
        }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            className="font-heading"
            sx={{
              color: palette[11],
            }}
          >
            Gather availability
          </Typography>
          <IconButton
            sx={{
              ml: "auto",
              mr: submitted ? -1 : 0,
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
          ...(submitted && {
            filter: "blur(10px)",
            pointerEvents: "none",
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
    </Box>
  );
}

export default function Page() {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [showMargin, setShowMargin] = useState(false);

  const { data, error, mutate } = useSWR(["availability"]);

  return (
    <Box sx={{ pb: "270px" }}>
      <AppBar>
        <Toolbar>
          <IconButton>
            <Icon>arrow_back_ios_new</Icon>
          </IconButton>
          <Typography>Availability</Typography>
        </Toolbar>
      </AppBar>
      <CreateAvailability setShowMargin={setShowMargin} />
      <Box
        sx={{
          p: 4,
          display: "flex",
          gap: "20px",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            paddingTop: showMargin ? "218px" : "0px",
            transition: "all .4s cubic-bezier(.17,.67,.08,1)!important",
            overflow: "hidden",
          }}
        />
        {data ? (
          data.length === 0 ? (
            <Box
              sx={{
                p: 3,
                borderRadius: 5,
                background: palette[3],
                color: palette[11],
              }}
            >
              <Typography variant="h4" className="font-heading">
                Availability
              </Typography>
              <Typography variant="body1" sx={{ color: palette[10] }}>
                Plan your next meetup time in under 3 clicks
              </Typography>
            </Box>
          ) : (
            data.map((event) => <Box key={event.id}></Box>)
          )
        ) : error ? (
          <ErrorHandler
            error="Something went wrong. Please try again later"
            callback={mutate}
          />
        ) : (
          [...new Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height="220px"
              animation="wave"
              sx={{ borderRadius: 5 }}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
