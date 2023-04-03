import { Icon, IconButton, Menu, MenuItem } from "@mui/material";
import html2canvas from "html2canvas";
import React from "react";
import { mutate } from "swr";
import { fetchRawApi } from "../../lib/client/useApi";
import { ConfirmationModal } from "../ConfirmationModal";
import { ShareGoal } from "./ShareGoal";

export const exportAsImage = async (el, imageFileName) => {
  const canvas = await html2canvas(el, { backgroundColor: null });
  const image = canvas.toDataURL("image/png", 1.0);
  downloadImage(image, imageFileName);
};
const downloadImage = (blob, fileName) => {
  const fakeLink: any = window.document.createElement("a");
  fakeLink.style = "display:none;";
  fakeLink.download = fileName;

  fakeLink.href = blob;

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
};

export function MoreOptions({ goal, mutationUrl, setOpen }): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <ShareGoal handleMenuClose={handleClose} goal={goal} />
        <ConfirmationModal
          title="Stop goal?"
          question="Are you sure you want to stop working towards this goal? ALL your progress will be lost FOREVER. You won't be able to undo this action!"
          callback={() => {
            handleClose();
            fetchRawApi("user/routines/delete", {
              id: goal.id,
            }).then(async () => {
              await mutate(mutationUrl);
              setOpen(false);
            });
          }}
        >
          <MenuItem disabled={goal.completed}>
            <Icon>stop</Icon> Stop goal
          </MenuItem>
        </ConfirmationModal>
      </Menu>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          color: "#000",
          position: "absolute",
          top: 0,
          right: 0,
          m: 3,
        }}
      >
        <Icon>more_vert</Icon>
      </IconButton>
    </>
  );
}
