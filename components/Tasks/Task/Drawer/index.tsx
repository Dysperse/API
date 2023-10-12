import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useBackButton } from "@/lib/client/useBackButton";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  CircularProgress,
  SwipeableDrawer,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import React, { cloneElement, useCallback, useRef, useState } from "react";
import { toArray } from "react-emoji-render";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";
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
  isDisabled = false,
  children,
  id,
  mutateList,
  onClick,
  recurringInstance = new Date(),
}: {
  isDisabled?: boolean;
  children: JSX.Element;
  id: number;
  mutateList: any;
  onClick?: any;
  recurringInstance?: Date;
}) {
  const { session } = useSession();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [open, setOpen] = useState<boolean>(false);
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  useBackButton(() => setOpen(false));
  const ref: any = useRef();

  const {
    data,
    isLoading: loading,
    mutate: mutateTask,
    error,
  } = useSWR([!open ? null : "property/boards/column/task", { id }]);

  const handleDelete = useCallback(
    async function handleDelete(taskId) {
      try {
        setOpen(false);
        await fetchRawApi(session, "property/boards/column/task/delete", {
          id: taskId,
        });
        mutateList();
        mutateTask();
      } catch (e: any) {
        toast.error(e.message);
      }
    },
    [mutateList, session, setOpen, mutateTask]
  );

  useHotkeys(
    "delete",
    () => {
      if (!open) return;
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
    mutateTask();
    mutateList();
  }, [mutateTask, mutateList]);

  const handleEdit = useCallback(
    async function handleEdit(id, key, value) {
      const newData = {
        ...data,
        [key]: value,
        lastUpdated: dayjs().toISOString(),
      };

      mutateTask(newData, {
        populateCache: newData,
        revalidate: false,
      });

      return await fetchRawApi(session, "property/boards/column/task/edit", {
        id,
        date: dayjs().toISOString(),
        [key]: String(value),
        createdBy: session.user.email,
      }).then(() => mutateList());
    },
    [session, data, mutateTask, mutateList]
  );

  let clickCount = 0;
  let timer;

  const handleSingleClick = () => {
    // Handle the single click logic here
    timer = setTimeout(() => {
      onClick && onClick();
      if (!onClick) setOpen(true);
      toast.dismiss();
      clickCount = 0;
    }, 200);
  };

  const handleDoubleClick = () => {
    // Handle the double click logic here
    clearTimeout(timer);
    // document.getElementById("createSubTask")?.click();
  };

  // Attach the `onClick` handler to the trigger
  const trigger = cloneElement(children, {
    onClick: () => {
      clickCount++;
      if (clickCount === 1) {
        handleSingleClick();
      } else if (clickCount === 2) {
        handleDoubleClick();
        clickCount = 0; // Reset the click count
      }
    },
  });

  return (
    <TaskContext.Provider
      value={{
        ...data,
        set: (newObj, options = {}) => mutateTask(newObj, options),
        edit: handleEdit,
        close: handleClose,
        mutate: mutateTask,
        recurringInstance,
      }}
    >
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        anchor={isMobile ? "bottom" : "right"}
        PaperProps={{
          sx: {
            maxWidth: "500px",
            boxShadow: "0 0 1px rgba(0, 0, 0, 0.05)!important",
            width: "100%",
            ...(isMobile
              ? {
                  height: "calc(100dvh - 150px)",
                  borderRadius: "20px 20px 0 0",
                  background: palette[2],
                }
              : {
                  height: "100dvh",
                }),
            borderLeft: { sm: `2px solid ${addHslAlpha(palette[3], 0.7)}` },
          },
          onScroll: () => {
            // ref.current.style.display = "none";
            // ref.current.offsetHeight; // no need to store this anywhere, the reference is enough
            // ref.current.style.display = "";
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
              parentRef={ref}
              isDisabled={isDisabled}
              handleDelete={handleDelete}
            />
          )}
        </Box>
      </SwipeableDrawer>
    </TaskContext.Provider>
  );
});
