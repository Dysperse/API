import { Alert, CircularProgress, SwipeableDrawer } from "@mui/material";
import { Box } from "@mui/system";
import React, { cloneElement, useCallback, useState } from "react";
import { toArray } from "react-emoji-render";
import { mutate } from "swr";
import { fetchRawApi } from "../../../../../lib/client/useApi";
import { useBackButton } from "../../../../../lib/client/useBackButton";
import { ErrorHandler } from "../../../../Error";
import { Puller } from "../../../../Puller";
import DrawerContent from "./DrawerContent";

export const parseEmojis = (value) => {
  const emojisArray = toArray(value);

  // toArray outputs React elements for emojis and strings for other
  const newValue = emojisArray.reduce((previous: any, current: any) => {
    if (typeof current === "string") {
      return previous + current;
    }
    return previous + current.props.children;
  }, "");

  return newValue;
};

export const TaskDrawer = React.memo(function TaskDrawer({
  isAgenda = false,
  children,
  id,
  mutationUrl,
}: {
  isAgenda?: boolean;
  children: JSX.Element;
  id: number;
  mutationUrl: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useBackButton(() => setOpen(false));

  // Fetch data when the trigger is clicked on
  const handleOpen = useCallback(async () => {
    setOpen(true);
    setLoading(true);
    try {
      const data = await fetchRawApi("property/boards/column/task", {
        id,
      });
      setData(data);
      setLoading(false);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }, [id]);

  // Callback function when drawer is closed
  const handleClose = useCallback(() => {
    setOpen(false);
    mutate(mutationUrl);
  }, [mutationUrl]);

  // Attach the `onClick` handler to the trigger
  const trigger = cloneElement(children, {
    onClick: handleOpen,
  });

  // Some basic drawer styles
  const drawerStyles = {
    width: "100vw",
    maxWidth:
      data && data !== "deleted" && data.parentTasks.length == 1
        ? "600px"
        : "650px",
    maxHeight: "80vh",
  };

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen
        anchor="bottom"
        PaperProps={{ sx: drawerStyles }}
      >
        <Puller />
        <Box sx={{ p: { xs: 3, sm: 5 }, pt: 0 }}>
          {error && (
            <ErrorHandler error="Oh no! An error occured while trying to get this task's information. Please try again later or contact support" />
          )}
          {loading && (
            <Box
              sx={{
                textAlign: "center",
                py: 30,
              }}
            >
              <CircularProgress
                disableShrink
                sx={{ animationDuration: "0.5s" }}
              />
            </Box>
          )}
          {data && !loading && data !== "deleted" && (
            <DrawerContent
              handleParentClose={handleClose}
              isAgenda={isAgenda}
              data={data}
              mutationUrl={mutationUrl}
              setTaskData={setData}
            />
          )}
          {data == "deleted" && (
            <Alert severity="info" icon="💥">
              This task has &quot;mysteriously&quot; vanished into thin air
            </Alert>
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
});
