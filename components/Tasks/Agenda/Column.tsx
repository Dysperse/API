import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Icon, IconButton, Menu, MenuItem } from "@mui/material";
import dynamic from "next/dynamic";
import React, { useContext, useState } from "react";
import { SelectionContext } from "../Layout";
import { ShareProgress } from "./ShareProgress";
const Image = dynamic(() => import("next/image"), { ssr: false });

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

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          ml: "auto",
          color: palette[9],
          mr: -1,
          ...(selection.values.length > 0 && { opacity: 0 }),
        }}
      >
        <Icon className="outlined">more_horiz</Icon>
      </IconButton>
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
