import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import React, { useEffect, useState } from "react";
import { ErrorHandler } from "../error";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { Board } from "./Board";
import { CreateBoard } from "./CreateBoard";
import { mutate } from "swr";
import toast from "react-hot-toast";

import {
  Box,
  Button,
  Menu,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const Tab = React.memo(function ({
  mutationUrl,
  styles,
  activeTab,
  setActiveTab,
  emblaApi,
  board,
}: any) {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(board.name);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!editMode) event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            setEditMode(true);
            setTimeout(() => {
              document.getElementById("renameInput" + board.id)?.focus();
            }, 100);
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={async () => {
            if (!confirm("Delete board?")) return;
            try {
              setLoading(true);
              await fetchApiWithoutHook("property/boards/deleteBoard", {
                id: board.id,
              });
              await mutate(mutationUrl);
              setLoading(false);
              handleClose();
            } catch (e) {
              toast.error("An error occurred while deleting the board");
            }
          }}
          sx={{
            display: "flex",
            minWidth: "100px",
          }}
        >
          Delete board
          <CircularProgress
            size={15}
            sx={{
              ml: "auto",
              opacity: loading ? 1 : 0,
            }}
          />
        </MenuItem>
      </Menu>
      <Button
        size="large"
        disableElevation
        onContextMenu={handleClick}
        onClick={(e) => {
          if (emblaApi) {
            emblaApi.reInit({
              containScroll: "keepSnaps",
              dragFree: true,
            });
          }
          if (activeTab === board.id && !editMode) {
            handleClick(e);
          } else {
            setActiveTab(board.id);
          }
        }}
        sx={{
          ...styles(activeTab === board.id),
          gap: 2,
        }}
      >
        {!editMode ? (
          <Box
            sx={{
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span
              className={
                activeTab === board.id
                  ? "material-symbols-rounded"
                  : "material-symbols-outlined"
              }
            >
              {board.columns.length == 1 ? "task_alt" : "view_kanban"}
            </span>
            {board.name}
          </Box>
        ) : (
          <input
            id={"renameInput" + board.id}
            onBlur={async () => {
              setEditMode(false);
              if (title !== board.name && title.trim() !== "") {
                toast.promise(
                  fetchApiWithoutHook("property/boards/renameBoard", {
                    id: board.id,
                    name: title,
                  }).then(() => mutate(mutationUrl)),
                  {
                    loading: "Renaming...",
                    success: "Renamed board",
                    error: "An error occurred while renaming the board",
                  }
                );
              }
            }}
            style={{
              outline: 0,
              border: 0,
              background: colors[themeColor][600],
              boxShadow: "0px 0px 0px 5px " + colors[themeColor][600],
              fontWeight: "500",
              fontSize: "15px",
              borderRadius: 9,
              color: "#fff",
              width: title.length + "ch",
              minWidth: "100px",
            }}
            placeholder="Board title"
            value={title}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
              if (e.key === "Escape") {
                setEditMode(false);
                setTitle(board.name);
              }
            }}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}
        {activeTab === board.id && (
          <span className="material-symbols-outlined">more_vert</span>
        )}
      </Button>
    </div>
  );
});

export function TasksLayout() {
  const { data, url, error } = useApi("property/boards");
  const [activeTab, setActiveTab] = useState(
    data && data[0] ? data[0].id : "new"
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      containScroll: "keepSnaps",
      dragFree: true,
    },
    [WheelGesturesPlugin()]
  );

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit({
        containScroll: "keepSnaps",
        dragFree: true,
      });
    }
    if (data && data[0]) {
      setActiveTab(data[0].id);
    }
  }, [data]);

  const styles = (condition) => ({
    transition: "none!important",
    px: 3,
    gap: 1.5,
    borderRadius: 4,
    mr: 1,
    fontSize: "15px",
    whiteSpace: "nowrap",
    ...(global.user.darkMode && {
      color: "hsl(240,11%, 80%)",
    }),
    "&:hover, &:focus": {
      background: global.user.darkMode ? "hsl(240,11%,15%)" : "#eee!important",
    },
    ...(condition && {
      background: global.user.darkMode
        ? "hsl(240,11%,20%)!important"
        : colors[themeColor][700] + "!important",
      "&:hover, &:focus": {
        background: global.user.darkMode
          ? "hsl(240,11%,25%)!important"
          : colors[themeColor][900] + "!important",
      },
      color: global.user.darkMode
        ? "hsl(240,11%,95%)!important"
        : colors[themeColor][50] + "!important",
    }),
  });

  return (
    <Box sx={{ mb: 5 }}>
      {error && (
        <ErrorHandler error="An error occurred while loading your tasks" />
      )}
      <Box
        ref={emblaRef}
        sx={{
          maxWidth: { xs: "100vw", sm: "calc(100vw - 85px)" },
        }}
      >
        <Box className="embla__container" sx={{ pl: 4 }}>
          {data &&
            data.map((board) => (
              <Tab
                styles={styles}
                activeTab={activeTab}
                board={board}
                emblaApi={emblaApi}
                setActiveTab={setActiveTab}
                mutationUrl={url}
              />
            ))}
          <Box>
            <Button
              size="large"
              disableElevation
              onClick={() => {
                setActiveTab("new");
                emblaApi?.reInit({
                  containScroll: "keepSnaps",
                  dragFree: true,
                });
              }}
              sx={{
                ...styles(activeTab === "new"),
                px: 2,
                gap: 2,
              }}
            >
              <span className="material-symbols-rounded">add_circle</span>Create
            </Button>
          </Box>
        </Box>
      </Box>

      <Box>
        {activeTab === "new" && (
          <CreateBoard emblaApi={emblaApi} mutationUrl={url} />
        )}
      </Box>
      {data &&
        data.map((board) => activeTab === board.id && <Board board={board} />)}
    </Box>
  );
}
