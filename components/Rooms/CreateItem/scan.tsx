import {
  AppBar,
  Box,
  Chip,
  CircularProgress,
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
import { toastStyles } from "../../../lib/useCustomTheme";
import { useAccountStorage, useSession } from "../../../pages/_app";
import { capitalizeFirstLetter } from "../../ItemPopup";

const WebcamComponent = ({
  setTitle,
  setQuantity,
  setOpen,
  facingMode,
  room,
}) => {
  const [forever, setForever] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const webcamRef: any = React.useRef(null);

  const capture = React.useCallback(async () => {
    try {
      setLoading(true);
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

      let qty = "1";
      let title = capitalizeFirstLetter(response[0].label);
      if (title.includes(", ")) title = title.split(", ")[0];

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
      setLoading(false);
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
        screenshotQuality={0.9}
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
          ...(loading && {
            opacity: 0.5,
            pointerEvents: "none",
          }),
          "&:active": {
            transition: "none",
            transform: "translateX(-50%) scale(.9)",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 99,
        }}
        onClick={capture}
      >
        <CircularProgress />
      </Box>
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
  room: any;
  foreverRequired?: boolean;
}) {
  const [open, setOpen] = React.useState(foreverRequired);
  const [facingMode, setFacingMode] = React.useState("environment");

  React.useEffect(() => {
    const tag: any = document.querySelector(`meta[name="theme-color"]`);
    tag.content = open
      ? "#000000"
      : session?.user?.darkMode
      ? "hsl(240,11%,10%)"
      : "#fff";
  }, [open]);

  const session = useSession();
  const storage = useAccountStorage();

  return (
    <>
      <Box sx={{ pt: 2 }}>
        <Fab
          id="scanTrigger"
          disabled={storage?.isReached === true}
          size="large"
          onClick={() => setOpen(true)}
          sx={{
            ...(storage?.isReached === true && { opacity: 0.6 }),
            color: "#000!important",
            boxShadow: "none!important",
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
            maxWidth: "600px",
            border: 0,
            background: "black",
          },
        }}
      >
        <AppBar
          sx={{
            zIndex: 999,
            color: "#fff",
            height: "var(--navbar-height)",
            border: 0,
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
                  color: "#000",
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
