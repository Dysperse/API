import { Box, Typography, colors } from "@mui/material";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import { mutate } from "swr";
import { useSession } from "../../../../lib/client/useSession";
import { ErrorHandler } from "../../../Error";

export function Overview({ data, url, error }) {
  const session = useSession();

  return (
    <>
      <Box
        sx={{
          background: `hsl(240,11%,${session.user.darkMode ? 20 : 95}%)`,
          p: 3,
          mb: 2,
          borderRadius: 5,
        }}
      >
        <Typography variant="h6">Stress</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Past 7 days
        </Typography>
        {error && (
          <ErrorHandler
            error="Yikes! We couldn't load your past reflections! Please try again later."
            callback={() => mutate(url)}
          />
        )}
        <Box
          sx={{
            mb: 2,
            height: "auto",
            display: "flex",
            gap: 2,
          }}
        >
          <Sparklines
            data={[
              ...(data && data.length < 4
                ? [1, 7, 3, 6, 7, 8, 2, 5, 4, 7, 6, 4, 3]
                : data && data.length > 0
                ? data.reverse().map((day) => day.stress)
                : [0]),
            ]}
            margin={6}
          >
            <SparklinesLine
              style={{
                strokeWidth: 4,
                stroke: colors[session?.themeColor || "grey"]["A700"],
                fill: "none",
              }}
            />
            <SparklinesSpots
              size={4}
              style={{
                stroke: colors[session?.themeColor || "grey"]["A400"],
                strokeWidth: 3,
                fill: session.user.darkMode ? "hsl(240,11%,15%)" : "white",
              }}
            />
          </Sparklines>
        </Box>
      </Box>

      <Box
        sx={{
          background: `hsl(240,11%,${session.user.darkMode ? 20 : 95}%)`,
          p: 3,
          mb: 2,
          borderRadius: 5,
        }}
      >
        <Typography variant="h6">Moods</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Past 7 days
        </Typography>
        {error && (
          <ErrorHandler
            error="Yikes! We couldn't load your past reflections! Please try again later."
            callback={() => mutate(url)}
          />
        )}
        <Box
          sx={{
            mb: 2,
            height: "auto",
            display: "flex",
            gap: 2,
          }}
        >
          <Sparklines
            data={[
              ...(data && data.length < 4
                ? [1, 7, 3, 6, 7, 8, 2, 5, 4, 7, 6, 4, 3]
                : data && data.length > 0
                ? data.reverse().map((day) => {
                    return [
                      "1f62d",
                      "1f614",
                      "1f610",
                      "1f600",
                      "1f601",
                    ].indexOf(day.mood);
                  })
                : [0]),
            ]}
            margin={6}
          >
            <SparklinesLine
              style={{
                strokeWidth: 4,
                stroke: colors[session?.themeColor || "grey"]["A700"],
                fill: "none",
              }}
            />
            <SparklinesSpots
              size={4}
              style={{
                stroke: colors[session?.themeColor || "grey"]["A400"],
                strokeWidth: 3,
                fill: session.user.darkMode ? "hsl(240,11%,15%)" : "white",
              }}
            />
          </Sparklines>
        </Box>
      </Box>
    </>
  );
}
