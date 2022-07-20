import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import Webcam from "react-webcam";

const WebcamComponent = () => (
  <div
    style={{
      borderRadius: "28px",
      overflow: "hidden",
      height: "calc(70vh - 25px)",
      background: "#444444",
      width: "100%",
    }}
  >
    <Box
      sx={{
        height: "112px",
        overflow: "hidden",
        borderRadius: "28px 28px 0 0",
      }}
    >
      <Webcam style={{ width: "100%", filter: "blur(20px)" }} />
    </Box>
    <Webcam
      style={{
        zIndex: 1,
        position: "relative",
        width: "100%",
        marginTop: "-10px",
      }}
    />
    <Box
      sx={{
        height: "112px",
        mt: -1,
        zIndex: -1,
        overflow: "hidden",
        borderRadius: "0 0 28px 28px",
      }}
    >
      <Webcam style={{ width: "100%", filter: "blur(20px)" }} />
    </Box>
  </div>
);

export default function Scan() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        background: "#333333",
        color: "#fff",
      }}
    >
      <Box sx={{ p: "20px", mx: "auto", maxWidth: "500px" }}>
        <WebcamComponent />
        <Box
          sx={{
            background: "#444444",
            borderRadius: "28px",
            height: "calc(30vh - 35px)",
            mt: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ textAlign: "center", fontWeight: "700" }}
              >
                Microwave
              </Typography>
              <Typography sx={{ textAlign: "center" }}>
                Detected item
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
