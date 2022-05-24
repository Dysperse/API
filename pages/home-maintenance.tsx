import Box from "@mui/material/Box";

export default function Render() {
  return (
    <Box
      sx={{
        p: 3,
        mt: 5,
        mx: "auto",
        maxWidth: "calc(100vw - 50px)",
        borderRadius: 5,
        width: "500px",
        background: "rgba(200,200,200,.3)",
      }}
    >
      Coming soon!
    </Box>
  );
}
