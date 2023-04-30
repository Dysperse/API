import {
  Box,
  Button,
  Grid,
  Icon,
  IconButton,
  LinearProgress,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { reasons } from ".";
import { useSession } from "../../../lib/client/useSession";
import { colors } from "../../../lib/colors";
import { Puller } from "../../Puller";

export function Emoji({ emoji, mood, data, handleMoodChange }) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), [setOpen]);
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const session = useSession();
  const [currentReason, setCurrentReason] = useState<null | string>(
    (data && data[0] && data[0].reason) || null
  );

  // for push notification
  const [alreadyTriggered, setAlreadyTriggered] = useState<boolean>(false);

  /**
   * If the notification action button === the emoji, open the modal
   */
  useEffect(() => {
    if (
      !alreadyTriggered &&
      window.location.hash &&
      window.location.hash.includes("#/")
    ) {
      let match = window.location.hash.split("#/")[1];
      if (match.includes("-")) {
        match = match.split("-")[1];
      }

      if (match) {
        if (match === emoji) {
          setOpen(true);
          window.location.hash = "";
          setAlreadyTriggered(true);
        }
      }
    }
  }, [emoji, alreadyTriggered]);

  return (
    <>
      <SwipeableDrawer
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        ModalProps={{ keepMounted: false }}
        anchor="bottom"
        disableSwipeToOpen
      >
        <Puller />
        <Box sx={{ p: 3, pt: 0 }}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              pb: 2,
            }}
          >
            <picture style={{ flexShrink: 0, flexGrow: 0 }}>
              <img
                alt="emoji"
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                width="40px"
                height="40px"
              />
            </picture>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>
                {data && data[0] && mood === emoji
                  ? "Your mood"
                  : "What is making you feel this way?"}
              </Typography>
              <Typography variant="body2">
                {data && data[0] && mood === emoji
                  ? ""
                  : "Select the most relevant option."}
              </Typography>
            </Box>
          </Typography>
          {!(data && data[0] && mood === emoji) && (
            <LinearProgress
              value={75}
              variant="determinate"
              sx={{ borderRadius: 999, mb: 2, height: 2 }}
            />
          )}
          {!(data && data[0] && mood === emoji) && (
            <Grid
              container
              spacing={{
                xs: 1,
                sm: 2,
              }}
            >
              {reasons.map((reason) => (
                <Grid
                  item
                  xs={reason.w || 6}
                  sm={reason.w || 4}
                  key={reason.name}
                >
                  <Box
                    onClick={() =>
                      setCurrentReason(
                        currentReason && reason.name === currentReason
                          ? null
                          : reason.name
                      )
                    }
                    sx={{
                      border: "2px solid transparent",
                      userSelect: "none",
                      py: 2,
                      borderRadius: 4,
                      px: 2,
                      transition: "transform .2s",
                      alignItems: "center",
                      "&:active": {
                        transform: "scale(0.95)",
                        transition: "none",
                      },
                      display: "flex",
                      background: `hsl(240,11%,${
                        session.user.darkMode ? 10 : 97
                      }%)!important`,
                      gap: 2,
                      ...(currentReason === reason.name && {
                        borderColor: colors[session?.themeColor][700],
                        boxShadow:
                          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                        background: session.user.darkMode
                          ? "hsl(240,11%,10%) !important"
                          : "#fff !important",
                      }),
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: "26px!important",
                      }}
                      className="outlined"
                    >
                      {reason.icon}
                    </Icon>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        flexGrow: 1,
                      }}
                    >
                      {reason.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
          <Button
            fullWidth
            disableRipple
            size="large"
            variant="contained"
            onClick={() => {
              handleClose();
              handleMoodChange(emoji, currentReason);
            }}
            sx={{
              mt: 2,
              transition: "opacity .2s!important",
              "&:active": { opacity: 0.5, transition: "none!important" },
            }}
          >
            {data && data[0] && mood === emoji ? "Delete" : "Done"}
          </Button>
        </Box>
      </SwipeableDrawer>
      <IconButton
        key={emoji}
        sx={{
          p: 0,
          width: 35,
          height: 35,
          cursor: "pointer!important",
          ...((mood || !data) && {
            opacity: mood === emoji ? 1 : 0.5,
          }),
          ...(mood === emoji && {
            transform: "scale(1.1)",
          }),
          "&:active": {
            transition: "none",
            transform: "scale(0.9)",
          },
          transition: "transform .2s",
        }}
        onClick={handleOpen}
      >
        <picture>
          <img
            alt="emoji"
            src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
            width="100%"
            height="100%"
          />
        </picture>
      </IconButton>
    </>
  );
}
