import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Calendar } from "../components/Coach/Calendar";
import { MyGoals } from "../components/Coach/MyGoals";

export default function Render() {
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
        <Calendar />
        <Box className="p-3 max-w-[100vw]">
          <MyGoals />
        </Box>
      </Box>
    </Box>
  );
}
