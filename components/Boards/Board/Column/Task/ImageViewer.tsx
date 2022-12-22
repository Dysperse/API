import { Box, Dialog, Icon, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import {
  neutralizeBack,
  revivalBack,
} from "../../../../../hooks/useBackButton";

export function ImageViewer({ url, trimHeight = false }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }}
        onClick={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }}
        PaperProps={{
          sx: {
            borderRadius: 5,
            width: { xs: "100%", sm: "auto" },
            height: "auto",
            maxWidth: "100vw",
            maxHeight: "calc(100vh - 20px)",
            "& img": {
              width: { xs: "100%", sm: "auto" },
              height: { xs: "auto", sm: "100%" },
              maxHeight: "calc(100vh - 20px)",
              maxWidth: "100vw",
            },
          },
        }}
      >
        <picture>
          <img src={url} alt="Modal" />
          <IconButton
            sx={{
              background: "black!important",
              color: "#fff",
              border: "none",
              boxShadow: "none",
              position: "absolute",
              top: 5,
              right: 5,
            }}
            onClick={() => setOpen(false)}
          >
            <Icon>close</Icon>
          </IconButton>
        </picture>
      </Dialog>
      <Box
        sx={{
          ...(!url && { display: "none" }),
          "&:hover": {
            filter: "brightness(90%)",
            cursor: "pointer",
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
      >
        <picture>
          <img
            alt="asdf"
            draggable={false}
            src={url}
            style={{
              width: "100%",
              borderRadius: "15px",
              height: "100%",
              ...(trimHeight && {
                maxHeight: "100px",
              }),
              objectFit: "cover",
            }}
          />
        </picture>
      </Box>
    </>
  );
}
