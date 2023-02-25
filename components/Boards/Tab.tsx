import { Box, Button, Icon } from "@mui/material";
import React from "react";

export const Tab = React.memo(function Tab({
  styles,
  activeTab,
  setDrawerOpen,
  setActiveTab,
  board,
}: any) {
  const handleClick = React.useCallback(() => {
    setDrawerOpen(false);
    window.location.hash = board.id;
    setActiveTab(board.id);
  }, [board.id, setActiveTab, setDrawerOpen]);

  return (
    <div>
      <Button
        size="large"
        disableRipple
        onClick={handleClick}
        onMouseDown={handleClick}
        sx={{
          ...styles(activeTab === board.id),
          ...(board.archived &&
            activeTab !== board.id && {
              opacity: 0.6,
            }),
        }}
      >
        <Box
          sx={{
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 1.5,
          }}
        >
          <Icon
            sx={{
              opacity: activeTab === board.id ? 1 : 0.8,
            }}
          >
            tag
          </Icon>
          <span
            style={{
              maxWidth: "calc(100% - 25px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              opacity: activeTab === board.id ? 1 : 0.9,
              whiteSpace: "nowrap",
            }}
          >
            {board.name}
          </span>
          {board.pinned && (
            <Icon
              className="outlined"
              sx={{
                ml: "auto",
                transform: "rotate(-45deg)",
              }}
            >
              push_pin
            </Icon>
          )}
        </Box>
      </Button>
    </div>
  );
});
