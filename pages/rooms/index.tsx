import { OptionsGroup } from "@/components/OptionsGroup";
import { GroupSelector } from "@/components/Tasks/Layout";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Button, Icon } from "@mui/material";

function Panel() {
  return (
    <Box
      sx={{
        width: "250px",
        flex: "0 0 250px",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ height: "100%", p: 2, pb: 0 }}>
        <GroupSelector />
        <OptionsGroup
          currentOption={"Room"}
          setOption={() => {}}
          options={["Room", "Category"]}
          sx={{ mt: 2 }}
        />
      </Box>
      {/* Scan */}
      <Box sx={{ width: "100%", p: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" fullWidth>
          <Icon>add</Icon>New
        </Button>
        <Button variant="contained">
          <Icon>process_chart</Icon>
        </Button>
      </Box>
    </Box>
  );
}

export default function RoomLayout() {
  const session = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  return (
    <Box
      sx={{
        display: "flex",
        height: { sm: "100dvh" },
        background: { sm: palette[2] },
      }}
    >
      {/* Sidebar */}
      <Panel />

      {/* Content */}
      <Box
        sx={{
          width: "100%",
          background: palette[1],
          borderRadius: { sm: "20px 0 0 20px" },
        }}
      ></Box>
    </Box>
  );
}
