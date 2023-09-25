import { Navbar } from "@/components/Navbar";
import { MenuChildren } from "@/components/Tasks/Layout";
import { SearchTasks } from "@/components/Tasks/Layout/SearchTasks";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Icon,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

export default function Home() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  return (
    <>
      <Navbar showLogo />
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Box
          sx={{
            p: 3,
            pb: 0,
            mb: -3,
            mt: 2,
          }}
        >
          <Typography
            variant="h2"
            className="font-heading"
            sx={{
              background: `linear-gradient(180deg, ${palette[11]}, ${palette[10]})`,
              WebkitBackgroundClip: "text",
            }}
          >
            Tasks
          </Typography>
          <SearchTasks>
            <TextField
              variant="standard"
              placeholder="Search..."
              InputProps={{
                readOnly: true,
                disableUnderline: true,
                sx: {
                  background: palette[2],
                  "&:focus-within": {
                    background: palette[3],
                  },
                  "& *::placeholder": {
                    color: palette[10],
                  },
                  transition: "all .2s",
                  mb: 2,
                  mt: 0.5,
                  px: 2,
                  py: 0.3,
                  borderRadius: 3,
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon sx={{ color: palette[9] }}>search</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </SearchTasks>
        </Box>
        <MenuChildren />
      </motion.div>
    </>
  );
}
