import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
  Button,
  CardActionArea,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export function GroupStep({ styles, navigation }) {
  const session = useSession();
  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode),
  );

  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const url = `https://${window.location.hostname}/invite/${token}`;

  const createLink = useCallback(() => {
    setLoading(true);
    fetchRawApi(session, "property/members/inviteLink/create", {
      inviterName: session.user.name,
      timestamp: new Date().toISOString(),
    }).then((res) => {
      setLoading(false);
      setToken(res.token);
    });
  }, [session]);

  useEffect(() => {
    if (type == "group") createLink();
  }, [type, createLink]);

  return (
    <Box sx={styles.container}>
      <Container>
        <Grid columnSpacing={2} container>
          <Grid
            item
            xs={12}
            sm={7}
            sx={{
              height: { sm: "100vh" },
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ pt: 0 }}>
              <Typography
                variant="h1"
                className="font-heading"
                sx={styles.heading}
              >
                {type == "group" ? "Let's invite some people" : "Who are you?"}
              </Typography>
              <Typography sx={styles.helper}>
                {type == "group"
                  ? "Invite family, friends, or coworkers to join your group. You can always invite more people later."
                  : ""}
              </Typography>
              {type == "group" ? (
                <Box sx={{ width: "100%" }}>
                  {loading ? (
                    <CircularProgress sx={{ mb: 2 }} />
                  ) : (
                    <TextField
                      sx={{ mb: 2 }}
                      value={url}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                navigator.clipboard.writeText(url);
                                toast.success(
                                  "Copied to clipboard",
                                  toastStyles,
                                );
                              }}
                            >
                              <Icon>content_copy</Icon>
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      label="Invite link"
                      fullWidth
                    />
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button onClick={() => setType("")} variant="contained">
                      Back
                    </Button>
                    <Button onClick={navigation.next} variant="contained">
                      Done
                    </Button>
                  </Box>
                </Box>
              ) : (
                [
                  {
                    type: "person",
                    name: "I'm an individual",
                    description:
                      "I just want a personal space to organize my stuff",
                    icon: "person",
                  },
                  {
                    type: "group",
                    name: "I'm part of a group",
                    description:
                      "I want to invite my friends / family / roommates to join me in a collaborative space",
                    icon: "group",
                  },
                ].map((option) => (
                  <CardActionArea
                    key={option.name}
                    onClick={() => {
                      if (option.type === "person") navigation.next();
                      else setType(option.type);
                    }}
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      position: "relative",
                      gap: 2,
                      p: 3,
                      width: "100%",
                      borderRadius: 5,
                      background: addHslAlpha(palette[5], 0.3),
                      ...(session.property.profile.type === option.type && {
                        background: addHslAlpha(palette[7], 0.6),
                      }),
                      backdropFilter: "blur(10px)",
                      py: 2,
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: "30px!important",
                      }}
                      className="outlined"
                    >
                      {option.icon}
                    </Icon>
                    <Box sx={{ maxWidth: "calc(100% - 10px)" }}>
                      <Typography>
                        <b>{option.name}</b>
                      </Typography>
                      <Typography>{option.description}</Typography>
                    </Box>
                  </CardActionArea>
                ))
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={5}
            sx={{
              height: { sm: "100vh" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pt: { xs: 4, sm: 0 },
              pb: { xs: 4 },
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <Box
                sx={{
                  background: addHslAlpha(palette[6], 0.5),
                  width: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    background: addHslAlpha(palette[6], 0.5),
                    p: 10,
                    width: "100%",
                  }}
                />
                <Box
                  sx={{
                    p: 2,
                  }}
                >
                  <TextField
                    size="small"
                    variant="standard"
                    defaultValue={
                      session?.property?.profile?.name?.toLowerCase() ==
                      "my home"
                        ? session.user.name + "'s Space"
                        : session?.property?.profile?.name ||
                          session.user.name + "'s Space"
                    }
                    onBlur={(e) =>
                      updateSettings(
                        session,
                        "property.profile.name",
                        e.target.value,
                      )
                    }
                    InputProps={{
                      className: "font-heading",
                      disableUnderline: true,
                      sx: {
                        fontSize: "50px",
                        mb: -1,
                      },
                    }}
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ delay: 0.5 }}
                      key={type}
                      style={{ display: "inline-block" }}
                    >
                      <Chip
                        label={type == "group" ? "Group" : "Private"}
                        icon={
                          <Icon>{type === "group" ? "group" : "lock"}</Icon>
                        }
                      />
                    </motion.div>
                  </AnimatePresence>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
