import {
  Alert,
  Box,
  CircularProgress,
  Icon,
  IconButton,
  SwipeableDrawer,
  useMediaQuery,
  useScrollTrigger
} from "@mui/material";
import Head from "next/head";
import { useCallback, useState } from "react";
import { capitalizeFirstLetter } from "../../../lib/client/capitalizeFirstLetter";
import { useApi } from "../../../lib/client/useApi";
import { useDelayedMount } from "../../../lib/client/useDelayedMount";
import { useSession } from "../../../lib/client/useSession";
import { vibrate } from "../../../lib/client/vibration";
import { taskStyles } from "../Layout";
import { Column } from "./Column";
import { BoardInfo } from "./Info";

function RenderBoard({ mutationUrls, board, data, setDrawerOpen }) {
  const [showInfo, setShowInfo] = useState<boolean>(true);

  const trigger = useScrollTrigger({
    threshold: 0,
    target: window ? window : undefined,
  });

  const [currentColumn, setCurrentColumn] = useState<number>(0);
  const handleNext = useCallback(
    () => setCurrentColumn((c) => c + 1),
    [setCurrentColumn]
  );
  const handlePrev = useCallback(
    () => setCurrentColumn((c) => c - 1),
    [setCurrentColumn]
  );

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const mount = useDelayedMount(mobileOpen, 1000);

  return (
    <Box
      sx={{
        scrollSnapType: { xs: "x mandatory", sm: "unset" },
        display: "flex",
        maxWidth: "100vw",
        overflowX: "scroll",
        mt: { xs: -2, sm: 0 },
        height: { sm: "" },
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          bottom: {
            xs: "70px",
            md: "30px",
          },
          opacity: trigger ? 0 : 1,
          transform: trigger ? "scale(0.9)" : "scale(1)",
          mr: {
            xs: 1.5,
            md: 3,
          },
          zIndex: 99,
          background: session.user.darkMode
            ? "hsla(240,11%,14%,0.5)"
            : "rgba(255,255,255,.5)",
          border: "1px solid",
          transition: "transform .2s, opacity .2s",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          borderRadius: 999,
          borderColor: session.user.darkMode
            ? "hsla(240,11%,25%, 0.5)"
            : "rgba(200,200,200, 0.3)",
          right: 0,
          color: session.user.darkMode ? "#fff" : "#000",
          display: { xs: "flex", sm: "none" },
          alignItems: "center",
          p: 0.5,
        }}
      >
        <IconButton
          onClick={handlePrev}
          disabled={currentColumn === 0}
          sx={{
            width: 50,
            borderRadius: 999,
          }}
        >
          <Icon>west</Icon>
        </IconButton>
        <IconButton
          sx={{
            width: 50,
            borderRadius: 999,
          }}
          onClick={handleNext}
          disabled={currentColumn === data.length - 1}
        >
          <Icon>east</Icon>
        </IconButton>
      </Box>
      {!isMobile && (
        <BoardInfo
          setMobileOpen={setMobileOpen}
          setShowInfo={setShowInfo}
          setDrawerOpen={setDrawerOpen}
          board={board}
          showInfo={showInfo}
          mutationUrls={mutationUrls}
        />
      )}
      <SwipeableDrawer
        open={mobileOpen}
        onOpen={() => setMobileOpen(true)}
        onClose={() => setMobileOpen(false)}
        sx={{ zIndex: 999 }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(0px)!important",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            m: "20px",
            maxWidth: "calc(100vw - 40px)!important",
            maxHeight: "calc(100vh - 40px)!important",
          },
        }}
      >
        {isMobile && mount && (
          <BoardInfo
            setMobileOpen={setMobileOpen}
            setShowInfo={setShowInfo}
            setDrawerOpen={setDrawerOpen}
            board={board}
            showInfo={showInfo}
            mutationUrls={mutationUrls}
          />
        )}
      </SwipeableDrawer>
      <IconButton
        size="large"
        onContextMenu={() => {
          vibrate(50);
          setDrawerOpen(true);
        }}
        onClick={() => setMobileOpen(true)}
        sx={taskStyles(session).menu}
      >
        <Icon className="outlined">info</Icon>
      </IconButton>

      {data
        .filter((_, index: number) => index === currentColumn || !isMobile)
        .map((column, index: number) => (
          <Column
            index={index}
            mutationUrls={mutationUrls}
            column={column}
            key={column.id}
            board={board}
          />
        ))}
    </Box>
  );
}

export function Board({ mutationUrl, board, setDrawerOpen }) {
  const { data, url, error } = useApi("property/boards/tasks", {
    id: board.id,
  });

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Yikes! An error occured while trying to load the items in this board.
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>{capitalizeFirstLetter(board.name)} &bull; Board</title>
      </Head>
      <RenderBoard
        data={data}
        mutationUrls={{
          boardData: mutationUrl,
          tasks: url,
        }}
        board={board}
        setDrawerOpen={setDrawerOpen}
      />
    </>
  );
}
