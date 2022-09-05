import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as colors from "@mui/material/colors";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

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
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h1">7</Typography>
      <Typography variant="h6">tasks left for this month</Typography>
    </Box>
  );
}

export default function Maintenance(req, res) {
  return (
    <Box>
      <Header />
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          Upcoming
        </Typography>
      </Box>
    </Box>
  );
}
