import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { colors } from "../../lib/colors";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Puller } from "../Puller";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useFormik } from "formik";

function CreateModal() {
  const [open, setOpen] = useState(false);
  useStatusBar(open);
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        disableRipple
        size="large"
        color="inherit"
        sx={{
          "&:active": {
            background: colors[themeColor][900],
          },
          transition: "none",
        }}
      >
        <span className="material-symbols-rounded">add</span>
      </IconButton>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          sx: {
            background: colors[themeColor][50],
            borderRadius: "20px 20px 0 0",
            boxShadow: "none",
            maxWidth: "500px",
            mx: "auto",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6">Create new reminder</Typography>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
/**
 * Bannner for maintenance, which shows upcoming tasks the current week
 * @param {any} {count}
 * @returns {JSX.Element}
 */
export function Header(): JSX.Element {
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box>
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
            <Box sx={{ ml: "auto", color: "#fff" }}>
              <CreateModal />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
