import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Button, Icon } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { recentlyAccessed } from ".";

export const Tab = React.memo(function Tab({ styles, board }: any) {
  const router = useRouter();
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const isActive = router.asPath.includes(board.id);

  const handleClick = () => {
    router.push(`/tasks/boards/${board.id}`);
    recentlyAccessed.set({
      icon: "view_kanban",
      label: board.name,
      path: `/tasks/boards/${board.id}`,
    });
  };

  const tasks =
    board?.columns &&
    board.columns.reduce((acc, current) => acc + current._count.tasks, 0);

  return (
    <span>
      <Button
        size="large"
        onClick={handleClick}
        sx={{
          ...styles(palette, isActive),
          ...(board.archived &&
            !isActive && {
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
              opacity: router.asPath ? 1 : 0.8,
            }}
            className="outlined"
          >
            view_kanban
          </Icon>
          <span
            style={{
              maxWidth: "calc(100% - 25px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              opacity: router.asPath ? 1 : 0.9,
              whiteSpace: "nowrap",
            }}
          >
            {board.name}
          </span>
          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            {board.pinned && (
              <Icon
                className="outlined"
                sx={{
                  transform: "rotate(-45deg)",
                }}
              >
                push_pin
              </Icon>
            )}
            <span style={{ opacity: 0.6 }}>{tasks !== 0 && tasks}</span>
            <Icon>arrow_forward_ios</Icon>
          </Box>
        </Box>
      </Button>
    </span>
  );
});
