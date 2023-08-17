import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Icon, Menu, MenuItem } from "@mui/material";
import React, { cloneElement, useContext, useState } from "react";
import { SelectionContext } from "../Layout";
import { ShareProgress } from "./ShareProgress";

interface AgendaColumnProps {
  mutationUrl: string;
  view: string;
  day: any;
  data: any;
  navigation: number;
}

export const ColumnMenu = React.memo(function ColumnMenu({
  day,
  tasksLeft,
  data,
  children,
}: any) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const selection = useContext(SelectionContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const trigger = cloneElement(children, {
    onClick: handleClick,
  });

  return (
    <>
      {trigger}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            selection.set([...new Set([...selection.values, "-1"])]);
          }}
        >
          <Icon>select</Icon>
          Select
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            selection.set([
              ...new Set([...selection.values, ...data.map((task) => task.id)]),
            ]);
          }}
        >
          <Icon>select_all</Icon>
          Select all
        </MenuItem>

        <ShareProgress data={data} tasksLeft={tasksLeft} day={day}>
          <MenuItem disabled={data.length == 0 || data.length === tasksLeft}>
            <Icon>ios_share</Icon>
            Share progress
          </MenuItem>
        </ShareProgress>
      </Menu>
    </>
  );
});
