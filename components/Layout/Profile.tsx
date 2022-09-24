import Box from "@mui/material/Box";
import React from "react";
import { useStatusBar } from "../../hooks/useStatusBar";
import Settings from "../Settings/index";

/**
 * Profile menu
 * @param {any} {children}
 * @returns {any}
 */
export function ProfileMenu({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);

  useStatusBar(open);

  return (
    <Settings>
      <Box onClick={() => setOpen(true)}>{children}</Box>
    </Settings>
  );
}
