import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Icon,
  IconButton,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
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

  const [currentColumn, setCurrentColumn] = useState<number>(-1);

  const { session } = useSession();
  const isMobile = useMediaQuery("(max-width: 900px)");

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const isDark = useDarkMode(session.darkMode);

  const { board, permissions } = useContext(BoardContext);

  useEffect(() => {
    if (board.integrations.length > 0 && board.columns.length === 0) {
      setCurrentColumn(-1);
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
        height: { sm: "100dvh" },
        pt: { xs: "var(--navbar-height)", sm: 0 },
        overflowY: { sm: "hidden" },
      }}
    >
      {!isMobile && (
        <BoardInfo
          setCurrentColumn={setCurrentColumn}
          setShowInfo={setShowInfo}
          showInfo={showInfo}
        />
      )}
      {currentColumn === -1 && isMobile && (
        <BoardInfo
          setCurrentColumn={setCurrentColumn}
          setShowInfo={() => {}}
          showInfo={true}
        />
      )}
      <div
        onClick={() => setCurrentColumn(-1)}
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
              useReverseAnimation={useReverseAnimation}
              setUseReverseAnimation={setUseReverseAnimation}
            />
          </ColumnContext.Provider>
        ))}
      {!isMobile && board.wallpaper && (
        <Box
          sx={{
            width: "340px",
            flex: "0 0 340px",
            height: "100dvh",
            "& img": {
              height: "100%",
              width: "100%",
              objectFit: "cover",
            },
          }}
        >
          <img
            src={
              board.wallpaper +
              (board.wallpaper ===
              "https://source.unsplash.com/random/1080x1920"
                ? "&cache=" + new Date().toISOString()
                : "")
            }
            alt="Wallpaper"
          />
        </Box>
      )}
      <Box
        sx={{
          height: { sm: "100dvh" },
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
          px: 4,
          ...(board.wallpaper && {
            width: "340px",
            flex: "0 0 340px",
            ml: "-340px",
          }),
        }}
      >
        {permissions !== "read" && (
          <IconButton
            sx={{
              cursor: "default",
              background: palette[3],
              ...(board.wallpaper && {
                background: `${addHslAlpha(palette[8], 0.1)} !important`,
                backdropFilter: "blur(3px)",
              }),
            }}
            onClick={() => {
              router.push("/tasks/boards/edit/" + board.id + "#columns");
            }}
          >
            <Icon
              sx={{
                fontSize: "30px",
              }}
            >
              add
            </Icon>
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
                setCurrentColumn(-1);
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
export type BoardFilterInput = "" | "a-z" | "z-a" | "due-asc" | "due-desc";

export function Board({ mutate, board }) {
  const [filter, setFilter] = useState<BoardFilterInput>("");

  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const {
    data,
    error,
    isLoading: loading,
    mutate: mutateTasks,
  } = useSWR([
    "property/boards/tasks",
    {
      id: board?.id,
      filter,
    },
  ]);

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
          display: "flex",
          px: 4.5,
          mt: 6,
          pt: "var(--navbar-height)",
        }}
      >
        <Box sx={{ mt: "auto" }}>
          <AvatarGroup max={6} sx={{ my: 1, justifyContent: "start" }}>
            {[...new Array(4)].map((_, i) => (
              <Avatar
                key={i}
                sx={{
                  width: "40px",
                  borderRadius: 999,
                }}
              >
                <Skeleton variant="circular" width={40} height={40} />
              </Avatar>
            ))}
          </AvatarGroup>
          <Skeleton variant="rectangular" height={60} sx={{ width: "100%" }} />
        </Box>
      </Box>
    );
  }

  const mutateData = async () => {
    await mutate();
    await mutateTasks();
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
          filter,
          setFilter,
        }}
      >
        <RenderBoard tasks={data} />
      </BoardContext.Provider>
    </>
  );
}
