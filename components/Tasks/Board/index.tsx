import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useDelayedMount } from "@/lib/client/useDelayedMount";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Icon,
  SwipeableDrawer,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { mutate } from "swr";
import { Column } from "./Column";
import { BoardInfo } from "./Info";

function RenderBoard({ mutationUrls, board, data, isShared }) {
  const [showInfo, setShowInfo] = useState<boolean | null>(null);
  const [useReverseAnimation, setUseReverseAnimation] = useState(false);

  useEffect(() => {
    const storedShowInfo = localStorage.getItem("showInfo");
    // if it does not exist in the first place, set it to true
    if (storedShowInfo === null) {
      setShowInfo(true);
      localStorage.setItem("showInfo", "true");
    }
    if (storedShowInfo !== null) {
      // Only set the value if it's not already present in the local storage
      setShowInfo(storedShowInfo === "true");
    }
  }, []);

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

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  return (
    <Box
      sx={{
        scrollSnapType: { xs: "x mandatory", sm: "unset" },
        display: "flex",
        maxWidth: "100%",
        overflowX: "scroll",
        minHeight: "100vh",
      }}
    >
      {!isMobile && (
        <BoardInfo
          isShared={isShared}
          setMobileOpen={setMobileOpen}
          setShowInfo={setShowInfo}
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
            ...(!isDark && { background: "#fff" }),
          },
        }}
      >
        {isMobile && mount && (
          <BoardInfo
            isShared={isShared}
            setMobileOpen={setMobileOpen}
            setShowInfo={setShowInfo}
            board={board}
            showInfo={showInfo}
            mutationUrls={mutationUrls}
          />
        )}
      </SwipeableDrawer>
      <div
        onClick={() => setMobileOpen(true)}
        style={{ display: "none" }}
        id="boardInfoTrigger"
      />

      {data
        .filter((_, index: number) => index === currentColumn || !isMobile)
        .map((column, index: number) => (
          <Column
            index={index}
            mutateData={mutateData}
            mutationUrls={mutationUrls}
            currentColumn={currentColumn}
            columnLength={data.length}
            setCurrentColumn={setCurrentColumn}
            
            useReverseAnimation={useReverseAnimation}
            setUseReverseAnimation={setUseReverseAnimation}
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

export function Board({ mutationUrl, board }) {
  const { data, url, error, loading } = useApi("property/boards/tasks", {
    id: board?.id,
  });

  const session = useSession();
  const isShared = data && data[0].propertyId !== session.property.propertyId;

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
        isShared={isShared}
        data={data}
        mutationUrls={{
          boardData: mutationUrl,
          tasks: url,
        }}
        board={board}
      />
    </>
  );
}
