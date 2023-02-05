import {
  AppBar,
  Box,
  Chip,
  Drawer,
  Fab,
  Icon,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import toast from "react-hot-toast";
import Webcam from "react-webcam";
import { fetchApiWithoutHook } from "../../../hooks/useApi";
import { colors } from "../../../lib/colors";
import { toastStyles } from "../../../lib/useCustomTheme";

const WebcamComponent = ({
  setTitle,
  setQuantity,
  setOpen,
  facingMode,
  room,
}) => {
  const [forever, setForever] = React.useState(false);
  const webcamRef: any = React.useRef(null);

  const capture = React.useCallback(async () => {
    try {
      const imageSrc = webcamRef.current.getScreenshot();

      const webcamContainer: any = document.getElementById("webcamContainer");
      webcamContainer.style.opacity = "0";
      setTimeout(() => {
        webcamContainer.style.opacity = "1";
      }, 100);

      const response = await fetch("/api/property/inventory/items/scan", {
        method: "POST",
        body: JSON.stringify({
          imageUrl: imageSrc,
        }),
      })
        .then((res) => res.json())
        .catch((err) => {
          throw new Error(err.message);
        });

      let text = response.includes("sitting")
        ? response.split("sitting")[0]
        : response;
      text = text.replace("a person holding", "");
      text = text.replace("in their hand", "");
      if (text.includes("holding a")) text = text.split("holding a")[1];
      if (text.includes("on top")) text = text.split("on top")[0];
      if (text.includes("over")) text = text.split("over")[0];
      let title = text.includes(" of ") ? text.split(" of ")[1] : text;
      let qty = "1";
      [
        "jar",
        "container",
        "pair",
        "box",
        "pack",
        "packet",
        "package",
        "bottle",
        "bag",
        "canister",
      ].forEach((word) => {
        if (text.includes(word)) {
          qty = "1 " + word;
        }
      });
      title = text.includes("filled with")
        ? text.split("filled with")[1]
        : text;
      title = text.replace("jar of", "");
      if (title.startsWith(" an ")) title = title.replace(" an ", "");
      if (title.startsWith(" a ")) title = title.replace(" a ", "");
      text = text.replace("in their hand", "");
      title = title.trim();
      title = title.charAt(0).toUpperCase() + title.slice(1);
      if (forever) {
        await fetchApiWithoutHook("property/inventory/items/create", {
          room: room.toString().toLowerCase(),
          name: title,
          quantity: qty,
          category: "[]",
          lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        });
        toast(
          <Box>
            <Typography variant="h6">Item added</Typography>
            <Typography variant="body1">
              {title} &bull; {qty}
            </Typography>
          </Box>,
          toastStyles
        );
      } else {
        setTitle(title);
        setQuantity(qty);
        setOpen(false);
        return "Success";
      }
    } catch (err: any) {
      toast.error("Error: " + err.message, toastStyles);
    }
  }, [forever, webcamRef, setTitle, setQuantity, setOpen, room]);

  const videoConstraints = {
    facingMode:
      facingMode === "user"
        ? "user"
        : {
            exact: "environment",
          },
  };

  return (
    <>
      <Webcam
        screenshotQuality={0.6}
        audio={false}
        ref={webcamRef}
        id="webcamContainer"
        screenshotFormat="image/png"
        videoConstraints={videoConstraints}
        width={"100vw"}
        height={"100vh"}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transition: "opacity .1s",
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
      <Box
        sx={{
          position: "absolute",
          bottom: 30,
          right: 20,
          backdropFilter: "blur(10px)",
          width: 50,
          height: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          transition: "transform .2s",
          color: "#fff",
          "&:active": {
            transition: "none",
            transform: "scale(.9)",
          },
          borderRadius: 99,
          ...(forever && {
            background: "linear-gradient(-25deg, #aaa 30%, #fff 90%)",
            color: "#000",
          }),
        }}
        onClick={() => setForever(!forever)}
      >
        <Icon>all_inclusive</Icon>
      </Box>
    </>
  );
};

export default function ImageRecognition({
  setQuantity,
  setTitle,
  room,
  foreverRequired = false,
}: {
  setQuantity?: any;
  setTitle?: any;
  foreverRequired?: boolean;
}) {
  const [open, setOpen] = React.useState(foreverRequired);
  const [facingMode, setFacingMode] = React.useState("environment");

  React.useEffect(() => {
    const tag: any = document.querySelector(`meta[name="theme-color"]`);
    tag.content = open ? "#000000" : colors[themeColor]["200"];
  }, [open]);

  return (
    <>
      <Box sx={{ pt: 2 }}>
        <Fab
          id="scanTrigger"
          size="large"
          onClick={() => setOpen(true)}
          sx={{
            color: "#000",
            background: "linear-gradient(45deg, #fc00ff, #00dbde)!important",
            "&:hover": {
              background: "linear-gradient(45deg, #00dbde, #fc00ff)!important",
            },
            position: "fixed",
            bottom: 0,
            right: 0,
            gap: 2,
            textTransform: "none",
            m: 3,
          }}
          className="shadow-lg hover:shadow-xl"
          variant="extended"
        >
          <Icon className="outlined">photo_camera</Icon>
          Scan items
        </Fab>
      </Box>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "100vw",
            background: "black",
          },
        }}
      >
        <AppBar
          elevation={0}
          position="static"
          sx={{
            zIndex: 999,
            color: "#fff",
            height: "var(--navbar-height)",
            background: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,0))",
          }}
        >
          <Toolbar
            className="flex"
            sx={{
              height: "var(--navbar-height)",
            }}
          >
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <Icon>west</Icon>
            </IconButton>
            <Typography
              component="div"
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
              disabled={foreverRequired}
              onClick={() =>
                setFacingMode(facingMode === "user" ? "environment" : "user")
              }
            >
              <Icon className={facingMode === "user" ? "outlined" : "rounded"}>
                cameraswitch
              </Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <WebcamComponent
          room={room}
          setTitle={setTitle}
          setQuantity={setQuantity}
          setOpen={setOpen}
          facingMode={facingMode}
        />
      </Drawer>
    </>
  );
}
