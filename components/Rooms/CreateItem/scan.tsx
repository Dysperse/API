import {
  AppBar,
  Box,
  Chip,
  Drawer,
  Icon,
  IconButton,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import useWindowSize from "react-use/lib/useWindowSize";
import Webcam from "react-webcam";
import { colors } from "../../../lib/colors";

const WebcamComponent = ({ formik, setOpen, facingMode, setFacingMode }) => {
  const webcamRef: any = React.useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    toast.promise(
      fetch("/api/property/inventory/image-recognition", {
        method: "POST",
        body: JSON.stringify({
          imageUrl: imageSrc,
        }),
      })
        .then((res) => res.json())
        .then((res) => res)
        .catch((err) => {
          alert("Error: " + err.message);
        }),
      {
        loading: "Fetching image recognition...",
        success: (response) => {
          let text = response.includes("sitting") ? response.split("sitting")[0] : response; 
          text = text.replace("a person holding", "")
          if(text.includes("holding a")) text = text.split("holding a")[1];
          if(text.includes("on top")) text = text.split("on top")[0];
          let title = text.includes(" of ") ? text.split(" of ")[1]: text;
          let qty = text.includes(" of ") ? text.split(" of ")[0]: text
          qty = text.includes("filled with") ? text.split("filled with")[0]: text
          title = text.includes("filled with") ? text.split("filled with")[1]: text
          
          text = text.replace("in their hand", "")
          text = text.trim();
          formik.setFieldValue("title", title);
          formik.setFieldValue("quantity", qty);
          setOpen(false);
          return "Image recognition updated: " + response;
        },
        error: (e) => "Image recognition failed: " + e.message,
      }
    );
  }, [webcamRef, formik, setOpen]);

  const { width, height } = useWindowSize();

  const videoConstraints = {
    //width: width,
    //height: height,
    facingMode:
      facingMode == "user"
        ? "user"
        : {
            exact: "environment",
          },
  };

  return (
    <>
      <Webcam
        screenshotQuality={0.3}
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={videoConstraints}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          backdropFilter: "blur(10px)",
          width: 75,
          height: 75,
          left: "50%",
          transform: "translateX(-50%)",
          border: "5px solid #fff",
          cursor: "pointer",
          transition: "all .2s",
          "&:active": {
            transition: "none",
            transform: "translateX(-50%) scale(.9)",
          },
          borderRadius: 99,
        }}
        onClick={capture}
      />
    </>
  );
};

export function ImageRecognition({ formik }) {
  const [open, setOpen] = React.useState(false);
  const [facingMode, setFacingMode] = React.useState("user");

  React.useEffect(() => {
    const tag: any = document.querySelector(`meta[name="theme-color"]`);
    tag.content = open ? "#000000" : colors[themeColor]["200"];
  }, [open]);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);
  const id = popoverOpen ? "simple-popover" : undefined;

  React.useEffect(() => {
    setTimeout(() => {
      const btn: any = document.getElementById("scanTrigger");
      setAnchorEl(btn);
    }, 1000);
  }, []);

  return (
    <>
      <Box sx={{ pt: 2 }}>
        <Popover
          id={id}
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            elevation: 0,
            sx: {
              ml: 1,
              background: "#000",
              color: "#fff",
              maxWidth: "250px",
              borderRadius: 5,
            },
          }}
          BackdropProps={{
            sx: {
              opacity: "0!important",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography
              sx={{ mx: "auto", fontWeight: "600", display: "flex", gap: 2 }}
            >
              Scan
              <Chip
                size="small"
                label="BETA"
                sx={{
                  background: "linear-gradient(45deg, #fc00ff, #00dbde)",
                }}
              />
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Quickly scan items and build up your inventory. Now in public
              beta.
            </Typography>
          </Box>
        </Popover>
        <IconButton
          disableRipple
          id="scanTrigger"
          size="large"
          onClick={() => setOpen(true)}
          sx={{
            color: "#000",
            background: "linear-gradient(45deg, #fc00ff, #00dbde)!important",
          }}
        >
          <Icon className="outlined">view_in_ar</Icon>
        </IconButton>
      </Box>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "100vw",
            background: "#000",
          },
        }}
      >
        <AppBar
          elevation={0}
          position="static"
          sx={{
            zIndex: 999,
            background: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,0))",
          }}
        >
          <Toolbar className="flex" sx={{ height: "70px" }}>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <Icon>west</Icon>
            </IconButton>
            <Typography
              sx={{ mx: "auto", fontWeight: "600", display: "flex", gap: 2 }}
            >
              Scan
              <Chip
                size="small"
                label="BETA"
                sx={{
                  background: "linear-gradient(45deg, #fc00ff, #00dbde)",
                }}
              />
            </Typography>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => {
                setFacingMode(facingMode == "user" ? "environment" : "user");
              }}
            >
              <Icon className={facingMode == "user" ? "outlined" : "rounded"}>
                cameraswitch
              </Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <WebcamComponent
          formik={formik}
          setOpen={setOpen}
          facingMode={facingMode}
          setFacingMode={setFacingMode}
        />
      </Drawer>
    </>
  );
}
