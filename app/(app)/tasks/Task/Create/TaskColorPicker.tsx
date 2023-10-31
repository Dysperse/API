import { Puller } from "@/components/Puller";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import {
  Box,
  Icon,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  colors,
} from "@mui/material";
import React, { cloneElement, useState } from "react";

export const TaskColorPicker = React.memo(function TaskColorPicker({
  children,
  color,
  setColor,
  titleRef,
}: any) {
  const [open, setOpen] = useState(false);
  const trigger = cloneElement(children, {
    onClick: () => setOpen(true),
  });
  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={() => {
          setOpen(false);
          titleRef?.current?.focus();
        }}
        anchor="bottom"
      >
        <Puller showOnDesktop />
        <Box sx={{ p: 2, pt: 0 }}>
          {[
            "grey",
            "pink",
            "purple",
            "indigo",
            "blue",
            "cyan",
            "teal",
            "green",
            "yellow",
            "orange",
            "brown",
          ].map((colorChoice) => (
            <ListItemButton
              key={colorChoice}
              selected={color === colorChoice}
              onClick={() => {
                setColor(colorChoice);
                setOpen(false);
              }}
            >
              <Box
                sx={{
                  background: colors[colorChoice][500],
                  width: 15,
                  height: 15,
                  borderRadius: 999,
                }}
              />
              <ListItemText
                primary={capitalizeFirstLetter(
                  colorChoice.replace("grey", "default")
                )}
              />
              {color === colorChoice && <Icon sx={{ ml: "auto" }}>check</Icon>}
            </ListItemButton>
          ))}
        </Box>
      </SwipeableDrawer>
    </>
  );
});
