import Box from "@mui/material/Box";

export default function OfflinePage() {
  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        p: 1,
        boxSizing: "border-box",
        fontSize: "13px",
        color: "#505050"
      }}
    >
      <Box
        sx={{
          p: 4,
          background: "rgba(200,200,200,.3)",
          borderRadius: 5,
          maxWidth: "calc(100vw - 20px)",
          maxHeight: "calc(100vh - 20px)"
        }}
      >
        Please connect to the internet to access Smartlist. 
      </Box>
    </Box>
  ); 
}
