import {
  Box,
  Button,
  Icon,
  Tooltip,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";
import { useApi } from "../../../hooks/useApi";
import { ErrorHandler } from "../../Error";
import { Column } from "./Column";
import { Loading } from "./Loading";
const BoardSettings = dynamic(() => import("./BoardSettings"));
const CreateColumn = dynamic(() => import("./Column/Create"));

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
          opacity: trigger ? 0 : 1,
          transform: trigger ? "scale(0.9)" : "scale(1)",
          transition: "transform .2s, opacity .2s",
          boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
          border: "1px solid",
          borderColor: global.user.darkMode
            ? "hsla(240,11%,30%, 0.5)"
            : "rgba(200,200,200, 0.5)",
          backdropFilter: "blur(5px)",
          p: 1,
          borderRadius: 9,
          width: "auto",
          right: 0,
          mr: 3,
          gap: 0.2,
          background: global.user.darkMode
            ? "hsla(240,11%,25%,.2)"
            : "rgba(255,255,255,.7)",
          zIndex: 999,
          bottom: {
            xs: "70px",
            sm: "30px",
          },
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
  mutationUrl,
}: any) {
  const { data, url, error } = useApi("property/boards/tasks", {
    id: board.id,
  });

  return (
    <>
      <Box
        sx={{
          position: {
            xs: "sticky",
            sm: "fixed",
          },
          right: { sm: 0 },
          top: { xs: "var(--navbar-height)", sm: "0" },
          borderBottom: {
            xs: global.user.darkMode
              ? "1px solid hsla(240,11%,15%)"
              : "1px solid rgba(200,200,200,.3)",
            sm: "unset",
          },
          zIndex: 999,
          background: {
            xs: global.user.darkMode
              ? "hsla(240,11%,10%)"
              : "rgba(255,255,255,.7)",
            sm: "transparent",
          },
          maxWidth: "100vw",
          p: 1,
          mt: { xs: -4, sm: 0 },
          px: 3,
          backdropFilter: {
            xs: "blur(10px)",
            sm: "none",
          },
          alignItems: "center",
          display: "flex",
          gap: 1,
        }}
      >
        <Button
          size="small"
          onClick={() => setDrawerOpen(true)}
          sx={{
            fontWeight: "700",
            color: global.user.darkMode ? "#fff" : "#000",
            display: { sm: "none" },
            fontSize: "15px",
          }}
        >
          {board.name}
          <Icon>expand_more</Icon>
        </Button>
        <BoardSettings board={board} mutationUrl={mutationUrl} />
      </Box>
      <Box
        sx={{
          overflowX: { xs: "hidden", sm: "scroll" },
          overflowY: "hidden",
          display: "flex",
          justifyContent: { xs: "center", sm: "start" },
          maxWidth: "100vw",
          height: { sm: "100vh" },
          maxHeight: { sm: "100vh" },
          position: { sm: "relative" },
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
    </>
  );
};
