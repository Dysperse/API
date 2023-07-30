import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useBackButton } from "@/lib/client/useBackButton";
import { Box, CircularProgress, SwipeableDrawer } from "@mui/material";
import dayjs from "dayjs";
import React, { cloneElement, useCallback, useRef, useState } from "react";
import { toArray } from "react-emoji-render";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";
import { ErrorHandler } from "../../../Error";
import DrawerContent from "./Content";
import { TaskContext } from "./Context";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { addHslAlpha } from "@/lib/client/addHslAlpha";

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
  isDateDependent = false,
  children,
  id,
  mutationUrl,
  onClick,
}: {
  isDateDependent?: boolean;
  children: JSX.Element;
  id: number;
  mutationUrl: string;
  onClick?: any;
}) {
  const palette = useColor(session.themeColor, isDark);
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useBackButton(() => setOpen(false));
  const ref: any = useRef();
  const session = useSession();

  /**
   * Fetch task data
   * @param {boolean} mutate - Hides the loader if this is set to true
   */
  const handleFetch = useCallback(
    async (mutate = false) => {
      setOpen(true);
      if (!mutate) setLoading(true);
      try {
        const data = await fetchRawApi(session, "property/boards/column/task", {
          id,
        });
        setData(data);
        setError(null);
        setLoading(false);
        if (!mutate) ref.current.scrollTop = 0;
      } catch (e: any) {
        setLoading(false);
        setError(e.message);
      }
    },
    [id, session]
  );

  const handleDelete = useCallback(
    async function handleDelete(taskId) {
      setData("deleted");
      await fetchRawApi(session, "property/boards/column/task/delete", {
        id: taskId,
      });
      handleFetch(true);
      mutate(mutationUrl);
    },
    [mutationUrl, setData, handleFetch, session]
  );

  useHotkeys(
    "delete",
    () => {
      handleDelete(id);
      setOpen(false);
    },
    [id]
  );

  // Callback function when drawer is closed
  const handleClose = useCallback(() => {
    setOpen(false);
    mutate(mutationUrl);
  }, [mutationUrl]);

  const handleEdit = useCallback(
    function handleEdit(id, key, value) {
      setData((prev) => ({ ...prev, [key]: value }));
      fetchRawApi(session, "property/boards/column/task/edit", {
        id,
        date: dayjs().toISOString(),
        [key]: [value],
      }).then(() => handleFetch(true));
    },
    [setData, session, handleFetch]
  );

  // Attach the `onClick` handler to the trigger
  const trigger = cloneElement(children, {
    onClick: onClick || handleFetch,
  });

  return (
    <TaskContext.Provider
      value={{
        ...data,
        set: setData,
        edit: handleEdit,
        close: handleClose,
        mutate: () => handleFetch(true),
      }}
    >
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        anchor="right"
        PaperProps={{
          sx: {
            maxWidth: "500px",
            width: "100%",
            background: addHslAlpha(palette[1], 0.6),
            height: "100vh",
            backdropFilter: "blur(10px)",
          },
          ref,
        }}
      >
        {open && !loading && error && (
          <Box sx={{ p: 3, pt: { xs: 0, sm: 3 } }}>
            <ErrorHandler error="Oh no! An error occured while trying to get this task's information. Please try again later or contact support" />
          </Box>
        )}
        {loading && !data && open && (
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Box
          sx={{
            opacity: loading ? 0.5 : 1,
            transition: "all .2s",
          }}
        >
          {data && data !== "deleted" && (
            <DrawerContent
              handleDelete={handleDelete}
              isDateDependent={isDateDependent}
              handleParentClose={handleClose}
            />
          )}
        </Box>
      </SwipeableDrawer>
    </TaskContext.Provider>
  );
});
