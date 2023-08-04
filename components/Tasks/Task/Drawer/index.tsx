import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useBackButton } from "@/lib/client/useBackButton";
import {
  Box,
  CircularProgress,
  SwipeableDrawer,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import React, { cloneElement, useCallback, useRef, useState } from "react";
import { toArray } from "react-emoji-render";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";
import { ErrorHandler } from "../../../Error";
import DrawerContent from "./Content";
import { TaskContext } from "./Context";

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
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useBackButton(() => setOpen(false));
  const ref: any = useRef();

  /**
   * Fetch task data
   * @param {boolean} mutate - Hides the loader if this is set to true
   */
  const handleFetch = useCallback(
    async (mutate = false) => {
      if (!mutate) {
        setLoading(true);
      }
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
      setOpen(false);
      await fetchRawApi(session, "property/boards/column/task/delete", {
        id: taskId,
      });
      handleFetch(true);
      mutate(mutationUrl);
    },
    [mutationUrl, setData, handleFetch, session, setOpen]
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
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
    setOpen(false);
    mutate(mutationUrl);
  }, [mutationUrl]);

  const handleEdit = useCallback(
    async function handleEdit(id, key, value) {
      setData((prev) => ({ ...prev, [key]: value }));
      return await fetchRawApi(session, "property/boards/column/task/edit", {
        id,
        date: dayjs().toISOString(),
        [key]: [value],
      }).then(() => handleFetch(true));
    },
    [setData, session, handleFetch]
  );

  // Attach the `onClick` handler to the trigger
  const trigger = cloneElement(children, {
    onClick: () => {
      (onClick || handleFetch)();
      setOpen(true);
    },
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
        {...(isMobile && {
          slotProps: {
            backdrop: {
              sx: { opacity: "0!important" },
            },
          },
        })}
        PaperProps={{
          sx: {
            maxWidth: "500px",
            width: "100%",
            height: "100dvh",
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
              height: "100dvh",
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
