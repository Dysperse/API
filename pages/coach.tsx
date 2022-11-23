import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Calendar } from "../components/Coach/Calendar";
import { MyGoals } from "../components/Coach/MyGoals";

export default function Render() {
  return (
    <Box sx={{ position: "relative" }}>
      {global.user.email !== "manusvathgurudath@gmail.com" && (
        <Box
          sx={{
            position: "absolute",
            top: "200px",
            left: "50%",
            width: "500px",
            maxWidth: "calc(100vw - 20px)",
            boxShadow: 3,
            transform: "translateX(-50%)",
            zIndex: 1,
            background: "#fff",
            backdropFilter: "blur(10px)",
            borderRadius: 5,
            p: 4,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "600" }}>
            Coach is an upcoming feature
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            We&apos;re working on it! In the meantime, you can use the tasks
            feature to track your goals.
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          zIndex: 0,
          pb: 3,
          ...(global.user.email !== "manusvathgurudath@gmail.com" && {
            filter: "blur(10px)",
            opacity: 1.5,
            pointerEvents: "none",
          }),
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              background: "linear-gradient(-45deg, #715DF2 0%, #001122 50%)",
              p: 3,
              mt: 3,
              borderRadius: 5,
              color: "#fff",
            }}
          >
            <Typography variant="h6">
              Reach big goals with small steps.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 500,
              }}
            >
              Carbon coach helps you to reach your goals by breaking them down
              into small steps. Enrich your daily routine with new knowledge and
              skills to accelerate your growth.
            </Typography>
          </Box>
        </Box>
        <Calendar />
        <Box sx={{ px: 3 }}>
          <MyGoals />
        </Box>
      </Box>
    </Box>
  );
}
