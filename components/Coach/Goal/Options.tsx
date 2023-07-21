import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { toastStyles } from "@/lib/client/useTheme";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Select,
  SwipeableDrawer,
} from "@mui/material";
import html2canvas from "html2canvas";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { ConfirmationModal } from "../../ConfirmationModal";
import { ShareGoal } from "./Share";

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

export const exportAsImage = async (el, imageFileName) => {
  const canvas = await html2canvas(el, { backgroundColor: null });
  const image = canvas.toDataURL("image/png", 1.0);
  downloadImage(image, imageFileName);
};

function ChangeTime({ goal, mutationUrl }) {
  const session = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [time, setTime] = useState<number>(goal.timeOfDay);
  const [loading, setLoadinng] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setLoadinng(true);
      await fetchRawApi(session, "user/coach/goals/update", {
        id: goal.id,
        timeOfDay: time,
      });
      setOpen(false);
      await mutate(mutationUrl);
      toast.success("Time changed!", toastStyles);
    } catch (e) {
      toast.error("Something went wrong! Please try again later", toastStyles);
      setLoadinng(false);
      setOpen(false);
    }
  };

  return (
    <>
      <MenuItem onClick={() => setOpen(true)}>
        <Icon className="outlined">edit</Icon>
        Change time
      </MenuItem>

      <SwipeableDrawer
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        anchor="bottom"
        sx={{ zIndex: 999999 }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Puller showOnDesktop />
        <Box sx={{ p: 3, pt: 0 }}>
          <Select
            value={time}
            fullWidth
            MenuProps={{
              sx: {
                zIndex: 999999999999,
              },
            }}
            onChange={(e) => setTime(parseInt(e.target.value as string))}
          >
            {[...Array(24).keys()].map((hour) => (
              <MenuItem key={hour} value={hour}>
                {(hour % 12 || 12) + (hour >= 12 ? " PM" : " AM")}
              </MenuItem>
            ))}
          </Select>
          <LoadingButton
            onClick={handleSubmit}
            loading={loading}
            fullWidth
            sx={{ mt: 2 }}
            variant="contained"
          >
            <Icon>check</Icon>
            Done
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export function MoreOptions({ goal, mutationUrl, setOpen }): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const session = useSession();

  const handleStop = () => {
    handleClose();
    fetchRawApi(session, "user/coach/goals/delete", {
      id: goal.id,
    }).then(async () => {
      await mutate(mutationUrl);
      setOpen(false);
    });
  };

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <ShareGoal goal={goal}>
          <MenuItem>
            <Icon>ios_share</Icon>
            Share
          </MenuItem>
        </ShareGoal>
        <ChangeTime goal={goal} mutationUrl={mutationUrl} />
        <ConfirmationModal
          title="Stop goal?"
          question="Are you sure you want to stop working towards this goal? ALL your progress will be lost FOREVER. You won't be able to undo this action!"
          callback={handleStop}
        >
          <MenuItem disabled={goal.completed}>
            <Icon className="outlined">stop</Icon> Stop goal
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
