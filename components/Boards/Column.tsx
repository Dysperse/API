import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { CreateTask } from "./CreateTask";
import { Task } from "./Task";
import React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { colors } from "../../lib/colors";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { mutate } from "swr";

function OptionsMenu({ mutationUrl, boardId, column }) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const styles = {
    width: "100%",
    borderRadius: 5,
    transition: "none!important",
    justifyContent: "start",
    gap: 2,
    "&:hover": {
      backgroundColor: colors[themeColor]["100"] + "!important",
    },
  };
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          elevation: 0,
          sx: {
            maxWidth: "400px",
            maxHeight: "400px",
            width: "auto",
            p: 1,
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
            mx: "auto",
            mb: { sm: 5 },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            py: 2,
            mb: 1,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <img src={column.emoji} alt="emoji" width="30" height="30" />
          <Typography variant="h6" sx={{ fontWeight: "700" }}>
            {column.name}
          </Typography>
        </Box>
        <Button sx={styles} size="large">
          <span className="material-symbols-outlined">
            drive_file_rename_outline
          </span>
          Rename
        </Button>
        <Button sx={styles} size="large">
          <span className="material-symbols-outlined">
            sentiment_very_satisfied
          </span>
          Edit emoji
        </Button>
        <LoadingButton
          loading={loading}
          sx={styles}
          size="large"
          onClick={async () => {
            setLoading(true);
            await fetchApiWithoutHook("property/boards/deleteColumn", {
              id: column.id,
            });
            await mutate(mutationUrl);
            setLoading(false);
            setOpen(false);
          }}
        >
          <span className="material-symbols-outlined">delete</span>
          Delete column
        </LoadingButton>
      </SwipeableDrawer>
      <IconButton
        size="small"
        onClick={() => setOpen(true)}
        disableRipple
        sx={{
          ml: "auto",
          transition: "none!important",
          border: "1px solid rgba(200, 200, 200, 0)!important",
          "&:hover,&:active": {
            color: "#000",
            border: "1px solid rgba(200, 200, 200, 0.5)!important",
          },
        }}
      >
        <span className="material-symbols-outlined">more_horiz</span>
      </IconButton>
    </>
  );
}

export const Column = React.memo(function ({
  mutationUrl,
  boardId,
  column,
}: any) {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(200, 200, 200, 0.2)",
        width: "350px",
        flex: "0 0 350px",
        border: "0px solid rgba(200, 200, 200, 0.4)",
        p: 3,
        pt: 4,
        px: 2,
        borderRadius: 5,
      }}
    >
      <Box sx={{ px: 1 }}>
        <img src={column.emoji} />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          px: 1,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "600",
            mb: 2,
            mt: 1,
            textDecoration: "underline",
          }}
        >
          {column.name}
        </Typography>
        <OptionsMenu
          boardId={boardId}
          column={column}
          mutationUrl={mutationUrl}
        />
      </Box>
      {column.tasks
        .filter((task) => task.parentTasks.length === 0)
        .map((task) => (
          <Task task={task} />
        ))}

      <CreateTask
        mutationUrl={mutationUrl}
        boardId={boardId}
        columnId={column.id}
      />
    </Box>
  );
});
