import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useApi } from "@/lib/client/useApi";
import { useColor } from "@/lib/client/useColor";
import { useDelayedMount } from "@/lib/client/useDelayedMount";
import { useSession } from "@/lib/client/useSession";
import { vibrate } from "@/lib/client/vibration";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  SwipeableDrawer,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import Head from "next/head";
import { useCallback, useState } from "react";
import { mutate } from "swr";
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

  const mutateData = async () => {
    await mutate(mutationUrls.tasks);
    await mutate(mutationUrls.boardData);
  };
  const palette = useColor(session.themeColor, session.user.darkMode);

  return (
    <Box
      sx={{
        scrollSnapType: { xs: "x mandatory", sm: "unset" },
        display: "flex",
        maxWidth: "100vw",
        overflowX: "scroll",
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
          background: addHslAlpha(palette[3], 0.9),
          border: "1px solid",
          transition: "transform .2s, opacity .2s",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          borderRadius: 999,
          borderColor: addHslAlpha(palette[3], 0.5),
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
        ModalProps={{ keepMounted: true }}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ zIndex: 999, display: { sm: "none" } }}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            m: "20px",
            width: "calc(100vw - 40px)!important",
            maxWidth: "400px",
            maxHeight: "calc(100vh - 40px)!important",
            ...(!session.user.darkMode && { background: "#fff" }),
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
        sx={taskStyles(palette).menu}
      >
        <Icon className="outlined">info</Icon>
      </IconButton>

      {data
        .filter((_, index: number) => index === currentColumn || !isMobile)
        .map((column, index: number) => (
          <Column
            index={index}
            mutateData={mutateData}
            mutationUrls={mutationUrls}
            column={column}
            key={column.id}
            board={board}
          />
        ))}
      {data.length == 0 && (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => {
              setMobileOpen(true);
              document.getElementById("newColumn")?.click();
            }}
            variant="contained"
            size="large"
            sx={{ px: 2 }}
          >
            <Icon>add</Icon>New column
          </Button>
        </Box>
      )}
    </Box>
  );
}

export function Board({ mutationUrl, board, setDrawerOpen }) {
  const { data, url, error, loading } = useApi("property/boards/tasks", {
    id: board?.id,
  });

  if (error || (!board && !loading)) {
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
