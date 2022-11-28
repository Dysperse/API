import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Calendar } from "../components/Coach/Calendar";
import { MyGoals } from "../components/Coach/MyGoals";
import { colors } from "../lib/colors";

export default function Render() {
  const time = new Date().getHours();
  let greeting;
  if (time < 10) {
    greeting = "Morning, ";
  } else if (time < 14) {
    greeting = "Good afternoon, ";
  } else if (time < 18) {
    greeting = "Good evening, ";
  } else {
    greeting = "Good night, ";
  }

  return (
    <Box sx={{ position: "relative" }}>
      {global.user.email !== "manusvathgurudath@gmail.com" && (
        <Box
          className="absolute top-[200px] left-1/2 transform -translate-x-1/2 w-md max-w-lg shadow-xl z-10 bg-white rounded-2xl p-7"
          sx={{
            maxWidth: "calc(100vw - 20px)",
            transform: "translateX(-50%)",
          }}
        >
          <h1 className="text-gray-900 text-lg text-bold">
            Coach is an upcoming feature
          </h1>
          <Typography variant="body2" sx={{ mt: 1 }}>
            We&apos;re working on it! In the meantime, you can use the tasks
            feature to track your goals.
          </Typography>
        </Box>
      )}
      <Box
        className="mt-5 sm:mt-10"
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
        <Box className="p-3 max-w-[100vw]">
          <Typography sx={{ fontWeight: "600" }} variant="h5">
            {greeting}
            {global.user.name}!
          </Typography>
        </Box>
        <Box className="p-3 pt-0 max-w-[100vw]">
          <Box
            sx={{
              p: 2,
              mb: 4,
              px: 3,
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:active": {
                transform: "scale(0.98)",
                transitionDuration: "0s",
              },
              userSelect: "none",
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              background: colors[themeColor][100],
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: "900" }}>Daily routine</Typography>
              <Typography>5 tasks remaining &bull; Click to resume</Typography>
            </Box>
            <span className="material-symbols-rounded ml-auto">play_arrow</span>
          </Box>
          <MyGoals />
        </Box>
      </Box>
    </Box>
  );
}
