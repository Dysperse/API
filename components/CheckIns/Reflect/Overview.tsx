import { useSession } from "@/lib/client/useSession";
import { Box, colors, Typography } from "@mui/material";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import { mutate } from "swr";
import { moodOptions } from "..";
import { ErrorHandler } from "../../Error";

export function Overview({ data, url, error }) {
  const session = useSession();

  const moodIcons = moodOptions.reverse();
  const defaultMood = [0];

  const moodData = data?.length
    ? data.reverse().map((day) => moodIcons.indexOf(day.mood))
    : data?.length < 4
    ? [1, 7, 3, 6, 7, 8, 2, 5, 4, 7, 6, 4, 3]
    : defaultMood;

  return (
    <>
      {error && (
        <ErrorHandler
          error="Yikes! We couldn't load your past reflections! Please try again later."
          callback={() => mutate(url)}
        />
      )}
      <Box
        sx={{
          position: "relative",
        }}
      >
        {data?.length < 4 && (
          <Typography
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              zIndex: 1,
              background: "rgba(200,200,200,.3)",
              p: 2,
              width: "calc(100% - 50px)",
              borderRadius: 2,
              height: "auto",
            }}
          >
            <div>
              <Typography sx={{ fontWeight: 700 }}>
                Not enough data yet!
              </Typography>
              <Typography
                sx={{
                  whiteSpace: "normal",
                }}
              >
                Complete {4 - data.length} more daily check-in
                {4 - data.length !== 1 && "s"} to see graphs
              </Typography>
            </div>
          </Typography>
        )}
        <Box
          sx={{
            ...(data &&
              data.length < 4 && {
                filter: "blur(5px)",
                opacity: 0.5,
              }),
          }}
        >
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
                  ...(data?.length < 4
                    ? [1, 7, 3, 6, 7, 8, 2, 5, 4, 7, 6, 4, 3]
                    : data?.length > 0
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
              <Sparklines data={moodData} margin={6}>
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
        </Box>
      </Box>
    </>
  );
}
