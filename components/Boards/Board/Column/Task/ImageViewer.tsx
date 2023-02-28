import { Box, Button, Dialog, Icon, IconButton } from "@mui/material";
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
        }}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "auto" },
            background: "transparent",
            filter: "none",
            overflow: "visible",
            border: 0,
            height: "auto",
            borderRadius: 0,
            maxWidth: "100vw",
            maxHeight: "calc(100vh - 20px)",
          },
        }}
      >
        <Box
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            "& img": {
              width: { xs: "100%", sm: "auto" },
              height: { xs: "auto", sm: "100%" },
              maxHeight: "calc(100vh - 20px)",
              maxWidth: "100vw",
            },
            filter:
              "drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))",
          }}
        >
          <IconButton
            sx={{
              background: "black!important",
              color: "#fff!important",
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
          <picture>
            <img src={url} alt="Modal" />
          </picture>
        </Box>
        <Box>
          <Button
            href={url}
            onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(url);
            }}
            target="_blank"
            sx={{
              cursor: "pointer!important",
              width: "auto",
              mt: 1,
            }}
            size="small"
          >
            Open in browser
          </Button>
        </Box>
      </Dialog>
      <Box
        sx={{
          ...(!url && { display: "none" }),
          filter: "brightness(95%)",
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
              borderRadius: "5px",
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
