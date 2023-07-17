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
  IconButton,
  SwipeableDrawer,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import { createContext, useContext, useEffect, useState } from "react";
import { mutate } from "swr";
import { Column } from "./Column";
import { BoardInfo } from "./Info";

export const BoardContext = createContext<null | any>(null);
export const ColumnContext = createContext<null | any>(null);

function RenderBoard({ tasks }) {
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
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const mount = useDelayedMount(mobileOpen, 1000);

  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode),
  );

  const isDark = useDarkMode(session.darkMode);

  const { board } = useContext(BoardContext);

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
          setMobileOpen={setMobileOpen}
          setShowInfo={setShowInfo}
          showInfo={showInfo}
        />
      )}
      <SwipeableDrawer
        open={mobileOpen}
        disableSwipeToOpen={false}
        onClose={() => setMobileOpen(false)}
        onOpen={() => setMobileOpen(true)}
        ModalProps={{ keepMounted: true }}
        keepMounted
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
            setMobileOpen={setMobileOpen}
            setShowInfo={setShowInfo}
            showInfo={showInfo}
          />
        )}
      </SwipeableDrawer>
      <div
        onClick={() => setMobileOpen(true)}
        style={{ display: "none" }}
        id="boardInfoTrigger"
      />

      {tasks
        .filter((_, index: number) => index === currentColumn || !isMobile)
        .map((column) => (
          <ColumnContext.Provider
            value={{
              column,
              length: tasks.length,
              columnLength: board.columns.length,
              navigation: {
                current: currentColumn,
                setCurrent: setCurrentColumn,
              },
            }}
            key={column.id}
          >
            <Column
              setMobileOpen={setMobileOpen}
              useReverseAnimation={useReverseAnimation}
              setUseReverseAnimation={setUseReverseAnimation}
            />
          </ColumnContext.Provider>
        ))}
      <Box
        sx={{
          height: { sm: "100vh" },
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
          px: 4,
        }}
      >
        <IconButton
          sx={{
            cursor: "default",
            background: palette[3],
          }}
          onClick={() => {
            setMobileOpen(true);
            document.getElementById("newColumn")?.click();
          }}
        >
          <Icon>add</Icon>
        </IconButton>
      </Box>
      {tasks.length == 0 && (
        <Box
          sx={{
            display: "flex",
            height: "100vh",
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
  const isShared =
    data &&
    data?.[0]?.propertyId &&
    data?.[0]?.propertyId !== session.property.propertyId;

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

  const mutateData = async () => {
    await mutate(mutationUrl);
    await mutate(url);
  };

  return (
    <>
      <Head>
        <title>{capitalizeFirstLetter(board.name)} &bull; Board</title>
      </Head>
      <BoardContext.Provider
        value={{
          board,
          isShared,
          mutateData,
          mutationUrls: {
            boardData: mutationUrl,
            tasks: url,
          },
        }}
      >
        <RenderBoard tasks={data} />
      </BoardContext.Provider>
    </>
  );
}
