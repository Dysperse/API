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

export function TasksLayout() {
  const { data, error } = useApi("property/boards");
  const [activeTab, setActiveTab] = useState(data ? data[0].id : "new");
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      containScroll: "keepSnaps",
      dragFree: true,
    },
    [WheelGesturesPlugin()]
  );

  useEffect(() => {
    if (data && !error && data[0]) {
      setActiveTab(data[0].id);
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
      <Box ref={emblaRef}>
        <div className="embla__container">
          {data &&
            data.map((board) => (
              <div>
                <Button
                  size="large"
                  disableElevation
                  onClick={() => setActiveTab(board.id)}
                  sx={{ ...styles(activeTab === board.id), ml: 4}}
                >
                  {board.name}
                </Button>
              </div>
            ))}
          <div>
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
          </div>
        </div>
      </Box>

      <Box>{activeTab === "new" && <CreateBoard />}</Box>
      {data &&
        data.map((board) => activeTab === board.id && <Board board={board} />)}
    </Box>
  );
}
