import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as colors from "@mui/material/colors";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useSWR from "swr";
import { ErrorHandler } from "../components/ErrorHandler";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Skeleton from "@mui/material/Skeleton";
import dayjs from "dayjs";
function Header() {
  // Decrease header size on scroll
  const [scroll, setScroll] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 10);
    });
  }, []);

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
        <Typography variant="h1">7</Typography>
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
      <Header />
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "600", mb: 3 }}>
          Upcoming
        </Typography>
        {data ? (
          <>
            {data.map((reminder) => (
              <Card
                key={reminder.id.toString()}
                sx={{
                  background: "rgba(200,200,200,.3)",
                  borderRadius: 5,
                }}
              >
                <CardActionArea>
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
