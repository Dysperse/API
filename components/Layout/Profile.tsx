import React, { useEffect } from "react";
import Settings from "../Settings/index";
import Box from "@mui/material/Box";
import { colors } from "../../lib/colors";
import { useStatusBar } from "../../hooks/useStatusBar";

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
