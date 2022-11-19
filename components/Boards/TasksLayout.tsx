import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import React, { useEffect, useState } from "react";
import { ErrorHandler } from "../error";
import { useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { Board } from "./Board";
import { CreateBoard } from "./CreateBoard";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Tab = React.memo(function ({
  styles,
  activeTab,
  setActiveTab,
  emblaApi,
  board,
}: any) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Rename</MenuItem>
        <MenuItem onClick={handleClose}>Delete board</MenuItem>
      </Menu>
      <Button
        size="large"
        disableElevation
        onClick={(e) => {
          if (emblaApi) {
            emblaApi.reInit({
              containScroll: "keepSnaps",
              dragFree: true,
            });
          }
          if (activeTab === board.id) {
            handleClick(e);
          } else {
            setActiveTab(board.id);
          }
        }}
        sx={styles(activeTab === board.id)}
      >
        {board.name}
        {activeTab === board.id && (
          <span className="material-symbols-outlined">expand_circle_down</span>
        )}
      </Button>
    </div>
  );
});

export function TasksLayout() {
  const { data, url, error } = useApi("property/boards");
  const [activeTab, setActiveTab] = useState(data ? data[0].id : "new");
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      containScroll: "keepSnaps",
      dragFree: true,
    },
    [WheelGesturesPlugin()]
  );

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit({
        containScroll: "keepSnaps",
        dragFree: true,
      });
    }
    if (data) {
      setActiveTab(data[0].id);
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
          maxWidth: { xs: "100vw", sm: "calc(100vw - 85px)" },
        }}
      >
        <Box className="embla__container" sx={{ pl: 4 }}>
          {data &&
            data.map((board) => (
              <Tab
                styles={styles}
                activeTab={activeTab}
                board={board}
                emblaApi={emblaApi}
                setActiveTab={setActiveTab}
              />
            ))}
          <Box>
            <Button
              size="large"
              disableElevation
              onClick={() => {
                setActiveTab("new");
                emblaApi?.reInit({
                  containScroll: "keepSnaps",
                  dragFree: true,
                });
              }}
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
