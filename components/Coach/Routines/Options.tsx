import { Box, Icon, ListItemButton, SwipeableDrawer } from "@mui/material";
import { red } from "@mui/material/colors";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { fetchRawApi } from "../../../lib/client/useApi";
import { toastStyles } from "../../../lib/client/useTheme";
import { ConfirmationModal } from "../../ConfirmationModal";
import { Puller } from "../../Puller";
import { CustomizeRoutine } from "./Customize";
import { EditRoutine } from "./Edit";

export function RoutineOptions({ mutationUrl, setData, optionsRef, routine }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div ref={optionsRef} onClick={handleOpen} style={{ display: "none" }} />
      <SwipeableDrawer
        open={open}
        anchor="bottom"
        BackdropProps={{
          className: "override-bg",
          sx: {
            backdropFilter: "blur(5px)",
            background: "transparent",
          },
        }}
        sx={{
          zIndex: "999999!important",
        }}
        ModalProps={{ keepMounted: false }}
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            background: "hsl(240, 11%, 15%)",
            color: "hsl(240, 11%, 90%)",
            maxWidth: { sm: "300px" },
            borderRadius: 5,
            m: 2,
            mx: { sm: "auto" },
            userSelect: "none",
          },
        }}
      >
        <Box
          sx={{
            "& .puller": { background: "hsl(240, 11%, 30%)" },
          }}
        >
          <Puller />
        </Box>
        <Box sx={{ p: 2, pt: 0, mt: -2 }}>
          <CustomizeRoutine routine={routine} setData={setData} />
          <EditRoutine routine={routine} setData={setData} />
          <ConfirmationModal
            title="Are you sure you want to delete this routine?"
            question="Your progress will stay safe and your goals won't be deleted"
            callback={async () => {
              await fetchRawApi("user/routines/custom-routines/delete", {
                id: routine.id,
              });
              await mutate(mutationUrl);
              toast.success("Deleted!", toastStyles);
            }}
          >
            <ListItemButton
              sx={{
                color: red["A200"],
                gap: 2,
              }}
            >
              <Icon className="outlined">delete</Icon>
              Delete
            </ListItemButton>
          </ConfirmationModal>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
