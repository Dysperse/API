import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
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
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { Column } from "./Column";
import { BoardInfo } from "./Info";

export const BoardContext = createContext<null | any>(null);
export const ColumnContext = createContext<null | any>(null);

function RenderBoard({ tasks }) {
  const router = useRouter();
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

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const isDark = useDarkMode(session.darkMode);

  const { board, permissions } = useContext(BoardContext);

  useEffect(() => {
    if (board.integrations.length > 0 && board.columns.length === 0) {
      setMobileOpen(true);
      setTimeout(() => {
        document.getElementById("syncChip")?.click();
      }, 200);
    }
  }, [board]);

  return (
    <Box
      sx={{
        scrollSnapType: { xs: "x mandatory", sm: "unset" },
        display: "flex",
        maxWidth: "100%",
        overflowX: "scroll",
        minHeight: "100dvh",
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
            maxHeight: "calc(100dvh - 40px)!important",
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
          height: { sm: "100dvh" },
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
          px: 4,
        }}
      >
        {permissions !== "read" && (
          <IconButton
            sx={{
              cursor: "default",
              background: palette[3],
            }}
            onClick={() => {
              router.push("/tasks/boards/edit/" + board.id + "#columns");
            }}
          >
            <Icon>add</Icon>
          </IconButton>
        )}
      </Box>
      {tasks.length == 0 && permissions !== "read" && (
        <Box
          sx={{
            display: "flex",
            height: "100dvh",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {board.integrations.length > 0 ? (
            <Button
              onClick={() => {
                setMobileOpen(true);
                setTimeout(() => {
                  document.getElementById("syncChip")?.click();
                }, 200);
              }}
              variant="contained"
              size="large"
              sx={{ px: 2 }}
            >
              <Icon>refresh</Icon>Resync
            </Button>
          ) : (
            <Button
              onClick={() => {
                router.push("/tasks/boards/edit/" + board.id + "#columns");
              }}
              variant="contained"
              size="large"
              sx={{ px: 2 }}
            >
              <Icon>add</Icon>New column
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}

export function Board({ mutate, board }) {
  const url = "";
  const {
    data,
    error,
    isLoading: loading,
  } = useSWR([
    "property/boards/tasks",
    {
      id: board?.id,
    },
  ]);

  const session = useSession();
  const isShared =
    data &&
    data?.[0]?.propertyId &&
    data?.[0]?.propertyId !== session.property.propertyId;

  const readOnly =
    board?.shareTokens?.find((s) => s.user.email === session.user.email)
      ?.readOnly ?? false;

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Yikes! Something went wrong trying to load the items in this board.
        </Alert>
      </Box>
    );
  }
  if (!board && !loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert
          severity="error"
          icon={
            <img
              src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62d.png"
              alt="Crying emoji"
              width={30}
            />
          }
        >
          You don&apos;t have access to this board? Contact the owner if you
          think this is a mistake.
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100dvh",
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
    await mutate();
    // await mutate(url);
  };

  return (
    <>
      <Head>
        <title>{capitalizeFirstLetter(board.name)} &bull; Board</title>
      </Head>
      <BoardContext.Provider
        value={{
          board,
          permissions: readOnly ? "read" : "edit",
          isShared,
          mutateData,
          mutationUrls: {
            boardData: "",
            tasks: url,
          },
        }}
      >
        <RenderBoard tasks={data} />
      </BoardContext.Provider>
    </>
  );
}
