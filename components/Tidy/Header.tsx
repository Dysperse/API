import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { colors } from "../../lib/colors";

/**
 * Bannner for maintenance, which shows upcoming tasks the current week
 * @param {any} {count}
 * @returns {JSX.Element}
 */
export function Header({
  step,
  setStep,
}: {
  step: number;
  setStep: (step: number) => void;
}): JSX.Element {
  return (
    <>
      <Box sx={{ p: { sm: 3 }, pt: { sm: 1 } }}>
        <Box
          sx={{
            width: "100%",
            background: colors[themeColor][800],
            color: `${colors[themeColor][100]}`,
            borderRadius: { sm: 5 },
            p: 3,
            display: "block",
            pt: 2,
            py: { sm: 3 },
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            sx={{
              fontWeight: "600",
            }}
          >
            Tidy
          </Typography>
          <Typography variant="body1">5 tasks this week</Typography>
        </Box>
      </Box>
    </>
  );
}
