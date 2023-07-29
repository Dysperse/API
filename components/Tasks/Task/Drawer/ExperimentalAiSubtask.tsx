import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  InputAdornment,
  ListItemButton,
  ListItemText,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { useDeferredValue, useState } from "react";
import toast from "react-hot-toast";
import { taskButtonStyles } from "../Create";

export function ExperimentalAiSubtask({ task }) {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(task.name);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [data, setData] = useState<null | any>(null);
  const [loading, setLoading] = useState(false);
  const [addedValues, setAddedValues] = useState<string[]>([]);

  const handleClose = () => {
    setOpen(false);
    document.getElementById("subtaskTrigger")?.click();
  };

  const deferredValue = useDeferredValue(value);

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      await fetchRawApi(session, "property/boards/column/task/create-many", {
        parent: task.id,
        tasks: JSON.stringify(addedValues),
      });
      document.getElementById("subtaskTrigger")?.click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitLoading(false);
      setOpen(false);
      document.getElementById("subtaskTrigger")?.click();
    } catch (e) {
      setSubmitLoading(false);
    }
  };

  const handleDiscard = () => {
    setValue("");
    setData(null);
    setLoading(false);
  };

  const generate = async () => {
    if (deferredValue.trim() == "") {
      toast.error("Please type something", toastStyles);
      return;
    }
    try {
      setAddedValues([]);
      setData(null);
      setLoading(true);
      const res = await fetchRawApi(session, "ai/subtasks", {
        prompt: deferredValue,
      });
      setData(res);
      setLoading(false);

      if (res && res.response && !res.response.error && res.response.subtasks) {
        setAddedValues(res.response.subtasks);
      }
    } catch (e) {
      setLoading(false);
      toast.error(
        "Dysperse AI couldn't generate your tasks! Please try again later",
        toastStyles
      );
    }
  };

  const handleToggle = (generated) => {
    if (addedValues.includes(generated)) {
      setAddedValues(addedValues.filter((e) => e !== generated));
    } else {
      setAddedValues([...new Set([...addedValues, generated])]);
    }
  };
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <>
      <Box>
        <ListItemButton
          disableRipple
          onClick={() => {
            setOpen(true);
            if (deferredValue.trim() !== "") generate();
          }}
          sx={{
            ...taskButtonStyles(session),
          }}
        >
          <Icon
            sx={{
              background:
                "linear-gradient(to right, #8a2387, #e94057, #f27121)",
              backgroundClip: "text",
              fontSize: "33px!important",
              my: -1.5,
              WebkitTextFillColor: "transparent",
            }}
          >
            magic_button
          </Icon>
          <ListItemText
            primary="Create steps for me"
            sx={{
              my: 0,
            }}
          />
        </ListItemButton>
      </Box>
      <SwipeableDrawer
        open={open}
        anchor="right"
        onClose={handleClose}
        PaperProps={{
          sx: {
            height: "100vh",
            maxWidth: "450px",
            width: "100%",
            borderRadius: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            p: 3,
            gap: 2,
            height: "100vh",
            flexDirection: "column",
          }}
        >
          {!data && (
            <Box sx={{ pt: 2 }}>
              <Typography
                gutterBottom
                variant="h6"
                sx={{ display: "flex", gap: 1, alignItems: "center" }}
              >
                <Icon sx={{ mr: 1 }}>auto_awesome</Icon>Dysperse AI
                <Chip
                  variant="outlined"
                  size="small"
                  sx={{ ml: 1 }}
                  label="Experiment"
                />
              </Typography>
              <Typography>
                Dysperse AI can assist you in breaking down your task into
                smaller steps for easier accomplishment.
              </Typography>
            </Box>
          )}
          <TextField
            value={value}
            size="small"
            onKeyDown={(e) => {
              if (e.code == "Enter") generate();
            }}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Task name"
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon className="outlined">auto_awesome</Icon>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {deferredValue && (
                    <IconButton onClick={handleDiscard} disabled={loading}>
                      <Icon>close</Icon>
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
          {loading && (
            <Box
              sx={{
                p: 2,
                borderRadius: 5,
                flexGrow: 1,
                overflow: "scroll",
                height: "auto",
                background: palette[12],
              }}
            >
              <Skeleton width="50%" sx={{ mb: 1 }} animation="wave" />
              {[...new Array(15)].map((_, i) => (
                <Skeleton
                  key={i}
                  width="100%"
                  sx={{ mb: 0.5 }}
                  animation="wave"
                />
              ))}
            </Box>
          )}
          {data &&
            data.response &&
            !data.response.error &&
            data.response.subtasks && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 5,
                  flexGrow: 1,
                  overflow: "scroll",
                  height: "auto",
                  background: palette[12],
                  border: "1px solid",
                  borderColor: palette[2],
                  color: palette[1],
                }}
              >
                <Typography
                  sx={{
                    display: "inline-flex",
                    gap: 2,
                    px: 1,
                    my: 1,
                    fontWeight: 900,
                    alignItems: "center",
                    background: "linear-gradient(45deg, #ff0f7b, #f89b29)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  variant="h6"
                >
                  <Icon>south_east</Icon>Dysperse AI
                </Typography>
                {data.response.subtasks.map((generated) => (
                  <ListItemButton
                    onClick={() => handleToggle(generated)}
                    key={generated}
                    sx={{
                      py: 0,
                      px: 1,
                      alignItems: "start",
                      gap: 2,
                      transition: "none",
                    }}
                  >
                    <Icon
                      sx={{ mt: 1 }}
                      {...(!addedValues.includes(generated) && {
                        className: "outlined",
                      })}
                    >
                      priority
                    </Icon>
                    <ListItemText
                      primary={generated.name}
                      secondary={
                        <Typography variant="body2" sx={{ opacity: 0.6 }}>
                          {generated.description}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                ))}
              </Box>
            )}
          <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
            <Button
              onClick={() => setOpen(false)}
              variant="outlined"
              fullWidth={!data}
              disabled={loading}
            >
              {data ? <Icon>close</Icon> : "Cancel"}
            </Button>
            <LoadingButton
              onClick={generate}
              variant="contained"
              loading={loading}
              fullWidth={!data}
              disabled={deferredValue.trim() == ""}
            >
              {data ? <Icon>refresh</Icon> : "Generate"}
            </LoadingButton>
            {data && (
              <LoadingButton
                loading={submitLoading}
                onClick={handleSubmit}
                variant="contained"
                fullWidth
                disabled={addedValues.length == 0}
                sx={{
                  ...(!submitLoading && {
                    color: "#fff",
                    "&, &:hover": {
                      background:
                        "linear-gradient(45deg, #8a2387, #e94057, #f27121)!important",
                    },
                  }),
                }}
              >
                Continue <Icon>east</Icon>
              </LoadingButton>
            )}
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
