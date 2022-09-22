import Box from "@mui/material/Box";
import React from "react";
import { useStatusBar } from "../../hooks/useStatusBar";
import Settings from "../Settings/index";

/**
 * Profile menu
 * @param {any} props
 * @returns {any}
 */
export function ProfileMenu(props: any): any {
  const [open, setOpen] = React.useState<boolean>(false);

  useStatusBar(open);

  return (
    <Settings>
      <Box onClick={() => setOpen(true)}>{props.children}</Box>
    </Settings>
  );
}
