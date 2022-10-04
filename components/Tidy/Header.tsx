import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { colors } from "../../lib/colors";
import { Calendar as CalendarList } from "./Calendar";

/**
 * Select frequency settiong
 * @param {any} {name
 * @param {any} formik}
 * @returns {any}
 */
function FrequencySetting({ name, formik }: { name: string; formik }) {
  return (
    <Button
      onClick={() => formik.setFieldValue("frequency", name)}
      sx={{
        px: 3,
        width: "33.9%",
        borderRadius: 999,
        height: 40,
        transition: "none!important",
        textTransform: "capitalize",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        ...(formik.values.frequency === name && {
          background: `${
            colors[themeColor][global.theme !== "dark" ? 100 : 900]
          }!important`,
          color: `${
            colors[themeColor][global.user.darkMode ? 50 : 900]
          }!important`,
        }),
      }}
    >
      {formik.values.frequency === name && (
        <span
          className="material-symbols-rounded"
          style={{ marginRight: "10px" }}
        >
          check
        </span>
      )}
      {name}
    </Button>
  );
}

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
            color: `${colors[themeColor][100]} !important`,
            borderRadius: { sm: 5 },
            pb: 3,
            display: "block",
            py: { sm: 3 },
            userSelect: "none",
          }}
        >
          <Typography></Typography>
        </Box>
      </Box>
    </>
  );
}
