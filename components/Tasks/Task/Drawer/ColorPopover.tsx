import { useSession } from "@/lib/client/session";
import { colors } from "@/lib/colors";
import { Box, Chip, Icon, Popover } from "@mui/material";
import { useState } from "react";
import { Color } from "./Color";
import { useTaskContext } from "./Context";

export function ColorPopover() {
  const session = useSession();
  const task = useTaskContext();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: any) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const trigger = (
    <Chip
      icon={
        <>
          <Icon
            {...(task.color === "grey" && { className: "outlined" })}
            sx={{
              color: task.color !== "grey" ? "#000!important" : "inherit",
              mr: -1.5,
              ml: 1.8,
            }}
          >
            label
          </Icon>
        </>
      }
      sx={{
        background:
          task.color === "grey"
            ? ``
            : colors[task.color][session.darkMode ? "A200" : 100] +
              "!important",
      }}
      onClick={handleClick}
      {...(task.color === "grey" && { variant: "outlined" })}
    />
  );

  return (
    <>
      {trigger}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            background: "transparent",
            boxShadow: 0,
          },
        }}
      >
        {trigger}
        <Box
          sx={{
            display: "flex",
            maxWidth: "60vw",
            mt: 2,
            gap: 1,
            flexWrap: "wrap",
          }}
          onClick={handleClose}
        >
          {[
            "orange",
            "red",
            "brown",
            "pink",
            "purple",
            "indigo",
            "teal",
            "green",
            "grey",
          ].map((color) => (
            <Color key={color} color={color} />
          ))}
        </Box>
      </Popover>
    </>
  );
}
