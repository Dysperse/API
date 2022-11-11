import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { ErrorHandler } from "../../../components/error";
import { useState } from "react";
import { useStatusBar } from "../../../hooks/useStatusBar";
import { colors } from "../../../lib/colors";
import hexToRgba from "hex-to-rgba";
import dayjs from "dayjs";
import { useApi } from "../../../hooks/useApi";

export function Changelog({ styles }: { styles: any }) {
  const [open, setOpen] = useState(false);
  useStatusBar(open);
  const { error, data } = useApi("property/inbox");

  return (
    <>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        anchor="bottom"
        PaperProps={{
          elevation: 0,
          sx: {
            mx: "auto",
            borderRadius: "20px 20px 0px 0px",
            maxWidth: "500px",
            background: colors[themeColor]["50"],
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "sticky",
            top: 0,
            left: 0,
            p: 4,
            pb: 2,
            zIndex: 9,
            width: "100%",
            background: hexToRgba(colors[themeColor]["50"], 0.9),
          }}
        >
          <Typography
            variant="h5"
            className="font-secondary"
            gutterBottom
            sx={{ flexGrow: 1 }}
          >
            Changelog
          </Typography>
          <IconButton
            color="inherit"
            size="large"
            onClick={() => setOpen(false)}
            sx={{
              color: colors[themeColor]["900"],
            }}
          >
            <span className="material-symbols-rounded">expand_more</span>
          </IconButton>
        </Box>
        <Box
          sx={{
            p: 4,
            pt: 0,
            maxHeight: "50vh",
            overflowY: "scroll",
          }}
        >
          {error && (
            <ErrorHandler error="An error occurred while trying to fetch your inbox" />
          )}
          {!data && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {data &&
            data.map((item) => (
              <Box
                sx={{
                  p: 3,
                  mb: 2,
                  background: colors[themeColor][100],
                  borderRadius: 5,
                }}
              >
                <Typography gutterBottom>
                  <b>{item.who === global.user.name ? "You" : item.who}</b>{" "}
                  {item.what}
                </Typography>
                <Typography variant="body2">
                  {dayjs(item.when).fromNow()}
                </Typography>
              </Box>
            ))}
          {data && data.length === 0 && (
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                background: colors[themeColor][100],
                p: 3,
                borderRadius: 5,
              }}
            >
              No recent activity
            </Typography>
          )}
        </Box>
      </SwipeableDrawer>
      <Tooltip title="Changelog">
        <IconButton
          sx={{ ...styles, ml: { xs: 0, sm: 1 }, mr: { xs: 2, sm: 1 } }}
          color="inherit"
          disableRipple
          onClick={() => setOpen(true)}
        >
          <span className="material-symbols-rounded">inbox</span>
        </IconButton>
      </Tooltip>
    </>
  );
}
