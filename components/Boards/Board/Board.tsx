import {
  Box,
  Button,
  Icon,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";

import { fetchApiWithoutHook, useApi } from "../../../hooks/useApi";
import { colors } from "../../../lib/colors";
import { toastStyles } from "../../../lib/useCustomTheme";
import { ConfirmationModal } from "../../ConfirmationModal";
import { ErrorHandler } from "../../Error";
import { BoardSettings } from "./BoardSettings";
import { Column } from "./Column";
import { CreateColumn } from "./Column/Create";
import { Loading } from "./Loading";

const Renderer = React.memo(function Renderer({ data, url, board }: any) {
  const [currentColumn, setCurrentColumn] = React.useState(0);
  const trigger = useScrollTrigger({
    threshold: 0,
    target: window ? window : undefined,
  });

  const isMobile = useMediaQuery("(max-width: 610px)");

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: trigger ? "10px" : "70px",
          transition: "bottom .3s",
          boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
          border: "1px solid rgba(200,200,200,.3)",
          backdropFilter: "blur(5px)",
          p: 1,
          borderRadius: 9,
          width: "auto",
          left: "50%",
          transform: "translateX(-50%)",
          gap: 0.2,
          background: global.user.darkMode
            ? "hsla(240,11%,25%,.2)"
            : "rgba(255,255,255,.7)",
          zIndex: 999,
          display: (data && data.length === 1) || !isMobile ? "none" : "flex",
        }}
      >
        <Tooltip title="Previous column" placement="top">
          <span>
            <Button
              sx={{
                minWidth: "auto",
                px: 2,
                color:
                  currentColumn <= 0
                    ? global.user.darkMode
                      ? "#ccc"
                      : "#aaa"
                    : global.user.darkMode
                    ? "#fff"
                    : "#000",
              }}
              onClick={() => setCurrentColumn(currentColumn - 1)}
              disabled={currentColumn <= 0}
            >
              <Icon
                sx={{
                  color:
                    currentColumn <= 0
                      ? global.user.darkMode
                        ? "#ccc"
                        : "#aaa"
                      : global.user.darkMode
                      ? "#fff"
                      : "#000",
                }}
              >
                west
              </Icon>
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="New task" placement="top">
          <Button
            sx={{
              color: "#000!important",
              background: colors[themeColor]["A100"] + "!important",
              px: 2,
              minWidth: "auto",
            }}
            onClick={() => document.getElementById("createTask")?.click()}
          >
            <Icon>add</Icon>
          </Button>
        </Tooltip>

        <Tooltip title="Next column" placement="top">
          <span>
            <Button
              sx={{
                minWidth: "auto",
                px: 2,
                color:
                  data && currentColumn >= data.length - 1
                    ? global.user.darkMode
                      ? "#ccc"
                      : "#aaa"
                    : global.user.darkMode
                    ? "#fff"
                    : "#000",
              }}
              onClick={() => setCurrentColumn(currentColumn + 1)}
              disabled={data && currentColumn >= data.length - 1}
            >
              <Icon
                sx={{
                  color:
                    data && currentColumn >= data.length - 1
                      ? global.user.darkMode
                        ? "#ccc"
                        : "#aaa"
                      : global.user.darkMode
                      ? "#fff"
                      : "#000",
                }}
              >
                east
              </Icon>
            </Button>
          </span>
        </Tooltip>
      </Box>
      {data &&
        data
          .filter((_, id) => id === currentColumn || !isMobile)
          .map((column) => (
            <Column
              key={column.id}
              setCurrentColumn={setCurrentColumn}
              tasks={data.map((column) => column.tasks).flat()}
              checkList={board.columns.length === 1}
              mutationUrl={url}
              board={board}
              column={column}
            />
          ))}
    </>
  );
});

export const Board = function Board({
  setDrawerOpen,
  board,
  collapsed,
  mutationUrl,
}: any) {
  const boardSwitcherStyles = {
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: 0.15,
    borderRadius: 2,
    overflow: "hidden",
    maxWidth: "100%",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    px: 1,
    mb: 0.2,
    color: global.user.darkMode ? "hsl(240,11%,80%)" : "#404040",
    cursor: "unset!important",
    userSelect: "none",
    "&:hover": {
      color: global.user.darkMode ? "hsl(240,11%,85%)" : "#303030",
      background: global.user.darkMode
        ? "hsl(240,11%,13%)"
        : "rgba(200,200,200,.3)",
    },
    "&:active": {
      color: global.user.darkMode ? "hsl(240,11%,95%)" : "#000",
      background: global.user.darkMode
        ? "hsl(240,11%,16%)"
        : "rgba(200,200,200,.4)",
    },
  };

  const { data, url, error } = useApi("property/boards/tasks", {
    id: board.id,
  });

  const percent = data
    ? (
        (data
          .map((column) => column.tasks)
          .flat()
          .filter((task) => task.completed).length /
          data.map((column) => column.tasks).flat().length) *
        100
      ).toFixed(0)
    : 0;


  return (
    <Box
      sx={{
        pb: 2,
        ml: { sm: collapsed ? -2 : -1 },
      }}
    >
      <Box
        sx={{
          position: { sm: "sticky" },
          top: "0",
          borderBottom: global.user.darkMode
            ? "1px solid hsla(240,11%,15%)"
            : "1px solid rgba(200,200,200,.3)",
          background: global.user.darkMode
            ? "hsla(240,11%,10%)"
            : "rgba(255,255,255,.7)",
          zIndex: 1,
          p: 2,
          maxWidth: "100vw",
          pt: { xs: 1, sm: 3 },
          px: { xs: 2, sm: 4 },
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "100vw", sm: "100%" },
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <Typography
            tabIndex={0}
            sx={{
              ...boardSwitcherStyles,
              "&:focus-visible": {
                boxShadow: global.user.darkMode
                  ? "0px 0px 0px 1.5px hsl(240,11%,50%) !important"
                  : "0px 0px 0px 1.5px var(--themeDark) !important",
              },
            }}
            variant="h5"
            onClick={() => setDrawerOpen(true)}
          >
            {board.name}
            <Icon
              sx={{
                flexShrink: 0,
                mb: -0.5,
                ml: 1,
              }}
            >
              expand_more
            </Icon>
          </Typography>
        </Box>
    
        <BoardSettings board={board} mutationUrl={mutationUrl} />
      </Box>
      <Box
        sx={{
          overflowX: { sm: "scroll" },
          mt: data && board.columns.length === 1 ? -2 : 4,
          display: "flex",
          gap: { sm: "15px" },
          justifyContent: { xs: "center", sm: "start" },
          maxWidth: "100vw",
          pl: {
            xs: data ? 0 : 2,
            sm: data ? (board.columns.length === 1 ? 0 : 5) : 2,
          },
        }}
        id="taskContainer"
      >
        <Renderer data={data} url={url} board={board} />
        {data && board && board.columns.length !== 1 && (
          <CreateColumn
            setCurrentColumn={(e: any) => e}
            mobile={false}
            id={board.id}
            mutationUrl={url}
            hide={
              (board && board.columns.length === 1) ||
              (data && data.length >= 5)
            }
          />
        )}
        {error && (
          <ErrorHandler error="An error occured while trying to fetch your tasks" />
        )}
        {!data && <Loading />}
      </Box>
    </Box>
  );
};
