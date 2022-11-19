import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useEffect, useState } from "react";
import { ErrorHandler } from "../error";
import { useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { Board } from "./Board";
import { CreateBoard } from "./CreateBoard";
import { useRouter } from "next/router";

export function TasksLayout() {
  const { data, url, error } = useApi("property/boards");
  const [activeTab, setActiveTab] = useState(data ? data[0].id : "new");
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      containScroll: "keepSnaps",
      dragFree: true,
    },
    [WheelGesturesPlugin()]
  );

  const router = useRouter();

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit({
        loop: false,
        containScroll: "keepSnaps",
        dragFree: true,
      });
    }
    const boardId = router.query.boardId;

    if (data && boardId) {
      const board = data.find((board) => (board.id === boardId ? boardId : ""));
      if (board) {
        alert(1);
        setActiveTab(board.id);
      }
    } else if (data) {
      setActiveTab(data[0].id);
      router.push(`/tasks/${data[0].id}`);
    } else if ((data && !data[0]) || error) {
      setActiveTab("new");
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
    "&:hover, &:focus": {
      background: "#eee!important",
    },
    ...(condition && {
      background: colors[themeColor][700] + "!important",
      "&:hover, &:focus": {
        background: colors[themeColor][900] + "!important",
      },
      color: colors[themeColor][50] + "!important",
    }),
  });

  return (
    <Box>
      {error && (
        <ErrorHandler error="An error occurred while loading your tasks" />
      )}
      <Box
        ref={emblaRef}
        sx={{
          maxWidth: { sm: "calc(100vw - 85px)" },
        }}
      >
        <Box className="embla__container" sx={{ pl: 4 }}>
          {data &&
            data.map((board) => (
              <div>
                <Button
                  size="large"
                  disableElevation
                  onClick={() => {
                    router.push(`/tasks/${board.id}`);
                    if (emblaApi) {
                      emblaApi.reInit({
                        loop: false,
                        containScroll: "keepSnaps",
                        dragFree: true,
                      });
                    }
                    if (activeTab === board.id) {
                    } else {
                      setActiveTab(board.id);
                    }
                  }}
                  sx={styles(activeTab === board.id)}
                >
                  {board.name}
                  {activeTab === board.id && (
                    <span className="material-symbols-outlined">
                      expand_circle_down
                    </span>
                  )}
                </Button>
              </div>
            ))}
          <Box>
            <Button
              size="large"
              disableElevation
              onClick={() => setActiveTab("new")}
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
