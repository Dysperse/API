import { SelectionContext } from "@/app/(app)/tasks/selection-context";
import { useBackButton } from "@/lib/client/useBackButton";
import { Icon, Menu, MenuItem } from "@mui/material";
import { Dayjs } from "dayjs";
import React, { cloneElement, useContext, useState } from "react";
import { ShareProgress } from "./ShareProgress";

interface ColumnMenuProps {
  day: Date | Dayjs;
  data: any;
  children: JSX.Element;
}

export const ColumnMenu = React.memo(function ColumnMenu({
  day,
  data,
  children,
}: ColumnMenuProps) {
  const selection = useContext(SelectionContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useBackButton({
    open,
    callback: () => setAnchorEl(null),
    hash: `column-menu`,
  });

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

        <ShareProgress data={data} day={day}>
          <MenuItem>
            <Icon>ios_share</Icon>
            Share progress
          </MenuItem>
        </ShareProgress>
      </Menu>
    </>
  );
});
