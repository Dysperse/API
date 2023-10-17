import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Button } from "@mui/material";

export function AvailabilityViewSelector({ view, setView }) {
  const { session } = useSession();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  const styles = (active) => ({
    flexShrink: 0,
    borderWidth: "2px!important",
    color: `${palette[10]}!important`,
    ...(active && {
      color: `${palette[11]}!important`,
      background: `${palette[4]}!important`,
      borderColor: `${palette[6]}!important`,
      "&:hover": {
        background: { sm: `${palette[5]}!important` },
        borderColor: `${palette[7]}!important`,
      },
      "&:active": {
        background: `${palette[6]}!important`,
        borderColor: `${palette[8]}!important`,
      },
    }),
  });

  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        mr: -3,
        ml: -3,
        px: 3,
        mt: { xs: 2, sm: 0 },
        gap: 2,
        maxWidth: "100dvw",
        flexShrink: 0,
      }}
    >
      <Button
        variant="outlined"
        onClick={() => setView(0)}
        sx={{
          ml: { sm: "auto" },
          ...styles(view === 0),
        }}
      >
        My availability
      </Button>
      <Button
        variant="outlined"
        onClick={() => setView(1)}
        sx={{
          mr: { sm: "auto" },
          ...styles(view === 1),
        }}
      >
        Everyone else
      </Button>
    </Box>
  );
}
